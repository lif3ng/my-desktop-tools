<template>
  <div style="background: #fff">
    <div>App.vue</div>
    <router-link to="/" v-if="$route.name !== 'home'">back</router-link>
    <div>router path:{{ $route.path }} router name:{{ $route.name }}</div>
    <router-view />
  </div>
</template>
<script>
export default {
  mounted() {
    console.log(this);
  },
};
</script>
