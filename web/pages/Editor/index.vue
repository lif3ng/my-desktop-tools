<template>
  <div>
    editor<br />{{ dir }}
    <nq-button @click="openDir">打开目录</nq-button>
    <div>
      {{ pgData }} <nq-button @click="pgVisible = true">创建demo</nq-button>
      选择一个md文档
      <html-playground v-if="pgVisible" @save="handleDemoSave" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return { dir: {}, pgVisible: false };
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
  computed: {
    pgData() {
      return this.dir["page-playground"];
    },
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
    handleDemoSave(...args) {
      return console.log(args);
    },
  },
};
</script>
