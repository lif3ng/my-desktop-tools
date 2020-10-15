<template>
  <div>
    Home
    <router-link to="/internet">网络</router-link>
    <router-link to="/clipboard">剪贴板</router-link>
  </div>
</template>
<script>
export default {
  mounted() {
    console.log("home mounted");
  },
};
</script>
