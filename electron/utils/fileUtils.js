const fs = require("fs");
const { parse } = require("jsonc-parser");
exports.resolvePagePgRc = (rcPath) => {
  console.log({ rcPath });
  const str = fs.readFileSync(rcPath, { encoding: "utf-8" });

  return parse(str);
};
