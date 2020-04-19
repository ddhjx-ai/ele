import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import composition from '@vue/composition-api'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
// 导入vue3.0
Vue.use(composition)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
