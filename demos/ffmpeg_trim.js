const cli = require('@vbarbarosh/node-helpers/src/cli');
const ffmpeg_trim_crop_resize = require('../src/ffmpeg_trim_crop_resize');
const ffprobe = require('../src/ffprobe');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const shell = require('@vbarbarosh/node-helpers/src/shell');
const shell_json = require('@vbarbarosh/node-helpers/src/shell_json');

cli(main);

async function main()
{
    // ffmpeg -i ../input.mkv -c copy -an video.mkv
    // ffmpeg -i ../input.mkv -c copy -vn audio.mkv
    const input = fs_path_resolve(__dirname, '../var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm');
    const probe = await shell_json(ffprobe({input}));
    await shell(ffmpeg_trim_crop_resize({probe, input, output: 'a.mp4', trim: [{start: 5, end: 10}, {start: 65, end: 70}, {start: 125, end: 130}]}));
    console.log('done');
}
