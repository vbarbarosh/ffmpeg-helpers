A set of helpers for building arguments for ffmpeg binary.

```javascript
const probe = JSON.parse(await shell(ffprobe('input.webm')));
await shell(ffmpeg_trim_crop_resize({input: 'input.webm', output: 'a.mkv', probe,
    "trim": [
    {"start": 5, "end": 10},
    {"start": 65, "end": 70},
    {"start": 125, "end": 130}
],
    "crop": {"x": 0, "y": 500, "w": 1920, "h": 600},
    "resize": {"w": 400, "h": 400}
}

}));
```



## References

https://www.youtube.com/watch?v=ZSOdXPoMuu8
