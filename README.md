# Extension Boilerplate 1

## HMR issues

In case HMR does not work, add the following to `vite.config.js`

```js
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
```
