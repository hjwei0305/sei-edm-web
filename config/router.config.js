export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: '/preview',
        name: 'preview',
        routes: [
          { path: '/preview', component: './Preview' },
          { path: '/preview/ofd/:id', component: './Ofd' },
        ],
      },
      {
        path: '/ocr',
        name: 'OCR配置',
        routes: [
          { path: '/ocr/service', component: './Ocr/Service' },
          { path: '/ocr/template', component: './Ocr/TemplateAndElement' },
        ],
      },
      {
        path: '/bizConfig',
        name: '业务配置',
        routes: [{ path: '/bizConfig/domain', component: './BizConfig/Domain' }],
      },
    ],
  },
];
