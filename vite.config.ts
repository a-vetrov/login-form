import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
/*  resolve: {
    // MUI + SSR issue https://github.com/vikejs/vike/discussions/901#discussioncomment-6167919
    alias: {
      '@mui/material': '@mui/material/node',
      '@mui/styled-engine': '@mui/styled-engine/node',
      '@mui/system': '@mui/system/esm',
      '@mui/base': '@mui/base/node',
      '@mui/utils': '@mui/utils/node',
      '@mui/lab': '@mui/lab/node',
    }
  },

 */
  ssr: {noExternal: ["@mui/material", "@mui/utils", "@mui/base", "@mui/icons-material"]},
  plugins: [react()]
})
