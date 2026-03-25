import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/HomeLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'index/:section([a-z]{3,32})', component: () => import('pages/IndexPage.vue') },
      { path: 'about', component: () => import('pages/AboutPage.vue') },
      { path: 'contacts', component: () => import('pages/ContactPage.vue') },
      {
        path: 'gallery', component: () => import('pages/GalleryPage.vue'), children: [
          {
            path: ':uuid([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})',
            component: () => import('pages/GalleryPage.vue'),
          },
        ]
      },
      { path: 'creator', component: () => import('pages/CreatorPage.vue') },
      {
        path: 'post/:uuid([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})/:slug([a-zA-Z0-9_-]+)',
        component: () => import('pages/PostPage.vue')
      },
      {
        path: 'post/preview/:uuid([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})',
        component: () => import('pages/PostPage.vue')
      },
      {
        path: 'private/:fid([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})/:hash([a-fA-F0-9]{32})',
        component: () => import('pages/PrivatePage.vue')
      },

    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
