import path from 'path';

import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig, loadEnv } from 'vite';
import { configDefaults } from 'vitest/config';

import type { ConfigEnv } from 'vite';

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
  const currentEnvironment = loadEnv(mode, process.cwd());
  console.log('Current mode:', command);
  console.log('Current environment configuration:', currentEnvironment);
  return defineConfig({
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react({
        // Add React refresh runtime
        jsxRuntime: 'automatic',
      }),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base: currentEnvironment.VITE_PUBLIC_PATH || '/',
    mode: mode,
    server: {
      proxy: {
        '/api': {
          target: 'http://xxxxxx.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          ...configDefaults.coverage.exclude!,
          'src/test/**',
          '**/*.test.{ts,tsx}',
          '**/*.d.ts',
        ],
      },
      css: true,
      include: ['src/**/*.test.{ts,tsx}'],
      exclude: [...configDefaults.exclude, 'e2e/*'],
      dangerouslyIgnoreUnhandledErrors: true,
    },
    assetsInclude: ['**/*.epub'],
  });
};
