<template>
  <div>
    editor<br />
    <nq-button @click="openDir">打开目录</nq-button>
  </div>
</template>
<script>
export default {
  mounted() {
    /**
     * 读取剪贴板路径
     */
    const text = clipboard.readText();
    console.log({ text });
    // if (text) {
    //   try {
    //     console.log(fs);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
  },
  methods: {
    openDir() {
      const { dialog } = remote;
      const dir = dialog.showOpenDialogSync({
        properties: ["openFile", "openDirectory"],
      });
      alert(dir);
    },
  },
};
</script>
