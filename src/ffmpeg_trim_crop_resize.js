function ffmpeg_trim_crop_resize({probe, input, output, trim, crop, resize, mute})
{
    const out = ['ffmpeg', '-nostdin', '-i', input];
    const norm = __norm(probe, trim, crop, resize, mute);

    const expr = (norm.has_video ? 'v' : '-')
        + (norm.has_audio ? 'a' : '-')
        + (norm.trim.length ? 't' : '-')
        + (norm.crop ? 'c' : '-')
        + (norm.resize ? 'r' : '-');

    switch (expr) {
    case 'v-t--':
    case 'v-tc-':
    case 'v-t-r':
    case 'v-tcr':
        out.push('-filter_complex', __filter_complex(norm).join(';\n'), '-map', '[outv]');
        break;
    case '-at--':
    case '-atc-':
    case '-at-r':
    case '-atcr':
        if (norm.mute) {
            out.push('-an');
        }
        else {
            out.push('-filter_complex', __filter_complex(norm).join(';\n'), '-map', '[outa]');
        }
        break;
    case 'vat--':
    case 'vatc-':
    case 'vat-r':
    case 'vatcr':
        if (norm.mute) {
            out.push('-filter_complex', __filter_complex(norm).join(';\n'), '-map', '[outv]');
        }
        else {
            out.push('-filter_complex', __filter_complex(norm).join(';\n'), '-map', '[outv]', '-map', '[outa]');
        }
        break;
    case 'v--c-': out.push('-vf', `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`); break;
    case 'v---r': out.push('-vf', `scale=${resize.w}:${resize.h},setsar=1`); break;
    case 'v--cr': out.push('-vf', `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y},scale=${resize.w}:${resize.h},setsar=1`); break;
    case 'va---':
        if (norm.mute) {
            out.push('-an');
        }
        break;
    case 'va-c-':
        if (norm.mute) {
            out.push('-vf', `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`, '-an');
        }
        else {
            out.push('-vf', `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`, '-c:a', 'copy');
        }
        break;
    case 'va--r':
        if (norm.mute) {
            out.push('-vf', `scale=${resize.w}:${resize.h},setsar=1`, '-an');
        }
        else {
            out.push('-vf', `scale=${resize.w}:${resize.h},setsar=1`, '-c:a', 'copy');
        }
        break;
    case 'va-cr':
        if (norm.mute) {
            out.push('-vf', `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y},scale=${resize.w}:${resize.h},setsar=1`, '-an');
        }
        else {
            out.push('-vf', `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y},scale=${resize.w}:${resize.h},setsar=1`, '-c:a', 'copy');
        }
        break;
    case '-a---':
    case '-a-c-':
    case '-a--r':
    case '-a-cr':
        if (norm.mute) {
            out.push('-an');
        }
        break;
    case 'v----':
        break;
    default:
        throw new Error(`Invalid input: [${expr}]`);
    }

    out.push(output);
    return out;
}

function __norm(probe, trim, crop, resize, mute)
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
        mute: !!mute,
    };
}

function __filter_complex({trim, crop, resize, has_audio, has_video, mute})
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
        if ((has_audio && !mute) && has_video) {
            streams.push(`[${i}v]`, `[${i}a]`);
            return [
                `[0:v]trim=start=${item.start}:end=${item.end},setpts=PTS-STARTPTS[${i}v]`,
                `[0:a]atrim=start=${item.start}:end=${item.end},asetpts=PTS-STARTPTS[${i}a]`,
            ];
        }
        if ((has_audio && !mute)) {
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
        if ((has_audio && !mute) && has_video) {
            out.push(`${streams.join('')}concat=n=${trim.length}:v=1:a=1[tmpv][outa]`);
        }
        else if ((has_audio && !mute) && !has_video) {
            out.push(`${streams.join('')}concat=n=${trim.length}:v=0:a=1[outa]`);
        }
        else if ((!has_audio || mute) && has_video) {
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
        if ((has_audio && !mute) && has_video) {
            out.push(`${streams.join('')}concat=n=${trim.length}:v=1:a=1[outv][outa]`);
        }
        else if ((!has_audio || mute) && has_video) {
            out.push(`${streams.join('')}concat=n=${trim.length}:v=1[outv]`);
        }
        else if ((has_audio && !mute) && !has_video) {
            out.push(`${streams.join('')}concat=n=${trim.length}:v=0:a=1[outa]`);
        }
    }
    return out;
}

module.exports = ffmpeg_trim_crop_resize;
