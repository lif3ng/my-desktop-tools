<template>
  <div>
    <div v-for="file in demos" :key="file">{{ file }}</div>
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

<style></style>
