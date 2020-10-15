<template>
  <div>
    <proxy-area v-if="os_platform === 'win32'" />
    <dns-area />
    <interface-area />
  </div>
</template>
<script>
import ProxyArea from "./ProxyArea";
import DnsArea from "./DnsArea";
import InterfaceArea from "./InterfaceArea";
export default {
  components: { ProxyArea, DnsArea, InterfaceArea },
};
</script>
