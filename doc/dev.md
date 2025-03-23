# Initial Setup

```bash
npm i -g pagetypes
```

# HTTPS Proxy

```bash
npx local-ssl-proxy --source 3010 --target 3000
```
# Links

* Tailwind https://tailwindcss.com/plus/templates/spotlight
* Sputlight: https://spotlight.tailwindui.com/about
* Basic Tutorial Storyblok / React / Next: https://github.com/storyblok/storyblok-react
* Material Tailwind: https://www.material-tailwind.com/docs/v3/react/gallery


# Storyblok

## Creds and IDs

* API Token: cDI6mUwrC5dKWFsPWD6s8Att
* Space ID: 330326

## fetch storyblok types

```bash
pagetypes login # login once initially, not for everey pull

pagetypes pull-components --space 330326 && pagetypes generate-typescript-typedefs --sourceFilePaths ./components.330326.json --destinationFilePath ./src/types/component-types-sb.d.ts
```
From: https://www.storyblok.com/faq/how-can-i-utilize-typescript-in-my-storyblok-project
