import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: resolve(__dirname, "src/main.ts"),
            name: "TextAsImage",
            fileName: "index",
            formats: ["es"],
        },
        sourcemap: true,
    },
    resolve: { alias: { "@": resolve(__dirname, "./src") } },
});
