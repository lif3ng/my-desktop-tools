import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./pages/Home";
import Internet from "./pages/Internet";
const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/internet", component: Internet },
];
Vue.use(VueRouter);
export default new VueRouter({
  routes,
});
