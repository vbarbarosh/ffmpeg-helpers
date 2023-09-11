function ffmpeg_trim_crop_resize({probe, input, output, trim, crop, resize})
{
    const out = ['ffmpeg', '-nostdin', '-i', input];
    const norm = __norm(probe, trim, crop, resize);
    const tmp = __filter_complex(norm.trim, norm.crop, norm.resize, norm.has_audio, norm.has_video);
    if (tmp.length) {
        out.push('-filter_complex', tmp.join(';\n'));
        if (norm.has_video) {
            out.push('-map', '[outv]');
        }
        if (norm.has_audio) {
            out.push('-map', '[outa]');
        }
    }
    out.push(output);
    return out;
}

function __norm(probe, trim, crop, resize)
{
    const duration = probe.format.duration;
    const video_stream = probe.streams.find(v => v.codec_type === 'video');
    const audio_stream = probe.streams.find(v => v.codec_type === 'audio');
    const w = video_stream ? video_stream.width : 0;
    const h = video_stream ? video_stream.height : 0;
    return {
        has_audio: !!audio_stream,
        has_video: !!video_stream,
        trim: (trim||[]).map(function (v) {
            return {
                start: Math.min(duration, Math.max(0, v.start)),
                end: Math.min(duration, Math.max(0, v.end)),
            };
        }).filter(v => v.start < v.end),
        crop: !crop ? null : {
            x: Math.min(w, Math.max(0, crop.x)),
            y: Math.min(h, Math.max(0, crop.y)),
            w: Math.min(w, Math.max(0, crop.w)),
            h: Math.min(h, Math.max(0, crop.h)),
        },
        resize: !resize ? null : {
            w: Math.min(w, Math.max(0, resize.w)),
            h: Math.min(h, Math.max(0, resize.h)),
        },
    };
}

function __filter_complex(trim, crop, resize, has_audio, has_video)
{
    if (!trim.length && has_video) {
        const out = [];
        if (crop && resize) {
            out.push(`[0:v]crop=${crop.w}:${crop.h}:${crop.x}:${crop.y},scale=${resize.w}:${resize.h},setsar=1[outv]`);
        }
        else if (crop) {
            out.push(`[0:v]crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}[outv]`);
        }
        else if (resize) {
            out.push(`[0:v]scale=${resize.w}:${resize.h},setsar=1[outv]`);
        }
        return out;
    }

    if (!trim.length) {
        return [];
    }

    const streams = [];
    const out = trim.flatMap(function (item, i) {
        if (has_audio && has_video) {
            streams.push(`[${i}v]`, `[${i}a]`);
            return [
                `[0:v]trim=start=${item.start}:end=${item.end},setpts=PTS-STARTPTS[${i}v]`,
                `[0:a]atrim=start=${item.start}:end=${item.end},asetpts=PTS-STARTPTS[${i}a]`,
            ];
        }
        if (has_audio) {
            streams.push(`[${i}a]`);
            return [
                `[0:a]atrim=start=${item.start}:end=${item.end},asetpts=PTS-STARTPTS[${i}a]`,
            ];
        }
        if (has_video) {
            streams.push(`[${i}v]`);
            return [
                `[0:v]trim=start=${item.start}:end=${item.end},setpts=PTS-STARTPTS[${i}v]`,
            ];
        }
    });
    if (crop || resize) {
        if (has_audio && has_video) {
            out.push(`${streams.join('')}concat=n=${trim.length}:v=1:a=1[tmpv][outa]`);
        }
        else if (has_audio && !has_video) {
            out.push(`${streams.join('')}concat=n=${trim.length}:a=1[outa]`);
        }
        else if (!has_audio && has_video) {
            out.push(`${streams.join('')}concat=n=${trim.length}:v=1[tmpv]`);
        }
        if (has_video) {
            if (crop && resize) {
                out.push(`[tmpv]crop=${crop.w}:${crop.h}:${crop.x}:${crop.y},scale=${resize.w}:${resize.h},setsar=1[outv]`);
            }
            else if (crop) {
                out.push(`[tmpv]crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}[outv]`);
            }
            else {
                out.push(`[tmpv]scale=${resize.w}:${resize.h},setsar=1[outv]`);
            }
        }
    }
    else {
        if (has_audio && has_video) {
            out.push(`${streams.join('')}concat=n=${trim.length}:v=1:a=1[outv][outa]`);
        }
        else if (!has_audio && has_video) {
            out.push(`${streams.join('')}concat=n=${trim.length}:v=1[outv]`);
        }
        else if (has_audio && !has_video) {
            out.push(`${streams.join('')}concat=n=${trim.length}:a=1[outa]`);
        }
    }
    return out;
}

module.exports = ffmpeg_trim_crop_resize;
