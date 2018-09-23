"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

class Newer {
  static statFile(path) {
    return new Promise((resolve, reject) => {
      (0, _fs.stat)(path, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }

  static skipThisFile(origFilePath, newFilePath) {
    return new Promise(resolve => {
      Newer.statFile(newFilePath).then(newFilePathstat => {
        Newer.statFile(origFilePath).then(origFileStat => {
          if (origFileStat.mtime < newFilePathstat.mtime) {
            resolve(true); // don create / update newFilePath
          } else {
            resolve(false); // origFilePath updeted -> newFilePath update
          }
        }).catch(() => {
          resolve(false); // err -> Upd. newFilePath
        });
      }).catch(() => {
        resolve(false); // not exist file -> Create newFilePath
      });
    });
  }

}

exports.default = Newer;
module.exports = exports.default;