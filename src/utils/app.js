import cookie from 'cookie_js'

const adminToKen = "admin_toKen";
const usernameKey = "username";

export function getToken() {
  return cookie.get(adminToKen)
}

export function setToken(token) {
  cookie.set(adminToKen,token)
}

export function removeToken(){
  cookie.remove(adminToKen);
}

export function getUsername() {
  return cookie.get(usernameKey)
}

export function setUsername(value){
  cookie.set(usernameKey,value)
}

export function removeUsername(){
  cookie.remove(usernameKey)
}