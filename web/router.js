import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./pages/Home";
import Internet from "./pages/Internet";
import Clipboard from "./pages/Clipboard";
import Setting from "./pages/Setting";
import Editor from "./pages/Editor";
const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/internet", component: Internet },
  { path: "/clipboard", component: Clipboard },
  { path: "/setting", component: Setting },
  { path: "/editor", component: Editor },
];
Vue.use(VueRouter);
export default new VueRouter({
  routes,
});
