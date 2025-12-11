function format_ffmpeg_progress(ffmpeg_progress)
{
    if (!ffmpeg_progress) {
        return '~';
    }

    // All time fields in `-progress` are in microseconds, regardless of name.
    // The name out_time_ms is therefore misleading, but preserved for compatibility. 🤯

    const {fps, out_time, out_time_ms, speed, expected_duration_us} = ffmpeg_progress;
    const fps_or_speed = fps ? Math.max(1, Math.round(fps)) + 'fps' : (speed ?? '~');

    if (expected_duration_us && out_time_ms) {
        return `${(out_time_ms/expected_duration_us*100).toFixed(2)}% at ${fps_or_speed}`;
    }

    return `${(out_time||'').replace(/\..+$/, '') || '~'} at ${fps_or_speed}`.replace('~ at ~', '~');
}

module.exports = format_ffmpeg_progress;
