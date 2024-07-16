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

## To run LLAMA3

Simply run `yarn run llama3`

The following commands are not required, just FYI. 

The OLLAMA server generally runs off the port 11434. Verify this using the sudo command:

```bash
sudo lsof -i -P | grep -i "listen"
```

Also, check for CORS settings for making the call:
```bash
launchctl setenv OLLAMA_ORIGINS "*"
```

