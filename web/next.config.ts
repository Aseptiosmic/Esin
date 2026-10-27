import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["*.e2b.app"],
  // Mirrors vercel.json for local/self-hosted previews as well.
  async headers() {
    return [
      { source: "/version.json", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
      { source: "/app-release.apk", headers: [
        { key: "Content-Type", value: "application/vnd.android.package-archive" },
        { key: "Content-Disposition", value: 'attachment; filename="esin.apk"' },
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
      ] },
    ];
  },
};
export default nextConfig;
