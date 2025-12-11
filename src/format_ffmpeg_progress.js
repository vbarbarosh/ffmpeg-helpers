function format_ffmpeg_progress(ffmpeg_progress)
{
    if (!ffmpeg_progress) {
        return '~';
    }

    const {fps, out_time, out_time_ms, speed, expected_duration_ms} = ffmpeg_progress;
    const fps_or_speed = fps ? Math.max(1, Math.round(fps)) + 'fps' : (speed ?? '~');

    if (expected_duration_ms) {
        return `${(out_time_ms/expected_duration_ms*100).toFixed(2)}% ${fps_or_speed}`;
    }

    return `${(out_time||'').replace(/\..+$/, '') || '~'} ${fps_or_speed}`.replace(/~\s*~/g, '~');
}

module.exports = format_ffmpeg_progress;
