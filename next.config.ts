import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Don't bundle native binary packages — let Node.js require them at runtime
  serverExternalPackages: [
    "fluent-ffmpeg",
    "@ffmpeg-installer/ffmpeg",
    "@ffprobe-installer/ffprobe",
  ],
};

export default nextConfig;
