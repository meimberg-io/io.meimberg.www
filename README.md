## Boilerplate Storyblok, Next15 and tailwindcss

## Install dependencies

```shell
pnpm i
```

## Starting the server

Starting the HTTP**S** server to use the localhost as a preview URL.

```
pnpm dev --experimental-https
```

## Environment

In `.env.local` (or copy from `env.example` to `.env`):

```env
NEXT_PUBLIC_STORYBLOK_TOKEN=your_token_here
```

Optional (newsletter signup on homepage): `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`, `BREVO_DOI_REDIRECT_URL` – Brevo API key, target list, double-opt-in template and the page shown after confirmation. Server-side only (used in `/api/newsletter`).
