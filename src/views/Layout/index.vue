<template>
  <div :class="[meunStatus ? 'close' : 'open']">
    <LayoutHeader></LayoutHeader>
    <LayoutMain></LayoutMain>
    <LayoutNav></LayoutNav>
  </div>
</template>

<script>
import LayoutHeader from './Components/Header'
import LayoutMain from './Components/Main'
import LayoutNav from './Components/Nav'
import { reactive, ref, isRef, onMounted, computed } from "@vue/composition-api";
export default {
  name: 'layout',
  components: {
    LayoutHeader,
    LayoutMain,
    LayoutNav
  },
  setup(props, {root}){
    const meunStatus = computed(() => root.$store.state.isCollapse)

    return{
      meunStatus
    }
  }
}
</script>

<style scpoed>

</style>