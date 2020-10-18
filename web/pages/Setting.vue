<template>
  <div>
    <nq-form-area title="TCB" :items="items" v-model="form" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      items: [
        { label: "secretId", prop: "secretId" },
        { label: "secretKey", prop: "secretKey" },
        { label: "envId", prop: "envId" },
      ],
    };
  },
  mounted() {
    this.loadSetting();
  },
  methods: {
    loadSetting() {
      ipcRenderer.invoke("setting-get", "tcb");
    },
  },
};
</script>
