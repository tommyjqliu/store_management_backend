export default {
  npmClient: "pnpm",
  apiRoute: {
    platform: 'vercel'
  },
  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss"],
  // chainWebpack(memo, { env, webpack }) {
  //   memo.mode('development')
  // },
  routes: [
    {
      exact: true, path: '/', component: 'index',
      wrappers: [
        '@/wrappers/auth',
      ],
    },
    {
      exact: true, path: '/product', component: 'product',
      wrappers: [
        '@/wrappers/auth',
      ],
    },
    {
      exact: true, path: '/order', component: 'order',
      wrappers: [
        '@/wrappers/auth',
      ],
    },
    { exact: true, path: '/login', component: 'login' },
  ]
};
