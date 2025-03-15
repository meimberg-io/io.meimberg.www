# Initial Setup

```bash
npm i -g storyblok
```

# HTTPS Proxy

```bash
npx local-ssl-proxy --source 3010 --target 3000
```
# Links

* https://tailwindcss.com/plus/templates/spotlight
* https://spotlight.tailwindui.com/about
*



# Storyblok

## Creds and IDs

* API Token: cDI6mUwrC5dKWFsPWD6s8Att
* Space ID: 330326

## fetch storyblok types

```bash
storyblok login # login once initially, not for everey pull

storyblok pull-components --space 330326 && storyblok generate-typescript-typedefs --sourceFilePaths ./components.330326.json --destinationFilePath ./src/types/component-types-sb.d.ts
```
From: https://www.storyblok.com/faq/how-can-i-utilize-typescript-in-my-storyblok-project
