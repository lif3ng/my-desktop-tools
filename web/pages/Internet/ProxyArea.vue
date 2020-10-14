<template>
  <nq-form-area title="代理" :items="items" v-model="form">
    <nq-button-area>
      <nq-button @click="openInternetOptions">打开 Internet 选项</nq-button>
      <nq-button @click="loadData">重置</nq-button>
      <nq-button type="primary" @click="save">保存</nq-button>
    </nq-button-area>
  </nq-form-area>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          prop: "ProxyServer",
          label: "代理服务器",
        },
        {
          prop: "ProxyOverride",
          label: "例外",
        },
        {
          prop: "ProxyEnable",
          label: "开启代理",
          type: "switch",
        },
      ],
      form: {},
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      ipcRenderer.invoke("internet-info").then((x) => {
        this.form = x;
      });
    },
    openInternetOptions() {
      shell.openPath("inetcpl.cpl");
    },
    save() {
      const { ProxyServer, ProxyOverride, ProxyEnable } = this.form;
      ipcRenderer
        .invoke("internet-info-set", {
          ProxyServer,
          ProxyOverride,
          ProxyEnable: ProxyEnable ? 1 : 0,
        })
        .then(() => {
          this.$message("保存成功");
          this.loadData();
        });
    },
  },
};
</script>
