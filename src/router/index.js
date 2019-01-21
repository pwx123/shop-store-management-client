import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login.vue';
import NotFound from '@/views/404.vue';
import Home from '@/views/home/Home.vue';
import Index from '@/views/index/index.vue';
import Main from '@/views/Main.vue';
import Table from '@/views/nav1/Table.vue';
import Form from '@/views/nav1/Form.vue';
import user from '@/views/nav1/user.vue';
import Page4 from '@/views/nav2/Page4.vue';
import Page5 from '@/views/nav2/Page5.vue';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/login',
      component: Login,
      name: '',
      hidden: true
    },
    {
      path: '/404',
      component: NotFound,
      name: '',
      hidden: true
    },
    {
      path: '/',
      component: Home,
      isSingle: true,
      name: '首页',
      children: [{
        path: '',
        component: Index,
        name: '主页'
      }]
    },
    {
      path: '/',
      component: Home,
      name: '导航一',
      children: [{
          path: '/main',
          component: Main,
          name: '主页'
        },
        {
          path: '/table',
          component: Table,
          name: 'Table'
        },
        {
          path: '/form',
          component: Form,
          name: 'Form'
        },
        {
          path: '/user',
          component: user,
          name: '列表'
        },
      ]
    },
    {
      path: '/',
      component: Home,
      name: '导航二',
      children: [{
          path: '/page4',
          component: Page4,
          name: '页面4'
        },
        {
          path: '/page5',
          component: Page5,
          name: '页面5'
        }
      ]
    },
    {
      path: '*',
      hidden: true,
      redirect: {
        path: '/404'
      }
    }
  ]
})
