import { defineConfig } from '#q-app/wrappers';

export default defineConfig(() => {
  return {
    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    preFetch: true,

    boot: ['axios', 'bus', 'globals'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
    css: ['app.css', 'styles.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: ['fontawesome-v6', 'roboto-font', 'material-icons'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },

      typescript: {
        strict: true,
        vueShim: true,
      },

      vueRouterMode: 'history',

      rebuildCache: true,

      env: {
        PRODUCTION_API_URL: 'https://api.ienasoccer.it/api/v2/public',
        PRODUCTION_MEDIA_URL: 'https://media.ienasoccer.it/attachments',
        PRODUCTION_ATTACHMENTS_URL: 'https://media.ienasoccer.it/attachments',
        PRODUCTION_PROFILE_URL: 'https://media.ienasoccer.it/profiles',
        DEVELOPMENT_API_URL: 'http://localhost:8000/api/v2/public',
        DEVELOPMENT_MEDIA_URL: 'http://localhost/IenaSoccer/Media',
        DEVELOPMENT_ATTACHMENTS_URL: 'http://localhost/IenaSoccer/Media',
        DEVELOPMENT_PROFILE_URL: 'http://localhost/IenaSoccer/Media',
      },

      minify: true,
      polyfillModulePreload: true,

      vitePlugins: [
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true,
            },
          },
          { server: false },
        ],
      ],
    },

    devServer: {
      open: true,
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
    framework: {
      config: {},

      iconSet: 'fontawesome-v6',
      lang: 'en-US',

      plugins: [
        'Meta',
      ],
    },

    // https://v2.quasar.dev/options/animations
    animations: 'all',

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      prodPort: 3000,

      middlewares: ['render'],

      pwa: false,
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW',
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {},

    // https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      preloadScripts: ['electron-preload'],

      inspectPort: 5858,

      bundler: 'packager',
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'homefrontend',
      },
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      extraScripts: [],
    },
  };
});
