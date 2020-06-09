<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMeunStatus">
      <svg-icon iconClass="menu" class="menu"></svg-icon>
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <img src="../../../assets/images/face.jpg" alt />
        {{username}}
      </div>
      <div class="header-icon pull-left" @click="exit">
        <svg-icon iconClass="exit" class="exit"></svg-icon>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "@vue/composition-api";
export default {
  name: "layoutHeader",
  setup(props, { root }) {
    const username = computed(() => root.$store.state.app.username)
    const navMeunStatus = () => {
      root.$store.commit('app/setCollapse')
    }
    const exit = ()=>{
      root.$store.commit('permission/SET_ROLES', [])
      root.$store.dispatch('app/logout').then(() => {
        root.$router.push({
          name: 'Login'
        })
      })
    }

    return{
      navMeunStatus,
      username,
      exit
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: $navMenu;
  height: 75px;
  background-color: #fff;
  line-height: 75px;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, .1));
  @include webkit(transition, all .3s ease 0s);
}
.open{
  #header-wrap{
    left: $navMenu;
  }
}
.close{
  #header-wrap{
    left: $navMenuMin;
  }
}
.header-icon {
  padding: 0 32px;
  svg {
    margin-bottom: -8px;
    font-size: 25px;
    cursor: pointer;
  }
}
.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header-icon {
    padding: 0 28px;
  }
  img {
    display: inline-block;
    margin-bottom: -12px;
    margin-right: 18px;
    border-radius: 50px;
  }
}
</style>