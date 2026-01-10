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

### Configuração do Root Directory no Vercel

Como o projeto está em um subdiretório (`meu-frontend/`), você precisa configurar o Root Directory no painel do Vercel:

1. Acesse o painel do Vercel: https://vercel.com
2. Selecione seu projeto
3. Vá em **Settings** → **General**
4. Na seção **Root Directory**, clique em **Edit**
5. Defina o Root Directory como: `meu-frontend`
6. Clique em **Save**

O arquivo `vercel.json` já está configurado com:
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
