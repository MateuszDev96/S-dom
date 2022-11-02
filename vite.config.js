import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  resolve: {
    alias: {
      'S': path.resolve(__dirname, "./src/S"),
      'S-dom': path.resolve(__dirname, "./src/S-dom"),
      'testing': path.resolve(__dirname, "./src/testing"),
    },
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'h',
    jsxInject: `import { h } from 'S-dom'`
  }
})
