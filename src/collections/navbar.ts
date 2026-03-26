import type { Links } from 'src/contracts/Navbar';

const links: Links = {
  header: [
    {
      title: 'Homepage',
      caption: 'Pagina principale',
      icon: 'home',
      link: '/',
      divider: true,
      slug: 'home',
      classes: 'text-dark',
      title_classes: 'text-dark',
      nav_hidden: true,
    },
    {
      title: 'Chi siamo',
      caption: 'La nostra storia',
      icon: 'history',
      slug: 'history',
      link: '/about',
    },
    {
      title: 'Squadra',
      caption: 'I nostri ragazzi',
      icon: 'diversity_3',
      slug: 'team',
      link: '/index/Team',
      embedded: true,
    },
    {
      title: 'News',
      caption: 'Novità',
      slug: 'news',
      icon: 'newspaper',
      link: '/index/News',
      embedded: true,
    },
    {
      title: 'Galleria',
      caption: 'Momenti speciali',
      icon: 'camera',
      slug: 'gallery',
      link: '/gallery',
      divider: true,
    },
    {
      title: 'Contattaci',
      caption: 'Vieni con noi',
      slug: 'contacts',
      icon: 'call',
      link: '/contacts',
    },
  ],
  footer: {
    Contenuti: [
      {
        title: 'Chi siamo',
        caption: 'La nostra storia',
        link: '/about',
      },
      {
        title: 'La nostra squadra',
        caption: 'I nostri ragazzi',
        link: '/index/Team',
      },
      {
        title: 'News',
        caption: 'Ultime notizie',
        link: '/index/News',
      },
      {
        title: 'Galleria',
        caption: 'Momenti speciali',
        link: '/gallery',
      },
      {
        title: 'Contattaci',
        caption: 'Vieni con noi',
        link: '/contacts',
      },
    ],
    Personale: [
      {
        title: 'Pannello',
        caption: 'Registra un utente [ADMIN]',
        link: '/creator',
      },
    ],
  },
};

export default links;
