/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

const plugins = [react(), tsconfigPaths()];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './');

  plugins.push(
    createHtmlPlugin({
      inject: {
        data: {
          title: env.VITE_APP_TITLE,
          faviconPath: env.VITE_FAVICON_PATH,
        },
      },
    }),
  );

  return {
    server: { port: 3000 },
    plugins,
    test: {
      globals: true,
      coverage: {
        all: true,
      },
      environment: 'jsdom',
      include: ['**/*.unit.test.ts', '**/*.unit.test.tsx'],
    },
  };
});
