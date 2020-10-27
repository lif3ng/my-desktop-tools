const path = require("path");
const electron = require("electron");
const spawn = require("cross-spawn");

let electronProcess;
const vueProcess = spawn(
  require.resolve("@vue/cli-service/bin/vue-cli-service.js"),
  ["serve", path.join(__dirname, "web")]
);

const findDevServerUrl = (data) => {
  const msg = data.toString();
  const matchResult = msg.match(/- Local:\W+(.*)\W/);
  if (matchResult) {
    console.log(`Run electron with URL: ${matchResult[1]}`);
    startElectron(matchResult[1]);
    vueProcess.stdout.removeListener("data", findDevServerUrl);
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
