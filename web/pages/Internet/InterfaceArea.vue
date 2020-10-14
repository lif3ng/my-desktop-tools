<template>
  <nq-form-area title="网卡" v-model="currentInterface" :items="items" />
</template>
<script>
export default {
  data() {
    return {
      interfaceList: [],
      currentInterface: {},
      items: [
        { label: "网卡名称", prop: "name", type: "text" },
        { label: "地址", prop: "address", type: "copyInput" },
        { label: "掩码", prop: "netmask", type: "copyInput" },
      ],
    };
  },
  mounted() {
    ipcRenderer.invoke("interface-get").then((interfaceObj) => {
      console.log(interfaceObj);
      const result = Object.entries(interfaceObj).map(
        ([name, [_v6, { address, netmask }]]) => ({
          name,
          address,
          netmask,
        })
      );
      this.interfaceList = result;
    });
  },
  watch: {
    interfaceList(list) {
      const result = list.filter(({ address }) => address.startsWith("10.1."));
      this.currentInterface = result.length
        ? result[0]
        : list.find(({ address }) => address !== "172.0.0.1");
    },
  },
};
</script>
