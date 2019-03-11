import Vue from 'vue';
import Router from 'vue-router';

const Forbidden = () => import( /* webpackChunkName: "Forbidden" */ '@/views/error/403');
const NotFound = () => import( /* webpackChunkName: "NotFound" */ '@/views/error/404');
const ServerError = () => import( /* webpackChunkName: "ServerError" */ '@/views/error/500');
const Login = () => import( /* webpackChunkName: "Login" */ '@/views/Login');
const Register = () => import( /* webpackChunkName: "Register" */ '@/views/Register');
const Home = () => import( /* webpackChunkName: "Home" */ '@/views/home/Home');
const Index = () => import( /* webpackChunkName: "Index" */ '@/views/index/Index');
const OrderList = () => import( /* webpackChunkName: "OrderList" */ '@/views/order/OrderList');
const UserList = () => import( /* webpackChunkName: "UserList" */ '@/views/user/UserList');
const Address = () => import( /* webpackChunkName: "Address" */ '@/views/user/Address');
const BookList = () => import( /* webpackChunkName: "BookList" */ '@/views/book/BookList');
const BookClassify = () => import( /* webpackChunkName: "BookClassify" */ '@/views/book/BookClassify');
const AdminInfo = () => import( /* webpackChunkName: "AdminInfo" */ '@/views/system/AdminInfo');
const ShopManagement = () => import( /* webpackChunkName: "ShopManagement" */ '@/views/system/ShopManagement');

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/login',
      component: Login,
      name: '',
      hidden: true
    },
    {
      path: '/register',
      component: Register,
      name: '',
      hidden: true
    },
    {
      path: '/',
      redirect: 'index',
      hidden: true
    },
    {
      path: '/index',
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
      path: '/index',
      component: Home,
      name: '订单管理',
      iconCls: 'iconfont icon-emaxcitygerenxinxitubiaoji03',
      children: [{
        path: '/index/orderList',
        component: OrderList,
        name: '订单列表'
      }]
    },
    {
      path: '/index',
      component: Home,
      name: '图书管理',
      iconCls: 'iconfont icon-book',
      children: [{
          path: '/index/bookList',
          component: BookList,
          name: '图书列表'
        },
        {
          path: '/index/bookClassify',
          component: BookClassify,
          name: '分类管理'
        }
      ]
    },
    {
      path: '/index',
      component: Home,
      name: '用户管理',
      iconCls: 'iconfont icon-icon_user_management',
      children: [{
          path: '/index/userList',
          component: UserList,
          name: '用户列表'
        },
        {
          path: '/index/address',
          component: Address,
          name: '收获地址管理'
        }
      ]
    },
    {
      path: '/index',
      component: Home,
      name: '系统管理',
      iconCls: 'iconfont icon-setting',
      children: [{
        path: '/index/adminInfo',
        component: AdminInfo,
        name: '信息修改'
      }, {
        path: '/index/shopManagement',
        component: ShopManagement,
        name: '店铺管理'
      }]
    },
    {
      path: '/index',
      component: Home,
      hidden: true,
      children: [{
        path: '/index/forbidden',
        component: Forbidden,
        name: 'forbidden'
      }, {
        path: '/index/serverError',
        component: ServerError,
        name: 'serverError'
      }, {
        path: '/index/*',
        component: NotFound,
        name: '404'
      }]
    },
    {
      path: '*',
      hidden: true,
      component: NotFound,
      name: '404'
    }
  ]
})
