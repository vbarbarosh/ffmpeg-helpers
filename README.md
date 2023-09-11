A set of helpers for building arguments for ffmpeg binary.

```javascript
// demos/ffprobe.js
const input = fs_path_resolve(__dirname, '../var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm');
const probe = await shell_json(ffprobe({input}));
console.log(probe);
```

```javascript
// demos/ffmpeg_trim.js
const input = fs_path_resolve(__dirname, '../var/BCG 1 Hour Countdown (LED Frame Counter 180,000 Frames - 50 FPS) Remix BBC Arabic Countdown [ZSOdXPoMuu8].webm');
const probe = await shell_json(ffprobe({input}));
await shell(ffmpeg_trim_crop_resize({probe, input, output: 'a.mkv', trim: [
    {start: 5, end: 10},
    {start: 65, end: 70},
    {start: 125, end: 130}
]}));
console.log('done');
```

## References

https://www.youtube.com/watch?v=ZSOdXPoMuu8
