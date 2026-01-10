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

**IMPORTANTE:** Siga estes passos EXATAMENTE nesta ordem para evitar o erro de `rootDirectory`.

1. **Conecte o repositório (SEM configurar Root Directory ainda):**
   - Acesse: https://vercel.com
   - Clique em **Add New Project**
   - Conecte seu repositório GitHub: `rogermyr/licita-frontend`
   - Clique em **Import**
   - **NÃO configure Root Directory nesta tela inicial**
   - Deixe o Framework Preset como está (ou selecione Vite se aparecer)
   - Clique em **Deploy** (mesmo que vá falhar, precisamos criar o projeto primeiro)

2. **Após o projeto ser criado, configure o Root Directory:**
   - Vá para o projeto recém-criado no Vercel
   - Clique em **Settings** → **General**
   - Role até a seção **Root Directory**
   - Clique em **Edit**
   - Digite: `meu-frontend` (sem barra final)
   - Clique em **Save**
   - O Vercel pedirá para fazer um novo deploy - clique em **Redeploy**

3. **Configure as variáveis de ambiente:**
   - Ainda em **Settings**, vá em **Environment Variables**
   - Clique em **Add New**
   - Adicione:
     - **Key:** `VITE_API_BASE_URL`
     - **Value:** `https://seu-backend.com/api/v1`
     - **Environment:** Marque Production, Preview e Development
   - Clique em **Save**
   - Faça um novo deploy para aplicar as variáveis

4. **Verifique as configurações de Build:**
   - Em **Settings** → **General** → **Build & Development Settings**
   - Deve estar configurado como:
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
   - Se não estiver, ajuste manualmente

**Alternativa 1 - Usar CLI do Vercel (recomendado se der erro na interface):**

Se continuar dando erro na interface web, use a CLI do Vercel:

```bash
# Instale a CLI do Vercel globalmente
npm i -g vercel

# Na raiz do repositório, execute:
vercel

# Siga as perguntas:
# - Set up and deploy? Yes
# - Which scope? (selecione sua conta)
# - Link to existing project? No (ou Yes se já existe)
# - What's your project's name? licita-frontend
# - In which directory is your code located? ./meu-frontend
# - Want to override settings? No (deixe o Vercel detectar automaticamente)
```

Depois, configure as variáveis de ambiente:
```bash
vercel env add VITE_API_BASE_URL production
# Digite a URL do backend quando solicitado
```

**Alternativa 2 - Se nada funcionar:**

Se todas as tentativas falharem, a solução mais garantida é mover o conteúdo de `meu-frontend/` para a raiz do repositório. Mas isso requer reorganizar a estrutura do projeto.

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
