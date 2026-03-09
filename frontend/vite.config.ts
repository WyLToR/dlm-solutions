import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = path.resolve(process.cwd(), "..");
  const env = loadEnv(mode, envDir, "");
  const apiTarget = env.VITE_API_URL || "http://localhost:5190";

  return {
    plugins: [vue()],
    envDir,
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
