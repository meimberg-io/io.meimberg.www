#!/usr/bin/env bash

npx storyblok components pull -s 330326
npx storyblok types -s 330326 generate
cp .storyblok/types/330326/storyblok-components.d.ts src/types/component-types-sb.d.ts
