import { UserRole } from "@/api/login";
import { defaultRouter, asyncRouter } from "@/router";

function hsaPermission(roles, router) {
  // 用户角色：["sale", "technician", "manager"]
  // 路由配置：["sale"]
  /* console.log(roles)
  console.log(router.meta.role) */
  let flag = false
  if(router.meta && router.meta.role){
    flag = roles.some(item => router.meta.role.indexOf(item) !== -1)
  }
  return flag
}

const state = {
  roles: [],
  // 存储路由
  allRouters: defaultRouter,
  addRouters: []
};

const getters = {
  roles: state => state.roles,
  allRouters: state => state.allRouters,
  addRouters: state => state.addRouters
};

const mutations = {
  SET_ROLES(state, value) {
    state.roles = value;
  },
  SET_ROUTER(state, value) {
    state.addRouters = value;
    state.allRouters = defaultRouter.concat(value);
  }
};

const actions = {
  /**
   * 获取用户角色
   * @param {*} context
   * @param {*} data
   */
  getRoles(context, data) {
    // console.log(context)
    return new Promise((resolve, reject) => {
      UserRole().then(res => {
        context.commit("SET_ROLES", res.data.role);
        resolve(res);
      });
    });
  },

  // 创建动态路由
  createRouter({ commit }, data) {
    return new Promise((resolve, reject) => {
      // 当前用户角色 ['infoSystem','userSystem']
      let role = data.data.role
      // 登录用户是超管时
      let addRouter = []
      if(role.includes('admin')){
        addRouter = asyncRouter
      }else{
        // 登录用户是普通用户时
        addRouter = asyncRouter.filter(item => {
          /*
          系统权限 
          if(role.includes(item.meta.system)){
            return item
          }
          */
          if(hsaPermission(role,item)){
            // 对子路由进行判断
            if(item.children && item.children.length > 0){
              item.children = item.children.filter(child => {
                if(hsaPermission(role, child)){
                  return child
                }
              })
              return item
            }
            return item
          }
        })
        addRouter.push(asyncRouter[asyncRouter.length-1])
      }
      // 更新路由
      commit('SET_ROUTER', addRouter)
      resolve()
    })
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
