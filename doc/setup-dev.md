# HTTPS Proxy

See: https://www.storyblok.com/faq/setup-dev-server-https-windows

Oder:

```bash
npx local-ssl-proxy --source 3010 --target 3000
```

# Storyblok

API Token: cDI6mUwrC5dKWFsPWD6s8Att

Space ID: 330326


# storyblok types

```bash
npm i -g storyblok
storyblok login
storyblok pull-components --space 330326
storyblok generate-typescript-typedefs --sourceFilePaths ./components.330326.json --destinationFilePath ./src/types/component-types-sb.d.ts
```


https://www.storyblok.com/faq/how-can-i-utilize-typescript-in-my-storyblok-project

To get started, follow these steps:

* Install the Storyblok CLI: npm i -g storyblok.
* Login using storyblok login in your terminal and follow the steps.
* In your project directory, download the schema of your Storyblok components in a .json file by running storyblok pull-components --space SPACE_ID. It is recommended to add this command to the scripts section of your package.json, e.g. under the identifier pull-sb-components.
* In your project directory, generate TypeScript types based on the downloaded schema by running storyblok generate-typescript-typedefs --sourceFilePaths ./components.SPACE_ID.json --destinationFilePath ./component-types-sb.d.ts. It is recommended to add this command to the scripts section of your package.json, e.g. under the identifier generate-sb-types.
* Import the type in each component, for example: import type { PageStoryblok } from '../component-types-sb'.
* Remember to rerun the pull-sb-components and generate-sb-types scripts after you've made changes to your component schema in your Storyblok space.
