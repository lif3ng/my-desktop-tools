const { fork } = require("child_process");
const path = require("path");

fork(require.resolve("@vue/cli-service/bin/vue-cli-service.js"), [
  "serve",
  path.join(__dirname, "web"),
]);

require("./electron/main.js")("http://localhost:8080");
