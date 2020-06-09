import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import app from './modules/app.js'
import login from './modules/login.js'
import infoDetail from './modules/infoDetail'
import permission from './modules/permission'

export default new Vuex.Store({
  modules: {
    app,
    login,
    infoDetail,
    permission
  }
})
