const assert = require('assert');
const ffmpeg_mix_audio = require('./ffmpeg_mix_audio');

const cases = [
    {
        label: 'single track',
        items: [
            {volume: 100, delay_sec: 0, begin_sec: 0, end_sec: 10, fadein_sec: 0, fadeout_sec: 0, channels: 2},
        ],
        expected: [
            '-filter_complex',
            '[1:a]volume=1,atrim=start=0:end=10,apad,asetpts=N/SR/TB[mixed]',
        ],
    },
    {
        label: 'single track with delay',
        items: [{volume: 100, delay_sec: 2, begin_sec: 5, end_sec: 12, fadein_sec: 0, fadeout_sec: 0, channels: 2}],
        expected: [
            '-filter_complex',
            '[1:a]volume=1,atrim=start=5:end=12,adelay=2000|2000,apad,asetpts=N/SR/TB[mixed]',
        ],
    },
    {
        label: 'single track, starts at 5sec, ends at 12sec, plays at 0sec',
        items: [
            {volume: 100, delay_sec: 0, begin_sec: 5, end_sec: 12, fadein_sec: 0, fadeout_sec: 0, channels: 2},
        ],
        expected: [
            '-filter_complex',
            '[1:a]volume=1,atrim=start=5:end=12,apad,asetpts=N/SR/TB[mixed]',
        ],
    },
    {
        label: 'single track with fade-in',
        items: [
            {volume: 100, delay_sec: 0, begin_sec: 5, end_sec: 12, fadein_sec: 1, fadeout_sec: 0, channels: 2},
        ],
        expected: [
            '-filter_complex',
            '[1:a]volume=1,atrim=start=5:end=12,afade=t=in:start_time=0:duration=1,apad,asetpts=N/SR/TB[mixed]',
        ],
    },
    {
        label: 'single track with fade-out',
        items: [
            {volume: 100, delay_sec: 0, begin_sec: 5, end_sec: 12, fadein_sec: 0, fadeout_sec: 1, channels: 2},
        ],
        expected: [
            '-filter_complex',
            '[1:a]volume=1,atrim=start=5:end=12,afade=t=out:start_time=6:duration=1,apad,asetpts=N/SR/TB[mixed]',
        ],
    },
    {
        label: 'single track with fade-in and fade-out',
        items: [{volume: 100, delay_sec: 0, begin_sec: 5, end_sec: 15, fadein_sec: 1, fadeout_sec: 2, channels: 2}],
        expected: [
            '-filter_complex',
            '[1:a]volume=1,atrim=start=5:end=15,afade=t=in:start_time=0:duration=1,afade=t=out:start_time=8:duration=2,apad,asetpts=N/SR/TB[mixed]',
        ],
    },
    {
        label: 'two tracks mixed, no delay',
        items: [
            {volume: 100, delay_sec: 0, begin_sec: 0, end_sec: 5, fadein_sec: 0, fadeout_sec: 0, channels: 2},
            {volume: 50, delay_sec: 0, begin_sec: 2, end_sec: 7, fadein_sec: 0, fadeout_sec: 0, channels: 2},
        ],
        expected: [
            '-filter_complex',
            '[1:a]volume=1,atrim=start=0:end=5[a1]; '
                + '[2:a]volume=0.5,atrim=start=2:end=7[a2]; '
                + '[a1][a2]amix=inputs=2:normalize=0,apad,asetpts=N/SR/TB[mixed]',
        ],
    },
    {
        label: 'two tracks, second delayed',
        items: [
            {volume: 100, delay_sec: 0, begin_sec: 0, end_sec: 5, fadein_sec: 0, fadeout_sec: 0, channels: 2},
            {volume: 100, delay_sec: 1.5, begin_sec: 0, end_sec: 5, fadein_sec: 0, fadeout_sec: 0, channels: 2},
        ],
        expected: [
            '-filter_complex',
            '[1:a]volume=1,atrim=start=0:end=5[a1]; '
                + '[2:a]volume=1,atrim=start=0:end=5,adelay=1500|1500[a2]; '
                + '[a1][a2]amix=inputs=2:normalize=0,apad,asetpts=N/SR/TB[mixed]',
        ],
    },
    {
        label: 'three tracks mixed',
        items: [
            {volume: 100, delay_sec: 0, begin_sec: 0, end_sec: 5, fadein_sec: 0, fadeout_sec: 0, channels: 2},
            {volume: 80,  delay_sec: 1, begin_sec: 0, end_sec: 5, fadein_sec: 0, fadeout_sec: 0, channels: 2},
            {volume: 60,  delay_sec: 0, begin_sec: 2, end_sec: 6, fadein_sec: 0, fadeout_sec: 0, channels: 2},
        ],
        expected: [
            '-filter_complex',
            '[1:a]volume=1,atrim=start=0:end=5[a1]; '
                + '[2:a]volume=0.8,atrim=start=0:end=5,adelay=1000|1000[a2]; '
                + '[3:a]volume=0.6,atrim=start=2:end=6[a3]; '
                + '[a1][a2][a3]amix=inputs=3:normalize=0,apad,asetpts=N/SR/TB[mixed]',
        ],
    },
    {
        label: 'edge case: fade-out longer than duration is clamped',
        items: [
            {volume: 100, delay_sec: 0, begin_sec: 5,
                end_sec: 6, // duration = 1
                fadein_sec: 0,
                fadeout_sec: 5, // longer than duration
                channels: 2,
            },
        ],
        expected: [
            '-filter_complex',
            '[1:a]volume=1,atrim=start=5:end=6,afade=t=out:start_time=0:duration=1,apad,asetpts=N/SR/TB[mixed]',
        ],
    },
];

describe('ffmpeg_mix_audio', async function () {
    cases.forEach(function (case_item) {
        it(case_item.label, function () {
            assert.deepStrictEqual(ffmpeg_mix_audio(case_item.items), case_item.expected);
        });
    });
});
