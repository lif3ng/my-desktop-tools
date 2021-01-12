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
        ref="fileInput"
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
      <nq-button @click="handleMdFileCreate">创建md文件</nq-button>
      <nq-button @click="handleDirCreate">创建目录</nq-button>
    </div>
    <nq-button @click="pgVisible = true">创建demo</nq-button>
    <html-playground v-if="pgVisible" @save="handleDemoSave" />
    <demo-detail-dialog
      v-if="demoDetailDialogVisible"
      @close="demoDetailDialogVisible = false"
      @submit="handleDemoDetailSubmit"
    />
  </div>
</template>
<script>
import DemoDetailDialog from "./DemoDetailDialog";
export default {
  components: {
    DemoDetailDialog,
  },
  data() {
    return {
      dir: {},
      fileInputValue: "",
      pgVisible: false,
      demoDetailDialogVisible: false,
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
        .invoke("dir-file-load", [
          this.dir.dir,
          this.pgData.docDir,
          this.fileDir,
        ])
        .then((list) => {
          this.fileDataList = list;
        });
    },
    cleanFileInput() {
      this.fileInputValue = "";
    },
    handleDemoSave(data) {
      if (!this.fileName) {
        this.$message.error("请先选择一个Markdown文件");
        return;
      }
      this.demoData = data;
      // todo 录入额外信息: 文件名、rc文件定义的额外字段
      // save
      // ipcRenderer.invoke("save-demo");
      this.demoDetailDialogVisible = true;
    },
    handleFileInputInput(e) {
      const value = e.target.value;
    },
    handleFileInputChange(e) {
      const v = e.target.value;
      console.log(
        "handleFileInputChange",
        v,
        this.fileDataList.find((x) => x === v)
      );

      if (this.fileDataList.find((x) => x === v) !== undefined) {
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
      const {
        key,
        target: { value: v },
      } = e;
      console.log(v);
      if (key === "Tab") {
        console.log("press Tab");
        e.preventDefault();
        const mapItem = this.fileDataList.find((s) => s.startsWith(v));
        console.log({ mapItem });
        if (mapItem) {
          if (mapItem.endsWith("/")) {
            this.handleDirPush(mapItem);
          } else {
            if (mapItem.endsWith(".md")) {
              this.fileName = mapItem;
            }
          }
        }
      }
    },
    handleDirPush(v) {
      this.fileDir += v;
      this.cleanFileInput();
      this.loadFileDataList();
      this.$refs.fileInput.focus();
    },
    handleDirBack() {
      this.cleanFileInput();

      if (this.fileName) {
        this.fileName = "";
        return;
      }
      const lastIndex = this.fileDir.lastIndexOf("/", this.fileDir.length - 2);
      console.log({ lastIndex });
      if (lastIndex === -1) {
        this.fileDir = "";
      } else {
        this.fileDir = this.fileDir.substring(0, lastIndex + 1);
      }
      this.$refs.fileInput.focus();
      this.loadFileDataList();
    },
    handleDirCreate() {
      ipcRenderer
        .invoke("dir-create", [
          this.dir.dir,
          this.pgData.docDir,
          this.fileInputValue,
        ])
        .then(() => {
          this.handleDirPush(
            `${this.fileInputValue}${
              this.fileInputValue.endsWith("/") ? "" : "/"
            }`
          );
        });
    },
    handleMdFileCreate() {
      const fileName = `${this.fileInputValue}${
        this.fileInputValue.endsWith(".md") ? "" : ".md"
      }`;
      ipcRenderer
        .invoke("file-create", [
          this.dir.dir,
          this.pgData.docDir,
          this.fileDir,
          fileName,
        ])
        .then((filePath) => {
          this.fileName = fileName;
          remote.shell.openPath(filePath);
          console.log({ filePath });
        });
    },
    handleDemoDetailSubmit(data) {
      console.log("submit", data);
      const { fileName, ...otherArgs } = data;
      // todo
      ipcRenderer
        .invoke(
          "demo-save",
          [
            this.dir.dir,
            this.pgData.demoDir,
            this.fileDir,
            `${this.fileName.replace(/.md$/, "")}`,
            `${fileName}.json`,
          ],
          {
            ...this.demoData,
            ...otherArgs,
          }
        )
        .then(() => {
          this.$message(`${fileName} 保存成功`);
          this.demoDetailDialogVisible = false;
        });
    },
  },
};
</script>
