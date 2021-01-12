<template>
  <nq-dialog title="Demo 信息" v-on="$listeners">
    <nq-form-area v-model="form" :items="items" no-border />
  </nq-dialog>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      items: [{ label: "文件名", prop: "fileName" }],
    };
  },
};
</script>
