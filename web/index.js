import App from "./App.vue";
import router from "./router";
import Vue from "vue";
import playground from "page-playground";
import "page-playground/dist/plugin.css";
import lib from "lif3ng-console-vue-component";
import "lif3ng-console-vue-component/lib/lib.css";
Vue.use(lib);
Vue.use(playground);
Vue.prototype.os_platform = window.os_platform;
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
