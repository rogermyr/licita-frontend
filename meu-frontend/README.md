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

### Configuração do Projeto no Vercel

**IMPORTANTE:** O arquivo `vercel.json` foi removido. O Vercel detecta automaticamente projetos Vite/React.

#### Passo a passo para importar no Vercel:

1. **Conecte o repositório:**
   - Acesse: https://vercel.com
   - Clique em **Add New Project**
   - Conecte seu repositório GitHub: `rogermyr/licita-frontend`
   - Clique em **Import**

2. **Configure o Root Directory (CRÍTICO):**
   - Na tela de configuração do projeto, role até **Root Directory**
   - Clique em **Edit**
   - Digite: `meu-frontend`
   - Ou selecione: `meu-frontend/` na lista
   - Clique em **Continue**

3. **Configure as variáveis de ambiente:**
   - Na mesma tela, vá em **Environment Variables**
   - Adicione:
     - **Name:** `VITE_API_BASE_URL`
     - **Value:** `https://seu-backend.com/api/v1`
     - **Environment:** Marque Production, Preview e Development
   - Clique em **Continue**

4. **Deploy:**
   - O Vercel detectará automaticamente:
     - **Framework Preset:** Vite (automático)
     - **Build Command:** `npm run build` (automático)
     - **Output Directory:** `dist` (automático)
   - Clique em **Deploy**

**Nota:** Se você já importou o projeto antes e está tendo erro, delete o projeto no Vercel e importe novamente para evitar cache.

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
