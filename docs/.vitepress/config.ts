import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'simple vue3',
  description: 'implement simple feature of vue3 to study source code of vue3',
  base: '/simple-vue3/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: 'https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/81249231_padded_logo.png'
      }
    ],
  ],
  themeConfig: {
    // Type is `DefaultTheme.Config`
    logo: 'https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/81249231_padded_logo.png',
    nav: [
      {
        text: 'GitHub',
        link: 'https://github.com/wangkaiwd/simple-vue3',
      },
    ],
    sidebar: [
      {
        text: 'Getting Start',
        link: '/'
      }
    ]
  },
});
