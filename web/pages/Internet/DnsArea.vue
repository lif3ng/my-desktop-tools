<template>
  <nq-form-area title="DNS" :items="items">
    <template #dns>
      <div v-for="(d, index) in dnsList" :key="index">{{ d }}</div>
    </template>
  </nq-form-area>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          label: "当前 DNS Server",
          prop: "dns",
          type: "text",
          slot: true,
        },
      ],
      dnsList: [],
    };
  },
  mounted() {
    ipcRenderer.invoke("dns-get").then((list) => {
      this.dnsList = list;
    });
  },
};
</script>
