<template>
  <div>
    editor<br />{{ dir }}
    <nq-button @click="openDir">打开目录</nq-button>
    <demo-container v-if="pgData" :baseDir="baseDir" :data="pgData" />
  </div>
</template>
<script>
import DemoContainer from "./playground";
export default {
  components: {
    DemoContainer,
  },
  data() {
    return {
      dir: {},
    };
  },
  mounted() {
    /**
     * 读取剪贴板路径
     */
    // const text = clipboard.readText();
    // console.log({ text });
  },

  computed: {
    pgData() {
      return this.dir["page-playground"];
    },
    baseDir() {
      return this.dir.dir;
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
          else {
            this.dir = data;
            // this.loadFileDataList();
          }
        });
      }
    },
  },
};
</script>
