const assert = require('assert');
const has_alpha_channel = require('./has_alpha_channel');

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
    {input: 'var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm', expected: false},
    {input: 'var/dancer1.webm', expected: true},
    {input: 'var/exoplayer.mp4', expected: false},
    {input: 'var/exoplayer.webm', expected: true},
    {input: 'var/movie-hevc.mov', expected: false},
    {input: 'var/movie-webm.webm', expected: true},
    {input: 'var/orb-1.mov', expected: false},
    {input: 'var/orb_VP9.webm', expected: true},
    {input: 'var/soccer1.webm', expected: true},
];

describe('has_alpha_channel', function () {
    cases.forEach(function (case_item) {
        it(case_item.input, async function () {
            const actual = await has_alpha_channel(case_item.input);
            assert.deepStrictEqual(actual, case_item.expected);
        })
    });
});
