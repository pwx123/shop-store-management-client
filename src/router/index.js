import Vue from 'vue';
import Router from 'vue-router';

const Forbidden = () => import( /* webpackChunkName: "Forbidden" */ '@/views/error/403');
const NotFound = () => import( /* webpackChunkName: "NotFound" */ '@/views/error/404');
const ServerError = () => import( /* webpackChunkName: "ServerError" */ '@/views/error/500');
const Login = () => import( /* webpackChunkName: "Login" */ '@/views/Login');
const Home = () => import( /* webpackChunkName: "Home" */ '@/views/home/Home');
const Index = () => import( /* webpackChunkName: "Index" */ '@/views/index/Index');
const OrderList = () => import( /* webpackChunkName: "OrderList" */ '@/views/order/OrderList');
const UserList = () => import( /* webpackChunkName: "UserList" */ '@/views/user/UserList');
const BookList = () => import( /* webpackChunkName: "BookList" */ '@/views/book/BookList');
const BookClassify = () => import( /* webpackChunkName: "BookClassify" */ '@/views/book/BookClassify');



Vue.use(Router);

export default new Router({
  routes: [{
      path: '/login',
      component: Login,
      name: '',
      hidden: true
    },
    {
      path: '/',
      component: Home,
      isSingle: true,
      iconCls: 'iconfont icon-home',
      children: [{
        path: '',
        component: Index,
        name: '首页'
      }]
    },
    {
      path: '/',
      component: Home,
      name: '订单管理',
      iconCls: 'iconfont icon-emaxcitygerenxinxitubiaoji03',
      children: [{
        path: '/orderList',
        component: OrderList,
        name: '订单列表'
      }]
    },
    {
      path: '/',
      component: Home,
      name: '图书管理',
      iconCls: 'iconfont icon-book',
      children: [{
          path: '/bookList',
          component: BookList,
          name: '图书列表'
        },
        {
          path: '/bookClassify',
          component: BookClassify,
          name: '分类管理'
        }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '用户管理',
      iconCls: 'iconfont icon-icon_user_management',
      children: [{
        path: '/userList',
        component: UserList,
        name: '用户列表'
      }]
    },
    {
      path: '/',
      component: Home,
      hidden: true,
      children: [{
        path: '/forbidden',
        component: Forbidden,
        name: 'forbidden'
      }, {
        path: '/serverError',
        component: ServerError,
        name: 'serverError'
      }, {
        path: '/*',
        component: NotFound,
        name: '404'
      }]
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
