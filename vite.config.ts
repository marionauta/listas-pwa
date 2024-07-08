import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA as pwa } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  base: "/",

  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },

  plugins: [
    wasm(),
    react(),
    pwa({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,png,wasm}"],
      },
      manifest: {
        id: "/",
        name: "Lists",
        start_url: "/",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "icon.png",
            sizes: "1024x1024",
            type: "image/png",
          },
        ],
      },
      devOptions: { enabled: true },
    }),
  ],
});
