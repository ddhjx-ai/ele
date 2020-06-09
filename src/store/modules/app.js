import { Login, Logout } from "@/api/login.js";
import {
  setToken,
  getToken,
  removeToken,
  getUsername,
  setUsername,
  removeUsername
} from "@/utils/app";

const state = {
  buttonPermission: [],
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  token: "",
  username: getUsername() || ""
};

const getters = {
  isCollapse: state => state.isCollapse,
  buttonPermission: state => state.buttonPermission
};

const mutations = {
  setCollapse(state) {
    state.isCollapse = !state.isCollapse;
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  },
  set_token(state, value) {
    state.token = value;
  },
  set_username(state, value) {
    state.username = value;
  },
  SET_BUTTON(state, value) {
    state.buttonPermission = value;
  }
};

const actions = {
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      Login(data)
        .then(res => {
          let data = res.data;
          commit("set_token", data.token);
          commit("set_username", data.username);
          setToken(data.token);
          setUsername(data.username);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      // Logout().then(res => {
        removeToken();
        removeUsername();
        commit("set_token", "");
        commit("set_username", "");
        resolve();
      // });
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
