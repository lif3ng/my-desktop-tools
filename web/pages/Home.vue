<template>
  <div class="home-page">
    <router-link to="/internet">网络</router-link>
    <router-link to="/clipboard">剪贴板</router-link>
    <router-link to="/setting">设置</router-link>
    <router-link to="/editor">编辑器</router-link>
  </div>
</template>
<script>
export default {
  mounted() {
    console.log("home mounted");
  },
};
</script>
<style lang="stylus" scoped>
.home-page {
  >a {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    text-decoration: none;
    box-shadow: 2px 2px 10px #ddd;
    color: #555;
    margin: 5px;
    transform: 3s;

    &:hover {
      box-shadow: 2px 2px 10px #aaa;
    }
  }
}
</style>
