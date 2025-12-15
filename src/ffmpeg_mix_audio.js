const round = require('./node_helpers/round');

function ffmpeg_mix_audio(items)
{
    const filter_complex = [];
    const audio_inputs = [];
    for (const item of items) {
        const n = filter_complex.length + 1;
        const volume = round(item.volume/100, 0.01);
        const delay = round(item.delay_sec*1000);
        const start = round(item.begin_sec, 0.001);
        const end = round(item.end_sec, 0.001);
        const duration = round(end - start, 0.001);
        const fadein = Math.min(duration, round(item.fadein_sec, 0.001));
        const fadeout = Math.min(duration, round(item.fadeout_sec, 0.001));
        const filters = [`volume=${volume}`, `atrim=start=${start}:end=${end}`];
        if (fadein) {
            filters.push(`afade=t=in:start_time=0:duration=${fadein}`);
        }
        if (fadeout) {
            const start_time = round(Math.max(0, duration - fadeout), 0.001);
            filters.push(`afade=t=out:start_time=${start_time}:duration=${fadeout}`);
        }
        if (delay) {
            const adelay = Array(item.channels).fill(delay).join('|');
            filters.push(`adelay=${adelay}`);
        }
        if (items.length === 1) {
            // 1) The output duration must always equal the video duration, regardless of audio.
            // 2) apad extends audio with silence indefinitely
            // 3) -shortest will take the length of video
            filters.push('apad');
            filters.push('asetpts=N/SR/TB');
            filter_complex.push(`[${n}:a]${filters.join(',')}[mixed]`);
        }
        else {
            filter_complex.push(`[${n}:a]${filters.join(',')}[a${n}]`);
            audio_inputs.push(`[a${n}]`);
        }
    }
    if (items.length > 1) {
        filter_complex.push(`${audio_inputs.join('')}amix=inputs=${audio_inputs.length}:normalize=0,apad,asetpts=N/SR/TB[mixed]`);
    }
    return ['-filter_complex', filter_complex.join('; ')];
}

module.exports = ffmpeg_mix_audio;
