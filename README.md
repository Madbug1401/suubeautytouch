# Su Beauty Touch

> **Em migração para Next.js** — a nova versão está em [`web/`](web/README.md) (Next.js + Tailwind, Firebase App Hosting).
> A versão estática em `public/` continua a ser a que está publicada até o App Hosting ficar ativo.

Site e painel de gestão de um negócio de maquilhagem profissional (Cabo Verde).
HTML/CSS/JS vanilla (ES modules, sem build) + Firebase (Firestore, Storage, Hosting).

## Estrutura

```
.
├── firebase.json          # Hosting (public/, URLs limpas, redirects), regras Firestore/Storage
├── firestore.rules        # ★ segurança da base de dados
├── storage.rules          # ★ segurança dos ficheiros (tipo e tamanho)
├── .firebaserc            # projeto Firebase por defeito (su-beauty-touch)
├── cors.json              # CORS do bucket do Storage (gsutil cors set cors.json gs://...)
├── package.json           # scripts: npm run dev / npm run deploy
├── _legacy/               # versão antiga (backup) — apagar depois de validar a nova
└── public/                # ← tudo o que é publicado
    ├── index.html  servicos.html  portfolio.html  marcacao.html
    ├── regras.html  pagamento.html  contacto.html  404.html  robots.txt
    ├── admin/             # painel admin (Firebase Auth, noindex)
    │   ├── login.html  index.html  agendamentos.html  imagens.html  portfolio.html
    └── assets/
        ├── css/
        │   ├── main.css   # tokens, layout, componentes, tema escuro (site + base do admin)
        │   └── admin.css  # só painel admin
        ├── img/  video/
        └── js/
            ├── config.js        # ★ FONTE ÚNICA: contactos, serviços, preços, durações, horário, categorias
            ├── firebase.js      # ★ único sítio que importa o SDK Firebase (versão numa só linha)
            ├── theme.js         # tema claro/escuro (script clássico no <head>, sem flash)
            ├── layout.js        # header, footer e botão WhatsApp das páginas públicas
            ├── lib/
            │   ├── dom.js         # esc() anti-XSS, setMsg(), fillSelect()
            │   ├── ocupacao.js    # horários ocupados (blocos de 30 min, sem dados pessoais)
            │   └── site-images.js # imagens dinâmicas <img data-categoria="...">
            ├── pages/           # um entry point por página pública
            │   ├── home.js  servicos.js  portfolio.js  marcacao.js
            └── admin/
                ├── auth.js      # requireAdmin(), logout() — Firebase Auth + /admins/{uid}
                ├── login.js  layout.js
                ├── agendamentos.js  imagens.js  portfolio.js
```

## Convenções

- Cada página tem `<body data-page="...">`; `layout.js` / `admin/layout.js` marcam o menu ativo.
- Header e footer **não** se escrevem no HTML: são injetados por `layout.js`.
- Links de contacto: `<a data-link="whatsapp" data-text="mensagem opcional">` ou `data-link="instagram"`.
  O URL vem de `config.js`; se o contacto não estiver preenchido, o link fica escondido.
- Ids de categorias/álbuns em kebab-case: `soft-glam`, `glow-glam`, `full-glam`, `cilios-natural`, `cilios-volumoso`.
- Dados do Firestore nunca entram no DOM via `innerHTML` sem `esc()`.
- Caminhos relativos (`assets/...`, `../assets/...`) para funcionar no Live Server e no Firebase.
- Pré-selecionar serviço na marcação: `marcacao.html?servico=soft-glam`.

## Firestore

| Coleção        | Campos principais |
|----------------|-------------------|
| `agendamentos` | nome, telefone, servico (nome), cilios (nome), data (YYYY-MM-DD), hora (HH:MM), observacoes, status (pendente/confirmado), createdAt — **só admin lê** |
| `ocupacao`     | id = `AAAA-MM-DD_HH:MM` (um por bloco de 30 min); data, hora, agendamentoId — leitura pública |
| `admins`       | id = UID do Firebase Auth; quem tem documento aqui é admin (criar na consola) |
| `imagens`      | id = categoria; categoria, url, storagePath, ativo, updatedAt |
| `portfolio`    | album (id categoria), tipo (imagem/video), url, storagePath, ativo, createdAt |

## Segurança (resumo)

- Público: pode **criar** marcações (campos validados nas rules) e ler `ocupacao`, `imagens`, `portfolio`.
- A marcação e os seus blocos em `ocupacao` são gravados num batch; como o público não pode
  sobrescrever um bloco existente, duas marcações no mesmo horário são impossíveis.
- Admin: tudo, desde que autenticado e com documento em `/admins/{uid}`.
- Storage: só admin escreve; imagens ≤ 10 MB, vídeos ≤ 100 MB.

## Configurar o admin (uma vez)

1. Consola Firebase → Authentication → ativar **Email/Password**.
2. Authentication → Users → **Add user** (email e palavra-passe da dona). Copiar o **UID**.
3. Firestore → criar coleção `admins` → documento com ID = UID (campo ex.: `nome: "Susana"`).
4. (Recomendado) Authentication → Settings → User actions → desligar **Enable create (sign-up)**.
5. `npm run deploy` (aceitar o pedido de permissão das cross-service rules do Storage).
6. Entrar em `/admin/login` → Agendamentos → **↻ Sincronizar horários** (cria `ocupacao` para as marcações já existentes).

## Correr localmente

- **Live Server (VS Code):** já configurado para servir `public/` (`.vscode/settings.json`).
- **Firebase emulator:** `npm run dev` (respeita URLs limpas e redirects).

## Publicar

`npm run deploy`
