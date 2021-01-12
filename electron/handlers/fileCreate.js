const path = require("path");
const fs = require("fs");
exports.fileCreate = (dirs) => {
  console.log("fileCreate", { dirs });
  const fullPath = path.join(...dirs);
  fs.writeFileSync(fullPath, "");
  return fullPath;
};

exports.dirCreate = (dirs) => {
  console.log({ dirs });
  const fullPath = path.join(...dirs);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log({ fullPath });
};

exports.demoSave = (dirs, data) => {
  const fileName = dirs.pop();
  const fullPath = path.join(...dirs);
  fs.mkdirSync(fullPath, { recursive: true });
  const fileFullPath = path.join(...dirs, fileName);
  fs.writeFileSync(fileFullPath, JSON.stringify(data));
  return fileFullPath;
};
