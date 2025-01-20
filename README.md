# Helium IDE

The first-class IDE for developing Shopify Themes (proof of concept).

![Picture of Helim with preview running](./assets/Helium%20Editor.png)

## Description

Normarly, if Shopify Theme Developer wanted to develop a Shopify Theme, you either have 2 options: use the [Shopify Theme Code Editor](https://shopify.dev/docs/storefronts/themes/tools/code-editor) in the the Shopify admin, or use your local setup. While both solutions are quite good options in their own right, they can be better. The Theme Code Editor currently dosen't allow developers to preview the theme as they make thier edits, and local setup has a genral lack of support (for example, poor Liquid syntax highliting support). The aim of Helium is to be the ideal theme development experience for Theme Developers. This includes features like custom highliting for Liquid using [shikijs](https://shiki.style/), and a Live Theme Preview powered by the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli).

## Getting Started

### Dependencies

* Mac OS (no Windows support yet)
* Node.js
* Git
* Shopify CLI (see below)


### Installing

* Clone the repo onto your machine
* Install the Shopify CLI: `npm install -g @shopify/cli @shopify/theme`
* Run `npm install`

### Executing program

* Run `npm run start` and wait for everyting to compile


### Tech Design

Check out the tech design [here](./assets/Helium%20Tech%20Design.pdf).

