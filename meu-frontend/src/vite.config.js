import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // NOVO: Configurações de Build para Rollup
  build: {
    // Aumentar ligeiramente o limite de aviso, se necessário (opcional)
    // chunkSizeWarningLimit: 600, 
    
    rollupOptions: {
      output: {
        // Estratégia de chunking manual
        manualChunks(id) {
          // Se o módulo for de dentro de node_modules (bibliotecas de terceiros)
          if (id.includes('node_modules')) {
            // Cria um chunk chamado 'vendor'
            return 'vendor';
          }
          
          // Opcional: Criar chunks menores para bibliotecas específicas e muito grandes
          // if (id.includes('node_modules/chart.js')) {
          //   return 'vendor-charts';
          // }
          
        },
      },
    },
  },
});