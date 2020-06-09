import store from '@/store'

export function buttonPermission(permission) {
  const buttons = store.getters['app/buttonPermission']
  return buttons.indexOf(permission) !== -1
}