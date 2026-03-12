import fs from "fs";
import path from "path";
import type { NextConfig } from "next";

const cwd = process.cwd();
const clientRootCandidate = path.join(cwd, "client");
const turbopackRoot = fs.existsSync(path.join(clientRootCandidate, "package.json"))
  ? clientRootCandidate
  : cwd;

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
