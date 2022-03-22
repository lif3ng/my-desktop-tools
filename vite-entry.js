const path = require("path");
const { createServer } = require("vite");
const { createVuePlugin } = require("vite-plugin-vue2");
const electron = require("electron");
const spawn = require("cross-spawn");
const watch = require("glob-watcher");

(async () => {
  const server = await createServer({
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    plugins: [createVuePlugin()],
    root: path.join(__dirname, "web"),
    server: {
      port: 8080,
    },
  });
  const { config } = await server.listen();
  const url = `http://localhost:${config.server.port}`;

  console.log(url);
  const startElectron = () => {
    electronProcess = spawn(
      electron,
      ["--inspect", require.resolve("./electron/main.js"), url],
      {
        stdio: "inherit",
      }
    );
  };

  startElectron();
  watch(["./electron/**/*.js"], (done) => {
    console.log("main files change");
    electronProcess.kill();
    startElectron();
    done();
  });
})();
