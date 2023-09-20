A set of helpers for working with `ffmpeg` binary.

* `ffprobe({input})`
* `ffmpeg_trim_crop_resize({input, output, trim, crop, resize})`
* `shell_ffmpeg_progress(args, {progress_fn})`

### demos/ffprobe.js

```javascript
const input = fs_path_resolve(__dirname, '../var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm');
const probe = await shell_json(ffprobe({input}));
console.log(probe);
```

```json
{
    "streams": [
        {
            "index": 0,
            "codec_name": "vp9",
            "codec_long_name": "Google VP9",
            "profile": "Profile 0",
            "codec_type": "video",
            "codec_tag_string": "[0][0][0][0]",
            "codec_tag": "0x0000",
            "width": 1920,
            "height": 1080,
            "coded_width": 1920,
            "coded_height": 1080,
            "closed_captions": 0,
            "has_b_frames": 0,
            "sample_aspect_ratio": "1:1",
            "display_aspect_ratio": "16:9",
            "pix_fmt": "yuv420p",
            "level": -99,
            "color_range": "tv",
            "color_space": "bt709",
            "color_transfer": "bt709",
            "color_primaries": "bt709",
            "refs": 1,
            "r_frame_rate": "50/1",
            "avg_frame_rate": "50/1",
            "time_base": "1/1000",
            "start_pts": 0,
            "start_time": "0.000000",
            "disposition": {
                "default": 1,
                "dub": 0,
                "original": 0,
                "comment": 0,
                "lyrics": 0,
                "karaoke": 0,
                "forced": 0,
                "hearing_impaired": 0,
                "visual_impaired": 0,
                "clean_effects": 0,
                "attached_pic": 0,
                "timed_thumbnails": 0
            },
            "tags": {
                "language": "eng",
                "DURATION": "01:00:20.000000000"
            }
        },
        {
            "index": 1,
            "codec_name": "opus",
            "codec_long_name": "Opus (Opus Interactive Audio Codec)",
            "codec_type": "audio",
            "codec_tag_string": "[0][0][0][0]",
            "codec_tag": "0x0000",
            "sample_fmt": "fltp",
            "sample_rate": "48000",
            "channels": 2,
            "channel_layout": "stereo",
            "bits_per_sample": 0,
            "r_frame_rate": "0/0",
            "avg_frame_rate": "0/0",
            "time_base": "1/1000",
            "start_pts": -7,
            "start_time": "-0.007000",
            "disposition": {
                "default": 1,
                "dub": 0,
                "original": 0,
                "comment": 0,
                "lyrics": 0,
                "karaoke": 0,
                "forced": 0,
                "hearing_impaired": 0,
                "visual_impaired": 0,
                "clean_effects": 0,
                "attached_pic": 0,
                "timed_thumbnails": 0
            },
            "tags": {
                "language": "eng",
                "DURATION": "01:00:20.021000000"
            }
        }
    ],
    "format": {
        "filename": "/ffmpeg-helpers/var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm",
        "nb_streams": 2,
        "nb_programs": 0,
        "format_name": "matroska,webm",
        "format_long_name": "Matroska / WebM",
        "start_time": "-0.007000",
        "duration": "3620.021000",
        "size": "270373143",
        "bit_rate": "597506",
        "probe_score": 100,
        "tags": {
            "ENCODER": "Lavf58.76.100"
        }
    }
}
```

### demos/ffmpeg_trim.js

```javascript
const input = fs_path_resolve(__dirname, '../var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm');
const probe = await shell_json(ffprobe({input}));
await shell(ffmpeg_trim_crop_resize({probe, input, output: 'a.mp4', trim: [
    {start: 5, end: 10},
    {start: 65, end: 70},
    {start: 125, end: 130}
]}));
console.log('done');
```

### demos/shell_ffmpeg_progress.js

```javascript
const input = fs_path_resolve(__dirname, '../var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm');
const probe = await shell_json(ffprobe({input}));
const trim = [{start: 5, end: 10}, {start: 65, end: 70}, {start: 125, end: 130}];
const expected_duration_us = trim.length ? 1000000*trim.reduce((a,v) => a + v.end - v.start, 0) : 1000000*probe.format.duration;
await shell_ffmpeg_progress(ffmpeg_trim_crop_resize({probe, input, output: 'a.mp4', trim}).concat('-y'), {
    progress_fn: function (v) {
        console.log(`${v.out_time_us} of ${expected_duration_us} ${(v.out_time_us/expected_duration_us*100).toFixed(2)}% ${v.fps}fps`);
    },
});
console.log('done');
```

```text
213333 of 15000000 1.42% 0.00fps
2048000 of 15000000 13.65% 0.00fps
3562667 of 15000000 23.75% 146.90fps
4928000 of 15000000 32.85% 151.93fps
4928000 of 15000000 32.85% 116.52fps
4928000 of 15000000 32.85% 94.49fps
4928000 of 15000000 32.85% 79.45fps
6528000 of 15000000 43.52% 86.59fps
8064000 of 15000000 53.76% 94.95fps
9642667 of 15000000 64.28% 101.43fps
9920000 of 15000000 66.13% 97.02fps
9920000 of 15000000 66.13% 88.44fps
9920000 of 15000000 66.13% 81.24fps
10901333 of 15000000 72.68% 80.28fps
12480000 of 15000000 83.20% 85.78fps
14101333 of 15000000 94.01% 90.56fps
14997333 of 15000000 99.98% 91.67fps
done
```

## References

https://www.youtube.com/watch?v=ZSOdXPoMuu8
