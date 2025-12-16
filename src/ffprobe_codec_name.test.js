const assert = require('assert');
const ffprobe_codec_name = require('./ffprobe_codec_name');
const fs_read_json = require('@vbarbarosh/node-helpers/src/fs_read_json');

const cases = [
    {input: 'src/ffprobe.d/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm.json', expected: 'av1'},
    {input: 'src/ffprobe.d/dancer1.webm.json', expected: 'vp8'},
    {input: 'src/ffprobe.d/exoplayer.mp4.json', expected: 'hevc'},
    {input: 'src/ffprobe.d/exoplayer.webm.json', expected: 'vp9'},
    {input: 'src/ffprobe.d/movie-hevc.mov.json', expected: 'hevc'},
    {input: 'src/ffprobe.d/movie-webm.webm.json', expected: 'vp9'},
    {input: 'src/ffprobe.d/orb-1.mov.json', expected: 'hevc'},
    {input: 'src/ffprobe.d/orb_VP9.webm.json', expected: 'vp9'},
    {input: 'src/ffprobe.d/soccer1.webm.json', expected: 'vp8'},
];

describe('ffprobe_codec_name', function () {
    cases.forEach(function (case_item) {
        it(case_item.input, async function () {
            const actual = ffprobe_codec_name(await fs_read_json(case_item.input));
            assert.deepStrictEqual(actual, case_item.expected);
        })
    });
});
