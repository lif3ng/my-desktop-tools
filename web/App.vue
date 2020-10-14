<template>
  <div>
    <div>App.vue</div>
    <div>{{ $route.path }}{{ $route.name }}</div>
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
