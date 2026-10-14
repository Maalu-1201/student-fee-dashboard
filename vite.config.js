import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// VITE_BASE is set by the GitHub Pages workflow (e.g. "/student-fee-dashboard/").
// Locally it falls back to "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/",
});
