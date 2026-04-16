import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// ─── System prompt ────────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalysisResult {
  issue: string;
  why: string;
  fix: string[];
  drill: string;
  confidence: number;
}

// ─── OpenRouter call ──────────────────────────────────────────────────────────

async function callOpenRouter(frameBase64s: string[]): Promise<AnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
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
  try {
    const body = await request.json() as { frames?: unknown };
    const frames = body.frames;

    if (!Array.isArray(frames) || frames.length === 0) {
      return NextResponse.json(
        { error: "No frames received. Please try uploading again." },
        { status: 400 }
      );
    }

    if (frames.length > 10) {
      return NextResponse.json(
        { error: "Too many frames. Maximum is 10." },
        { status: 400 }
      );
    }

    const frameStrings = frames.map((f) => String(f));
    const result = await callOpenRouter(frameStrings);
    return NextResponse.json(result);

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Analysis error:", message);

    if (message.includes("OPENROUTER_API_KEY")) {
      return NextResponse.json(
        { error: "API key not configured. Add OPENROUTER_API_KEY in your Vercel environment variables." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Analysis failed. Please try again with a clearer video." },
      { status: 500 }
    );
  }
}
