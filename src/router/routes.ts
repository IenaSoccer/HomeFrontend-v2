import type { RouteRecordRaw } from 'vue-router';

function getPageMeta(title: string, description: string) {
  return {
    title,
    description,
  };
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/HomeLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: getPageMeta(
          'Homepage',
          'Scopri notizie, media e aggiornamenti della Iena Soccer a Roccarainola.',
        ),
      },
      {
        path: 'index/:section([a-z]{3,32})',
        component: () => import('pages/IndexPage.vue'),
        meta: getPageMeta(
          'Homepage',
          'Esplora le sezioni della homepage della Iena Soccer tra team, notizie e video.',
        ),
      },
      {
        path: 'about',
        component: () => import('pages/AboutPage.vue'),
        meta: getPageMeta(
          'Chi Siamo',
          'Scopri la storia, il percorso e l identità della Iena Soccer.',
        ),
      },
      {
        path: 'contacts',
        component: () => import('pages/ContactPage.vue'),
        meta: getPageMeta(
          'Contatti',
          'Contatta la Iena Soccer per informazioni, collaborazioni e richieste.',
        ),
      },
      {
        path: 'gallery',
        component: () => import('pages/GalleryPage.vue'),
        meta: getPageMeta(
          'Galleria',
          'Guarda le foto e gli album della Iena Soccer tra partite, eventi e momenti della squadra.',
        ),
        children: [
          {
            path: ':uuid([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})',
            component: () => import('pages/GalleryPage.vue'),
            meta: getPageMeta(
              'Dettaglio Galleria',
              'Sfoglia un album fotografico della Iena Soccer con immagini di partite ed eventi.',
            ),
          },
        ],
      },
      {
        path: 'creator',
        component: () => import('pages/CreatorPage.vue'),
        meta: getPageMeta(
          'Creator',
          'Accedi all\'area creator della Iena Soccer.',
        ),
      },
      {
        path: 'post/:uuid([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})/:slug([a-zA-Z0-9_-]+)',
        component: () => import('pages/PostPage.vue'),
        meta: getPageMeta(
          'Articolo',
          'Leggi un articolo, aggiornamento o notizia pubblicata dalla Iena Soccer.',
        ),
      },
      {
        path: 'post/preview/:uuid([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})',
        component: () => import('pages/PostPage.vue'),
        meta: getPageMeta(
          'Anteprima Articolo',
          'Visualizza l\'anteprima di un contenuto della Iena Soccer.',
        ),
      },
      {
        path: 'private/:fid([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})/:hash([a-fA-F0-9]{32})',
        component: () => import('pages/PrivatePage.vue'),
        meta: getPageMeta(
          'Area Privata',
          'Accedi a contenuti riservati della Iena Soccer tramite link protetto.',
        ),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: getPageMeta(
      'Pagina non trovata',
      'La pagina richiesta non esiste o non è più disponibile sul sito della Iena Soccer.',
    ),
  },
];

export default routes;
