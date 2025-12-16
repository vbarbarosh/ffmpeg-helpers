const cli = require('@vbarbarosh/node-helpers/src/cli');
const ffprobe = require('../src/ffprobe');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const shell_json = require('@vbarbarosh/node-helpers/src/shell_json');

cli(main);

async function main()
{
    const input = fs_path_resolve(__dirname, '../var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm');
    const probe = await shell_json(ffprobe(input));
    console.log(probe);
    console.log('🎉 Done');
}
