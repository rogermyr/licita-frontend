# Plataforma Licitou - Frontend

Frontend da Plataforma Licitou construído com React + Vite.

## Configuração do Ambiente

### Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configurar a URL da API backend.

1. **Crie um arquivo `.env`** na raiz do projeto `meu-frontend/` baseado no `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

2. **Para desenvolvimento local:**
   - Use: `http://localhost:8000/api/v1` (ou a porta que seu backend usa)

3. **Para produção (Vercel):**
   - Configure a variável de ambiente no painel do Vercel (veja seção Deploy)

## Deploy no Vercel

### Configuração de Variáveis de Ambiente no Vercel

1. Acesse o painel do Vercel: https://vercel.com
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione a variável:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://seu-backend.com/api/v1` (URL do seu backend em produção)
   - **Environment:** Selecione Production, Preview e Development conforme necessário
5. Clique em **Save**

### Estrutura do Projeto no Vercel

O arquivo `vercel.json` na raiz do repositório já está configurado para:
- **Root Directory:** `meu-frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Vite (detecção automática)

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173`
