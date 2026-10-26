# Su Beauty Touch — Web (Next.js)

Next.js 16 (App Router, TypeScript) + Tailwind CSS 4 + Firebase (Firestore, Storage, Auth).
Publicado no **Firebase App Hosting**. As regras de segurança (`firestore.rules`, `storage.rules`)
ficam na raiz do repositório e são as mesmas da versão anterior.

## Comandos

```bash
npm install        # 1.ª vez
npm run dev        # http://localhost:3000
npm run build      # build de produção (o App Hosting faz isto sozinho)
npm run typecheck
```

## Estrutura

```
web/
├── apphosting.yaml          # config do App Hosting (instâncias, memória)
├── next.config.ts           # redirects das URLs antigas, imagens remotas, noindex do admin
├── public/img/              # imagens locais (fallback quando não há imagem no admin)
└── src/
    ├── app/
    │   ├── layout.tsx       # <html>, fontes, metadata global, script de tema
    │   ├── globals.css      # Tailwind + tokens da marca + tema escuro
    │   ├── fonts.ts         # Poppins + Playfair alojadas localmente (@fontsource)
    │   ├── (site)/          # site público (header/footer partilhados)
    │   │   └── page.tsx  servicos/  portfolio/  marcacao/  regras/  pagamento/  contacto/
    │   ├── admin/
    │   │   ├── login/       # login (Firebase Auth)
    │   │   └── (painel)/    # protegido por <AdminGuard>: dashboard, agendamentos, imagens, portfolio
    │   └── not-found.tsx  sitemap.ts  robots.ts
    ├── components/
    │   ├── site/            # Header, Footer, ServiceCard, Gallery (lightbox), ContactLink...
    │   ├── booking/         # BookingForm (marcação)
    │   ├── admin/           # AdminGuard, AdminNav, LoginForm, *Manager
    │   └── ui/              # Message
    └── lib/
        ├── config.ts        # ★ FONTE ÚNICA: serviços, preços, durações, horário, contactos, pagamento
        ├── firebase/client.ts
        ├── ocupacao.ts      # horários ocupados (anti-duplicados)
        ├── data.ts          # leituras públicas no servidor (imagens, portfólio) — cache 60 s
        └── admin.ts  types.ts
```

## Como os dados fluem

- **Home, Serviços, Portfólio**: renderizados no servidor e guardados em cache 60 s (ISR).
  O que se muda no admin aparece no site em até 1 minuto. Se o Firestore falhar, usam-se as imagens locais.
- **Marcação**: no browser; lê `ocupacao` (pública, sem dados pessoais) e grava marcação + blocos num batch.
- **Admin**: tudo no browser, protegido por Firebase Auth + `/admins/{uid}` + Security Rules.

## Publicar (Firebase App Hosting)

1. O projeto tem de estar num repositório GitHub (pode ser privado).
2. Consola Firebase → **App Hosting** → **Create backend**.
3. Ligar o GitHub e escolher o repositório.
4. **Root directory**: `web` · **Live branch**: `main` · Região: `europe-west4` (ou a mais próxima disponível).
5. Criar. A partir daí, cada `git push` para `main` publica automaticamente.
6. As regras continuam a publicar-se a partir da raiz: `npm run deploy:rules`.
