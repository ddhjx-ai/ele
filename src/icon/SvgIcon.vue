<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
import { reactive, ref, isRef, onMounted,computed } from "@vue/composition-api";
export default {
  name: 'svgIcon',
  props: {
      iconClass: {
        type: String,
        default: ''
      },
      className: {
        type: String,
        default: ''
      }
    },
  setup(props){
    
    /* 
      computed:监听属性变化，并计算属性
    */
    const iconName = computed(() => {
      return `#icon-${props.iconClass}`
    })
    const svgClass = computed(() => {
      return `svg-icon ${props.className}`
    })

    return{
      iconName,
      svgClass
    }
  }
}
</script>

<style scoped lang="scss">
.svg-icon{
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>