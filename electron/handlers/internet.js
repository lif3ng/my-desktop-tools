const regedit = require("regedit");
const key =
  "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings";

const valueTypeByKey = {};
const keyValueObj = {};

exports.getInternetValues = () =>
  new Promise((resolve, reject) => {
    regedit.list(key, function (
      err,
      {
        [key]: {
          values,
          values: { ProxyServer },
        },
      }
    ) {
      if (err) reject(err);
      console.log(values);
      Object.entries(values).forEach(
        ([key, { type, value }]) =>
          ([valueTypeByKey[key], keyValueObj[key]] = [type, value])
      );
      console.log({ valueTypeByKey });
      console.log({ ProxyServer });
      resolve(keyValueObj);
    });
  });

const setByKey = (k, v) =>
  new Promise((resolve, reject) => {
    console.log({ k, v });
    regedit.putValue(
      {
        [key]: {
          [k]: {
            value: v,
            type: valueTypeByKey[k],
          },
        },
      },
      (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
exports.setInternetInfo = (data) =>
  new Promise((resolve, reject) => {
    console.log(data);
    console.log(Object.entries(data));
    const allPromises = Object.entries(data).map(([k, v]) => setByKey(k, v));
    Promise.all(allPromises).then(resolve).catch(reject);
  });
