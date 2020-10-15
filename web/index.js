import App from "./App.vue";
import router from "./router";
import Vue from "vue";
import lib from "lif3ng-console-vue-component";
import "lif3ng-console-vue-component/lib/lib.css";
Vue.use(lib);
Vue.prototype.os_platform = window.os_platform;
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
