import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir, rm } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";

// Wire up binaries
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

// Route config — allow long-running requests and large bodies
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// ─── Constants ────────────────────────────────────────────────────────────────

const NUM_FRAMES = 6;
const FRAME_QUALITY = 4;    // 1=best JPEG, 31=worst
const FRAME_MAX_WIDTH = 768; // px — enough for vision analysis
const MAX_FILE_SIZE_MB = 200;

const SYSTEM_PROMPT = `You are a professional golf coach analyzing frames extracted from a swing video.

Your job:
- Identify the single most impactful swing fault visible in the frames
- Explain it in plain language an amateur golfer will immediately understand
- Give specific, actionable fixes — no vague advice
- Recommend one concrete drill to fix the fault

Tone: calm, expert, direct. Like a PGA teaching pro.

Rules:
- Do NOT use biomechanics jargon (e.g. avoid "kinematic chain", "torque differential")
- Keep "why" to 1-2 sentences max
- Each "fix" item should be one specific, doable action
- "drill" should name the drill and describe it in one sentence
- "confidence" reflects how clearly the fault is visible (1 = very unclear video, 10 = crystal clear)

Return ONLY valid JSON — no markdown, no code blocks, no extra text:

{
  "issue": "Short fault name (e.g. 'Slice — Open Clubface at Impact')",
  "why": "Plain-English explanation of the root cause",
  "fix": ["Specific fix 1", "Specific fix 2", "Specific fix 3"],
  "drill": "Drill name — one-sentence description of how to perform it",
  "confidence": <integer 1-10>
}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err || !metadata?.format?.duration) {
        console.warn("ffprobe failed, defaulting to 5s duration:", err?.message);
        resolve(5);
      } else {
        resolve(metadata.format.duration);
      }
    });
  });
}

function extractSingleFrame(
  videoPath: string,
  timestamp: number,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .seekInput(Math.max(0, timestamp))
      .frames(1)
      .outputOptions([
        `-q:v ${FRAME_QUALITY}`,
        `-vf scale='min(${FRAME_MAX_WIDTH},iw)':-2`,
      ])
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });
}

async function extractFrames(
  videoPath: string,
  framesDir: string
): Promise<string[]> {
  const duration = await getVideoDuration(videoPath);

  // Sample at 10%, 26%, 42%, 58%, 74%, 90% — avoids very start/end of clip
  const percentages = [0.1, 0.26, 0.42, 0.58, 0.74, 0.9];
  const framePaths: string[] = [];

  for (let i = 0; i < NUM_FRAMES; i++) {
    const timestamp = percentages[i] * duration;
    const framePath = path.join(
      framesDir,
      `frame_${String(i + 1).padStart(3, "0")}.jpg`
    );
    try {
      await extractSingleFrame(videoPath, timestamp, framePath);
      framePaths.push(framePath);
    } catch (err) {
      console.warn(`Frame ${i + 1} extraction failed (ts=${timestamp.toFixed(2)}s):`, err);
    }
  }

  return framePaths;
}

interface AnalysisResult {
  issue: string;
  why: string;
  fix: string[];
  drill: string;
  confidence: number;
}

async function callOpenRouter(frameBase64s: string[]): Promise<AnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
  }

  const imageContent = frameBase64s.map((b64) => ({
    type: "image_url" as const,
    image_url: { url: `data:image/jpeg;base64,${b64}` },
  }));

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://impactai.app",
      "X-Title": "ImpactAI",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            ...imageContent,
            {
              type: "text",
              text: "Analyze this golf swing across all frames. Identify the main fault and return only the JSON.",
            },
          ],
        },
      ],
      max_tokens: 600,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenRouter ${response.status}: ${body}`);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";

  // Strip markdown code fences if the model wraps the JSON
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`No JSON found in model response:\n${content}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as Partial<AnalysisResult>;

  // Validate and normalise
  return {
    issue: String(parsed.issue ?? "Swing fault detected"),
    why: String(parsed.why ?? "The cause could not be determined from this footage."),
    fix: Array.isArray(parsed.fix)
      ? parsed.fix.slice(0, 4).map(String)
      : ["Work with a coach to identify and correct this fault."],
    drill: String(parsed.drill ?? "Slow-motion rehearsals in front of a mirror."),
    confidence: Math.min(10, Math.max(1, Math.round(Number(parsed.confidence ?? 5)))),
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const sessionId = randomUUID();
  const sessionDir = path.join("/tmp", "impactai", sessionId);
  const framesDir = path.join(sessionDir, "frames");

  try {
    // 1. Parse multipart body
    const formData = await request.formData();
    const videoFile = formData.get("video") as File | null;

    if (!videoFile || videoFile.size === 0) {
      return NextResponse.json(
        { error: "No video file received. Please select a video and try again." },
        { status: 400 }
      );
    }

    if (videoFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Video is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.` },
        { status: 413 }
      );
    }

    // 2. Write video to temp storage
    await mkdir(framesDir, { recursive: true });
    const ext = (videoFile.name.split(".").pop() ?? "mp4").toLowerCase();
    const videoPath = path.join(sessionDir, `video.${ext}`);
    const videoBytes = Buffer.from(await videoFile.arrayBuffer());
    await writeFile(videoPath, videoBytes);

    console.log(`[${sessionId}] Video saved: ${(videoFile.size / 1024 / 1024).toFixed(1)} MB`);

    // 3 + 4. Extract frames
    const framePaths = await extractFrames(videoPath, framesDir);

    if (framePaths.length === 0) {
      return NextResponse.json(
        { error: "Could not extract frames from this video. Please try a different file." },
        { status: 422 }
      );
    }

    console.log(`[${sessionId}] Extracted ${framePaths.length} frames`);

    // 5. Read frames as base64
    const frameBase64s = await Promise.all(
      framePaths.map(async (p) => (await readFile(p)).toString("base64"))
    );

    // 6 + 7. Call OpenRouter
    console.log(`[${sessionId}] Calling OpenRouter with ${frameBase64s.length} frames…`);
    const result = await callOpenRouter(frameBase64s);
    console.log(`[${sessionId}] Analysis complete: "${result.issue}"`);

    // 8. Return structured response
    return NextResponse.json(result);

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[${sessionId}] Analysis failed:`, message);

    // Surface useful error messages to the frontend
    if (message.includes("OPENROUTER_API_KEY")) {
      return NextResponse.json(
        { error: "API key not configured. Add OPENROUTER_API_KEY to .env.local." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Analysis failed. Please try again with a clearer video." },
      { status: 500 }
    );

  } finally {
    // 9. Always clean up temp files
    rm(sessionDir, { recursive: true, force: true }).catch(() => {});
  }
}
