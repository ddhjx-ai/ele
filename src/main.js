import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import composition from '@vue/composition-api'
import 'element-ui/lib/theme-chalk/index.css'
import '@/icon'
import './router/premit'

/* import global from '@/utils/global.js'
Vue.use(global) */

// 引入按钮权限
import {buttonPermission} from '@/utils/buttonPermission.js'
Vue.prototype.btnPerm = buttonPermission

Vue.use(ElementUI)
// 导入vue3.0
Vue.use(composition)
Vue.config.productionTip = false

// 自定义指令
Vue.directive('btnPerm', {
  // 父级为渲染
  bind(el, binding, vnode){
    if(binding.def.hasPermission(binding.value)){
      el.style.display = 'inline-block'
    }else {
      el.style.display = 'none'
    }
  },
  // 此时才能操作父节点
  inserted() {
  },
  hasPermission(permission){
    const buttons = store.getters['app/buttonPermission']
    const roles = store.getters['permission/roles']
    // 如果用户是超级管理员，直接返回ture
    if(roles.includes('admin')){
      return true
    }
    return buttons.indexOf(permission) !== -1
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
