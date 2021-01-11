<template>
  <div>
    editor<br />{{ dir }}
    <nq-button @click="openDir">打开目录</nq-button>
    <div>
      {{ fileDir }}{{ fileName }}

      <input
        v-if="!fileName"
        @input="handleFileInputInput"
        @change="handleFileInputChange"
        @keydown="hanldeFileInputKeyDown"
        v-model="fileInputValue"
        list="editFileList"
        placeholder="选择一个md文档"
      />
      <datalist id="editFileList">
        <option v-for="name in fileDataList" :key="name">
          {{ name }}
        </option>
      </datalist>
      <nq-button v-if="fileDir || fileName" @click="handleDirBack">
        返回
      </nq-button>
      <nq-button>创建文件</nq-button>
      <nq-button>创建目录</nq-button>
    </div>
    <nq-button @click="pgVisible = true">创建demo</nq-button>
    <html-playground v-if="pgVisible" @save="handleDemoSave" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      dir: {},
      fileInputValue: "",
      pgVisible: false,
      fileDir: "",
      fileName: "",
      fileDataList: [],
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
            this.loadFileDataList();
          }
        });
      }
    },
    loadFileDataList() {
      ipcRenderer
        .invoke("dir-file-load", [this.dir.dir, this.pgData.docDir])
        .then((list) => {
          this.fileDataList = list;
        });
    },
    cleanFileInput() {
      this.fileInputValue = "";
    },
    handleDemoSave(...args) {
      if (!this.fileName) {
        this.$message.error("请先选择一个Markdown文件");
        return;
      }
      // todo 录入额外信息: 文件名、rc文件定义的额外字段
      // save
      // ipcRenderer.invoke("save-demo");
      return console.log(args);
    },
    handleFileInputInput(e) {
      const value = e.target.value;
    },
    handleFileInputChange(e) {
      const v = e.target.value;
      console.log("handleFileInputChange", v);

      if (this.fileDataList.find((x) => x === v) !== null) {
        if (v.endsWith("/")) {
          this.handleDirPush(v);
        } else {
          if (v.endsWith(".md")) {
            this.fileName = v;
          }
        }
      }
    },
    hanldeFileInputKeyDown(e) {
      console.log("hanldeFileInputKeyDown", e);
      const { key } = e;
      if (key === "Tab") {
        console.log("press Tab");
        e.preventDefault();
      }
    },
    handleDirPush(v) {
      this.fileDir += v;
      this.cleanFileInput();
      this.loadFileDataList();
    },
    handleDirBack() {
      if (this.fileName) {
        this.fileName = "";
        this.cleanFileInput();
        return;
      }
      const lastIndex = this.fileDir.lastIndexOf("/", this.fileDir.length - 2);
      if (lastIndex === -1) {
        this.fileDir = "";
        this.cleanFileInput();
      } else {
      }
      this.loadFileDataList();
    },
    handleDirAdd() {},
    handleFileAdd() {},
  },
};
</script>
