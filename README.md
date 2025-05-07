# React - TypeScript - Vite

## Step by step to run this project locally:

-   Download `Git` by clicking here: [Git](https://git-scm.com/download/win) and follow the steps for installation.
-   Install `Node` following the steps by clicking here: [NodeJS documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
-   Install `Yarn package manager` following the steps by clicking here: [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable).
-   Go inside the project folder and install the project dependencies running `yarn` command.
-   After all dependencies has been installed run the command `yarn dev` to run the project locally.

## Expanding the ESLint configuration

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

-   Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

-   Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
-   Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
-   Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
