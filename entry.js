const path = require("path");
const electron = require("electron");
const spawn = require("cross-spawn");
const watch = require("glob-watcher");

let electronProcess, devServerURL;
const vueProcess = spawn(
  require.resolve("@vue/cli-service/bin/vue-cli-service.js"),
  ["serve", path.join(__dirname, "web")]
);

const findDevServerUrl = (data) => {
  const msg = data.toString();
  console.log(msg);
  const matchResult = msg.match(/- Local:\W+(.*)\W/);
  if (matchResult) {
    devServerURL = matchResult[1];
    console.log(`Run electron with URL: ${devServerURL}`);
    startElectron(devServerURL);
    watchMainFiles();
    vueProcess.stdout.removeListener("data", findDevServerUrl);
    vueProcess.stdout.addListener("data", (x) => console.log(x.toString()));
  }
};
vueProcess.stdout.addListener("data", findDevServerUrl);
vueProcess.on("error", console.log);
const startElectron = (url) => {
  electronProcess = spawn(
    electron,
    ["--inspect", require.resolve("./electron/main.js"), url],
    {
      stdio: "inherit",
    }
  );
};

const watchMainFiles = () => {
  console.log("watch electron main process files");
  watch(["./electron/**/*.js"], (done) => {
    console.log("main files change");
    electronProcess.kill();
    startElectron(devServerURL);
    done();
  });
};
