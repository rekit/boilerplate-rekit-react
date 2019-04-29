import {
  WelcomePage,
} from './';

export default {
  path: '/',
  name: 'Home',
  childRoutes: [
    { path: 'welcome-page',
      name: 'Default page',
      component: WelcomePage,
      isIndex: true,
    },
  ],
};
