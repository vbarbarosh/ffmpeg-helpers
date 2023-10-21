
### ffprobe

```
ffprobe input.webm -v quiet -print_format json -show_format
```

### ffmpeg-trim

```
#!/bin/bash

# http://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin
# http://redsymbol.net/articles/unofficial-bash-strict-mode
set -o nounset -o errexit -o pipefail

script=`realpath $0`
scriptdir=`dirname $script`
scriptname=`basename $script`

# ffmpeg -ss 05.00 -i input.webm -t 05.00 a.mp4 -y

# https://superuser.com/a/1498811/78171
ffmpeg -i input.webm -y -filter_complex '
[0:v]trim=start=05.0:end=10.0,setpts=PTS-STARTPTS[0v];
[0:a]atrim=start=05.0:end=10.0,asetpts=PTS-STARTPTS[0a];
[0:v]trim=start=65.0:end=70.0,setpts=PTS-STARTPTS[1v];
[0:a]atrim=start=65.0:end=70.0,asetpts=PTS-STARTPTS[1a];
[0:v]trim=start=125.0:end=130.0,setpts=PTS-STARTPTS[2v];
[0:a]atrim=start=125.0:end=130.0,asetpts=PTS-STARTPTS[2a];
[0v][0a][1v][1a][2v][2a]concat=n=3:v=1:a=1[outv][outa]' \
-map [outv] -map [outa] a.mkv
```

### ffmpeg-trim-crop

```
#!/bin/bash

# http://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin
# http://redsymbol.net/articles/unofficial-bash-strict-mode
set -o nounset -o errexit -o pipefail

script=`realpath $0`
scriptdir=`dirname $script`
scriptname=`basename $script`

# https://superuser.com/a/1498811/78171
# https://superuser.com/a/1239577
ffmpeg -i input.webm -y -filter_complex '
[0:v]trim=start=05.0:end=10.0,setpts=PTS-STARTPTS[0v];
[0:a]atrim=start=05.0:end=10.0,asetpts=PTS-STARTPTS[0a];
[0:v]trim=start=65.0:end=70.0,setpts=PTS-STARTPTS[1v];
[0:a]atrim=start=65.0:end=70.0,asetpts=PTS-STARTPTS[1a];
[0:v]trim=start=125.0:end=130.0,setpts=PTS-STARTPTS[2v];
[0:a]atrim=start=125.0:end=130.0,asetpts=PTS-STARTPTS[2a];
[0v][0a][1v][1a][2v][2a]concat=n=3:v=1:a=1[outv][outa];
[outv]crop=w=1920:h=600:x=0:y=500[outv2]' \
-map [outv2] -map [outa] a.mkv -y
```

### ffmpeg-trim-crop-scale

```
#!/bin/bash

# http://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin
# http://redsymbol.net/articles/unofficial-bash-strict-mode
set -o nounset -o errexit -o pipefail

script=`realpath $0`
scriptdir=`dirname $script`
scriptname=`basename $script`

# https://superuser.com/a/1498811/78171
# https://superuser.com/a/1239577
ffmpeg -i input.webm -y -filter_complex '
[0:v]trim=start=05.0:end=10.0,setpts=PTS-STARTPTS[0v];
[0:a]atrim=start=05.0:end=10.0,asetpts=PTS-STARTPTS[0a];
[0:v]trim=start=65.0:end=70.0,setpts=PTS-STARTPTS[1v];
[0:a]atrim=start=65.0:end=70.0,asetpts=PTS-STARTPTS[1a];
[0:v]trim=start=125.0:end=130.0,setpts=PTS-STARTPTS[2v];
[0:a]atrim=start=125.0:end=130.0,asetpts=PTS-STARTPTS[2a];
[0v][0a][1v][1a][2v][2a]concat=n=3:v=1:a=1[outv][outa];
[outv]crop=w=1920:h=600:x=0:y=500,scale=400:400,setsar=1[outv2]' \
-map [outv2] -map [outa] a.mkv -y
```
