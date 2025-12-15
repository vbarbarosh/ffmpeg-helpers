// Taken from https://github.com/vbarbarosh/node-helpers/blob/main/src/shell_json.js

const child_process = require('child_process');

function shell_json(args, options)
{
    return new Promise(function (resolve, reject) {
        child_process.execFile(args[0], args.slice(1), options, function (error, stdout, stderr) {
            if (error) {
                reject(error);
            }
            else if (stderr) {
                reject(new Error(`Process terminated with the following STDERR:\n\n${stderr}`));
            }
            else {
                try {
                    resolve(JSON.parse(stdout));
                }
                catch (error) {
                    reject(error);
                }
            }
        });
    });
}

module.exports = shell_json;
