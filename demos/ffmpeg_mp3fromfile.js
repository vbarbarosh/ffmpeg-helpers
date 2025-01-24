const cli = require('@vbarbarosh/node-helpers/src/cli');
const ffmpeg_mp3fromfile = require('../src/ffmpeg_mp3fromfile');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const shell_ffmpeg_progress = require('../src/shell_ffmpeg_progress');

cli(main);

async function main()
{
    const input = fs_path_resolve(__dirname, '../var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm');
    await shell_ffmpeg_progress(ffmpeg_mp3fromfile({input, output: 'a.mp3'}).concat('-y'), {
        user_friendly_status: s => console.log(s),
    });
    console.log('🎉 Done');
}
