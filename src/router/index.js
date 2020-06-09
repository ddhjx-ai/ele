import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

// 引入布局组件
// import Layout from '@/views/Layout/index.vue'
const Layout = () => import("@/views/Layout/index.vue");

/* 
  1.系统分配：infoSystem,userSystem
  2.角色分配：sale,technician,manager
*/
/* 
  1.默认路由：所有用户都可以访问
  2.动态路由：指定角色的用户才可以访问
*/

// 默认路由
export const defaultRouter = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("@/views/Login/index.vue"),
    meta: {
      name: "登录"
    }
  },
  {
    path: "/console",
    name: "Console",
    component: Layout,
    meta: {
      name: "控制台",
      icon: "console"
    },
    redirect: {
      name: "ConsoleIndex"
    },
    children: [
      {
        path: "/consoleIndex",
        name: "ConsoleIndex",
        meta: {
          name: "首页"
        },
        component: () => import("@/views/Console/index.vue")
      }
    ]
  },
  // 404页面
  {
    path: "/page404",
    component: Layout,
    hidden: true,
    meta: {
      name: "404",
      icon: "404"
    },
    children: [
      {
        path: '/404',
        meta: {
          name: '404'
        },
        component: () => import("@/views/404.vue")
      }
    ]
  }
];

// 动态路由
export const asyncRouter = [
  {
    path: "/info",
    name: "Info",
    component: Layout,
    meta: {
      role: ['sale'],
      system: 'infoSystem',
      name: "信息管理",
      icon: "info"
    },
    children: [
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta: {
          keepAlive: true,
          role: ['sale'],
          name: "信息列表"
        },
        component: () => import("@/views/Info/index.vue")
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          keepAlive: true,
          role: ['sale'],
          name: "信息分类"
        },
        component: () => import("@/views/Info/category.vue")
      },
      {
        path: "/infoDetail",
        name: "InfoDetail",
        hidden: true,
        meta: {
          keepAlive: true,
          role: ['sale'],
          name: "信息详情"
        },
        component: () => import("@/views/Info/detail.vue")
      }
    ]
  },
  {
    path: "/user",
    name: "User",
    component: Layout,
    meta: {
      role: ['sale'],
      system: 'userSystem',
      name: "用户管理",
      icon: "user"
    },
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        meta: {
          role: ['sale'],
          name: "首页"
        },
        component: () => import("@/views/User/index.vue")
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

const routes = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("@/views/Login/index.vue"),
    meta: {
      name: "登录"
    }
  },
  {
    path: "/console",
    name: "Console",
    component: Layout,
    meta: {
      name: "控制台",
      icon: "console"
    },
    redirect: {
      name: "ConsoleIndex"
    },
    children: [
      {
        path: "/consoleIndex",
        name: "ConsoleIndex",
        meta: {
          name: "首页"
        },
        component: () => import("@/views/Console/index.vue")
      }
    ]
  },
  {
    path: "/info",
    name: "Info",
    component: Layout,
    meta: {
      name: "信息管理",
      icon: "info"
    },
    children: [
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta: {
          name: "信息列表"
        },
        component: () => import("@/views/Info/index.vue")
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          name: "信息分类"
        },
        component: () => import("@/views/Info/category.vue")
      },
      {
        path: "/infoDetail",
        name: "InfoDetail",
        hidden: true,
        meta: {
          name: "信息详情"
        },
        component: () => import("@/views/Info/detail.vue")
      }
    ]
  },
  {
    path: "/user",
    name: "User",
    component: Layout,
    meta: {
      name: "用户管理",
      icon: "user"
    },
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        meta: {
          name: "首页"
        },
        component: () => import("@/views/User/index.vue")
      }
    ]
  }
];

const router = new VueRouter({
  routes: defaultRouter
  // routes: routes
});

export default router;
