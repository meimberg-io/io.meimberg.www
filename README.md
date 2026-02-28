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

Optional (newsletter signup on homepage): `BUTTONDOWN_API_KEY` – API key from [Buttondown Settings → API](https://buttondown.com/settings/api). Server-side only (used in `/api/newsletter`).
