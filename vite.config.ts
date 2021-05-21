import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import typescript from 'rollup-plugin-typescript2';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    typescript({ check: false, tsconfig: path.resolve(__dirname, "tsconfig.build.json") }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/lib/index.ts"),
      name: "VueResizingPager",
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        }
      }
    }
  }
})
