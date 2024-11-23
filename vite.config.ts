import { fileURLToPath, URL } from 'node:url';
import { loadEnv } from 'vite';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    },
    base: mode === 'production' ? '' : '/jumping-journey' // For GitHub Pages
  };
});
