<template>
  <div>
    playground
    <div>
      {{ fileDir }}{{ fileName }}
      <input
        class="ml-1 mr-4 px-2 border-none leading-8 focus:outline-none focus:ring focus:border-blue-300"
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
        <IconToLeft />
      </nq-button>
      <nq-button @click="handleMdFileCreate">创建md文件</nq-button>
      <nq-button @click="handleDirCreate"><IconFolderPlus /></nq-button>
    </div>

    <nq-button @click="pgVisible = true">创建demo</nq-button>

    <div class="flex">
      <div class="p-3 border-0 border-r-2 border-black mr-2 border-dashed">
        <demo-list
          v-if="demoDirs.length"
          :dirs="demoDirs"
          @demo-select="handleDemoSelect"
        />
      </div>
      <div class="flex-1">
        <template v-if="pgVisible">
          值比较<nq-switch v-model="isCssValueList" />
          <html-css-comparison-table
            v-if="isCssValueList"
            edit
            @save="handleDemoSave"
          />
          <html-playground
            v-else
            @save="handleDemoSave"
            v-bind="demoFileData"
            :key="demoKey"
          />
        </template>
      </div>
    </div>
    <demo-detail-dialog
      v-if="demoDetailDialogVisible"
      @close="demoDetailDialogVisible = false"
      @submit="handleDemoDetailSubmit"
    />
  </div>
</template>
<script>
import DemoDetailDialog from "./DemoDetailDialog";
import DemoList from "./DemoList";
import {
  FolderPlus as IconFolderPlus,
  ToLeft as IconToLeft,
} from "@icon-park/vue";

export default {
  components: {
    DemoDetailDialog,
    DemoList,

    IconFolderPlus,
    IconToLeft,
  },
  props: ["baseDir", "data"],
  data() {
    console.log(this.baseDir, this.$props.data);
    return {
      demoFileData: {},
      demoKey: 0,
      fileInputValue: "",
      pgVisible: false,
      demoDetailDialogVisible: false,
      fileDir: "",
      fileName: "",
      fileDataList: [],
      isCssValueList: false,
    };
  },
  mounted() {
    this.loadFileDataList();
  },
  watch: {
    demoFileData() {
      this.demoKey += 1;
    },
  },
  computed: {
    demoDirs() {
      return this.fileName
        ? [
            this.baseDir,
            this.data.demoDir,
            this.fileDir,
            `${this.fileName.replace(/\.md$/, "")}`,
          ]
        : [];
    },
    demoPath() {
      return this.pgData ? `${this.dir.dir}/${this.pgData.demoDir}` : "";
    },
  },
  methods: {
    loadFileDataList() {
      ipcRenderer
        .invoke("dir-file-load", [this.baseDir, this.data.docDir, this.fileDir])
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
          this.baseDir,
          this.data.docDir,
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
    handleDemoSelect(file) {
      console.log({ file });
      const demoData = ipcRenderer
        .invoke("demo-read", [...this.demoDirs, file])
        .then((data) => {
          this.demoFileData = data;
          this.pgVisible = true;
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
        .invoke("demo-save", [...this.demoDirs, `${fileName}.json`], {
          ...this.demoData,
          ...otherArgs,
        })
        .then(() => {
          const Mustache = require("mustache");
          const copyContent = this.pgData.copyContentTpl
            ? Mustache.render(this.pgData.copyContentTpl, { key: fileName })
            : "";
          if (copyContent) {
            clipboard.writeText(copyContent);
          }
          this.$message(
            `保存成功 ${copyContent}${copyContent && " 已复制到剪贴板"}`
          );
          this.demoDetailDialogVisible = false;
        });
    },
  },
};
</script>
