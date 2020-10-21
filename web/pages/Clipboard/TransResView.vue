<template>
  <div>
    <template v-if="type === 'all'">
      <span v-for="({ target }, index) in data" :key="index">{{ target }}</span>
    </template>
    <template v-else>
      <div v-for="({ target, origin }, index) in data" :key="index">
        <div>{{ origin }}</div>
        <div>{{ target }}</div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: ["type", "data"],
};
</script>
