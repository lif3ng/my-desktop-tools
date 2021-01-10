const fs = require("fs");
const path = require("path");
const { resolvePagePgRc } = require("../utils/fileUtils");
module.exports = (dir) => {
  console.log(dir);
  const isDir = fs.statSync(dir).isDirectory();
  console.log({ isDir });
  if (!isDir) return { dir: false };
  const fileList = fs.readdirSync(dir);
  console.log({ fileList });
  return fileList.reduce(
    (o, filepath) => {
      switch (filepath) {
        case ".git":
          o.git = {};
          break;
        case "package.json":
          o.pkg = o.pkg ? { ...o.pkg, type: "js" } : { type: "js" };
          break;
        case "yarn.lock":
          o.pkg = o.pkg ? { ...o.pkg, tool: "yarn" } : { tool: "yarn" };
          break;
        case ".page.pg.rc":
          o["page-playground"] = resolvePagePgRc(path.join(dir, ".page.pg.rc"));
          break;
        default:
      }
      return o;
    },
    { dir }
  );
};
