import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configurações de Build para Rollup
  build: {
    rollupOptions: {
      output: {
        // Estratégia de chunking manual
        manualChunks(id) {
          // Se o módulo for de dentro de node_modules (bibliotecas de terceiros)
          if (id.includes('node_modules')) {
            // Cria um chunk chamado 'vendor'
            return 'vendor'
          }
        },
      },
    },
  },
})
