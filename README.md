# 💍 Casamento Jony & Tainara — Álbum Digital

Álbum colaborativo onde os convidados enviam fotos e vídeos do casamento em tempo real. Tudo é salvo automaticamente em uma pasta do Google Drive.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Tailwind](https://img.shields.io/badge/Tailwind-4-blue) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## ✨ Funcionalidades

- 📸 **Upload sem login** — convidados enviam fotos/vídeos sem precisar de conta Google
- ☁️ **Google Drive** — arquivos salvos diretamente em pasta compartilhada
- 📁 **Organização automática** — cada convidado tem sua subpasta (nome + data)
- 🎨 **Design elegante** — mobile-first, cores do casamento (lavanda + dourado)
- 📱 **QR Code** — página pronta para imprimir e compartilhar
- 💬 **Mensagens** — convidados podem deixar recadinhos para os noivos
- ⏰ **1 ano de retenção** — prazo garantido no Google Drive

## 🏗️ Stack

| Tecnologia | Uso |
|------------|-----|
| Next.js 16 (App Router) | Framework React SSR/SSG |
| Tailwind CSS 4 | Estilização |
| Google Drive API | Armazenamento de arquivos |
| Google OAuth 2.0 | Autenticação (token refresh automático) |
| Vercel | Deploy + hosting |

## 📂 Estrutura

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz (fontes, metadata)
│   ├── page.tsx            # Página inicial (hero + como funciona)
│   ├── globals.css         # Estilos globais + tema
│   ├── enviar/
│   │   └── page.tsx        # Página de upload (drag&drop, preview, progresso)
│   ├── qrcode/
│   │   └── page.tsx        # QR Code para impressão/compartilhamento
│   └── api/
│       └── upload/
│           └── route.ts    # API route → Google Drive upload
├── public/
│   └── logo.png            # Logo do casamento
└── assets/
    └── logo/               # Arquivos .ai + PNG hires (originais)
```

## 🚀 Deploy na Vercel

### 1. Variáveis de Ambiente

Configure estas 3 variáveis na Vercel (Settings → Environment Variables):

#### `GOOGLE_DRIVE_FOLDER_ID`
```
1vV05GlbzYVhn1RTXQE_vbPXPB4p4IywB
```

#### `GOOGLE_TOKEN_JSON`
O token OAuth completo em formato JSON. Obtenha rodando:
```bash
cat google_token.json | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin)))"
```
Cole o valor como string única (uma linha).

#### `GOOGLE_CLIENT_SECRET_JSON`
As credenciais OAuth do Google Cloud. Obtenha rodando:
```bash
cat google_client_secret.json | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin)))"
```

### 2. Deploy

```bash
# Instalar Vercel CLI (se necessário)
npm i -g vercel

# Deploy
vercel --prod
```

Ou conecte o repositório GitHub no dashboard da Vercel.

### 3. Configurar domínio (opcional)

Na Vercel: Settings → Domains → adicionar domínio personalizado.

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Arquivos necessários na raiz do projeto:
# - google_token.json (OAuth token)
# - google_client_secret.json (OAuth credentials)
# - .env.local (ver .env.example)

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build && npm start
```

## 🔐 Google Cloud Setup (referência)

O projeto usa OAuth 2.0 com refresh automático de token.

1. **Projeto Google Cloud**: `grand-lamp-496901-p1` / `998399080339`
2. **APIs habilitadas**: Google Drive API
3. **OAuth Client**: Desktop App
4. **Service Account**: `casamento-upload@grand-lamp-496901-p1.iam.gserviceaccount.com`
5. **Pasta do Drive**: https://drive.google.com/drive/folders/1vV05GlbzYVhn1RTXQE_vbPXPB4p4IywB

> **Nota**: A Service Account não tem cota de storage própria no Google. O upload é feito via OAuth delegation usando o token do proprietário da pasta.

## 📱 Uso

### Para convidados:
1. Acessem o link ou escaneiem o QR Code
2. Vejam a página de boas-vindas
3. Toquem em "Enviar fotos e vídeos"
4. Selecione arquivos (múltiplos)
5. Adicionem nome e mensagem (opcional)
6. Pronto! Arquivos salvos no Drive 🎉

### Para os noivos:
1. Acessem a pasta do Google Drive
2. Subpastas organizadas por convidado e data
3. Baixem tudo quando quiserem
4. Retenção garantida por 1 ano

## 🎨 Design

| Cor | Hex | Uso |
|-----|-----|-----|
| Lavanda claro | `#F5F0FF` | Fundo suave |
| Blush rosa | `#FFF0F5` | Hero section |
 Roxo principal | `#7C3AED` | Botões, badges, CTAs |
| Dourado | `#D4A574` | Detalhes, separadores |
| Texto escuro | `#1F2937` | Títulos |
| Texto claro | `#6B7280` | Descrições |

**Fontes**: Cormorant Garamond (display) + Inter (corpo)

## 📄 Licença

Projeto pessoal — Casamento Jony & Tainara 💜

---

Feito com 💜 por [Gabriel Pantojinho](https://github.com/pantojinho)
