<template>
  <div>
    <div
      class="demo-item"
      v-for="file in demos"
      @click="$emit('demo-select', file)"
      :key="file"
    >
      {{ file }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["dirs"],
  data() {
    return {
      demos: [],
    };
  },
  watch: {
    dirs: {
      immediate: true,
      handler() {
        ipcRenderer
          .invoke("file-list", this.dirs)
          .then((data) => (this.demos = data));
      },
    },
  },
};
</script>

<style scoped lang="stylus">
.demo-item {
  cursor: pointer;

  &:hover {
    background: #abc;
  }
}
</style>
