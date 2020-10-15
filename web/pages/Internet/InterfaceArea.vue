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
      const result = Object.entries(interfaceObj)
        .map(([name, list]) => {
          const v4List = list.filter(
            ({ address, netmask, family, internal }) =>
              family === "IPv4" && !internal
          );
          return {
            name,
            ...(v4List.length ? v4List[0] : null),
          };
        })
        .filter(({ address }) => address);
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
