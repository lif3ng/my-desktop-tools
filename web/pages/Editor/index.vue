<template>
  <div>
    editor<br />{{ dir }}
    <nq-button @click="openDir">打开目录</nq-button>
  </div>
</template>
<script>
export default {
  data() {
    return { dir: {} };
  },
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
      if (dir && dir.length) {
        ipcRenderer.invoke("dir-load", dir[0]).then((data) => {
          const { dir: isDir, ...args } = data;
          console.log(args);
          if (!isDir) this.$message.error("请选择目录");
          else this.dir = data;
        });
      }
    },
  },
};
</script>
