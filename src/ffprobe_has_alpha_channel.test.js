const assert = require('assert');
const ffprobe_has_alpha_channel = require('./ffprobe_has_alpha_channel');
const fs_read_json = require('@vbarbarosh/node-helpers/src/fs_read_json');

// https://stackblitz.com/edit/stackblitz-starters-bp4oyc
//
// const urls = [
//     {
//         url: 'https://rotato.netlify.app/alpha-demo/movie-hevc.mov',
//         desc: 'hevc phone',
//     },
//     {
//         url: 'https://rotato.netlify.app/alpha-demo/movie-webm.webm',
//         desc: 'webm phone',
//     },
//     {
//         url: 'https://simpl.info/videoalpha/video/soccer1.webm',
//         desc: 'webm soccer',
//     },
//     {
//         url: 'https://simpl.info/videoalpha/video/dancer1.webm',
//         desc: 'webm dancer',
//     },
//     {
//         url: 'https://github.com/google/ExoPlayer/assets/2509966/42ed1c10-e052-499b-b35f-ba5d453c2d6c',
//         desc: 'exoplayer webm',
//         source:
//             'https://github.com/google/ExoPlayer/issues/7789#issuecomment-1838472065',
//     },
//     {
//         url: 'https://github.com/google/ExoPlayer/assets/2509966/21e07d80-ca1b-4dc9-8ea4-5b62612f21f0',
//         desc: 'exoplayer mp4',
//         source:
//             'https://github.com/google/ExoPlayer/issues/7789#issuecomment-1838472065',
//     },
//
//     {
//         url: 'https://storage.yandexcloud.net/delete-this-test/orb_VP9.webm',
//         desc: 'orb vp9 webm',
//         source:
//             'https://discourse.webflow.com/t/how-to-have-a-transparent-video-in-webflow/99919/19',
//     },
//     {
//         url: 'https://storage.yandexcloud.net/delete-this-test/orb-1.mov',
//         desc: 'orb mov',
//         source:
//             'https://discourse.webflow.com/t/how-to-have-a-transparent-video-in-webflow/99919/19',
//     },
// ];

const cases = [
    {input: 'src/ffprobe.d/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm.json', expected: false},
    {input: 'src/ffprobe.d/dancer1.webm.json', expected: true},
    {input: 'src/ffprobe.d/exoplayer.mp4.json', expected: false},
    {input: 'src/ffprobe.d/exoplayer.webm.json', expected: true},
    {input: 'src/ffprobe.d/flower.webm.json', expected: false},
    {input: 'src/ffprobe.d/movie-hevc.mov.json', expected: false},
    {input: 'src/ffprobe.d/movie-webm.webm.json', expected: true},
    {input: 'src/ffprobe.d/orb-1.mov.json', expected: false},
    {input: 'src/ffprobe.d/orb_VP9.webm.json', expected: true},
    {input: 'src/ffprobe.d/soccer1.webm.json', expected: true},
];

describe('ffprobe_has_alpha_channel', function () {
    cases.forEach(function (case_item) {
        it(case_item.input, async function () {
            const actual = ffprobe_has_alpha_channel(await fs_read_json(case_item.input));
            assert.deepStrictEqual(actual, case_item.expected);
        })
    });
});
