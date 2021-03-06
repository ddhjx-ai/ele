import { MessageBox,Message  } from 'element-ui';

// Vue插件
export default {
  install (Vue, options) {
    Vue.prototype.confirm = (params) => {
      MessageBox.confirm(params.content, params.tips || '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: params.type || 'warning',
        center: true
      }).then(() => {
        params.fn && params.fn(params.id)
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      });
    }
    
  }
}