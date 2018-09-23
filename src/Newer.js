import { stat } from "fs";

export default class Newer {
  static statFile(path) {
    return new Promise((resolve, reject) => {
      stat(path, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  static skipThisFile(origFilePath, newFilePath) {
    return new Promise(resolve => {
      Newer.statFile(newFilePath)
        .then(newFilePathstat => {
          Newer.statFile(origFilePath)
            .then(origFileStat => {
              if (origFileStat.mtime < newFilePathstat.mtime) {
                resolve(true); // don create / update newFilePath
              } else {
                resolve(false); // origFilePath updeted -> newFilePath update
              }
            })
            .catch(() => {
              resolve(false); // err -> Upd. newFilePath
            });
        })
        .catch(() => {
          resolve(false); // not exist file -> Create newFilePath
        });
    });
  }
}
