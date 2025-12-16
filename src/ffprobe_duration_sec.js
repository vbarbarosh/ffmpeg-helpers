function ffprobe_duration_sec(ffprobe)
{
    // 1) Prefer container duration (most reliable)
    if (ffprobe?.format?.duration != null) {
        const v = Number(ffprobe.format.duration);
        if (Number.isFinite(v) && v >= 0) {
            return v;
        }
    }

    // 2) Fallback: max stream duration
    let out = null;
    if (Array.isArray(ffprobe?.streams)) {
        for (const s of ffprobe.streams) {
            if (s?.duration == null) {
                continue;
            }
            const v = Number(s.duration);
            if (!Number.isFinite(v) || v < 0) {
                continue;
            }
            out = out == null ? v : Math.max(out, v);
        }
    }
    return out;
}

module.exports = ffprobe_duration_sec;
