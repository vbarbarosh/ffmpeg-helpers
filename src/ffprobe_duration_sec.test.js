const assert = require('assert');
const ffprobe_duration_sec = require('./ffprobe_duration_sec');
const fs_read_json = require('@vbarbarosh/node-helpers/src/fs_read_json');

const cases = [
    {input: 'src/ffprobe.d/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm.json', expected: 3620.028},
    {input: 'src/ffprobe.d/dancer1.webm.json', expected: 62.833},
    {input: 'src/ffprobe.d/exoplayer.mp4.json', expected: 2},
    {input: 'src/ffprobe.d/exoplayer.webm.json', expected: 2},
    {input: 'src/ffprobe.d/flower.webm.json', expected: 5.059},
    {input: 'src/ffprobe.d/movie-hevc.mov.json', expected: 9.016667},
    {input: 'src/ffprobe.d/movie-webm.webm.json', expected: 9.017},
    {input: 'src/ffprobe.d/orb-1.mov.json', expected: 33.3333},
    {input: 'src/ffprobe.d/orb_VP9.webm.json', expected: 33.334},
    {input: 'src/ffprobe.d/soccer1.webm.json', expected: 80.2},
];

describe('ffprobe_duration_sec', function () {
    cases.forEach(function (case_item) {
        it(case_item.input, async function () {
            const actual = ffprobe_duration_sec(await fs_read_json(case_item.input));
            assert.deepStrictEqual(actual, case_item.expected);
        })
    });
});
