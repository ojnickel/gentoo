abbr l "ls -alh"
abbr la "ls -Alh"
abbr lss "ls -hsS"
#abbr ls "ls -alFth --color auto"
#list only dirs
abbr ld "du -hs */"
abbr .. "cd .."
abbr 1 "cd -"
abbr  2 "cd -2"
abbr  3 "cd -3"
abbr  4 "cd -4"
abbr ... "cd ..."
abbr .... "cd ...."
abbr ..... "cd ....."
abbr ports 'netstat -tulanp'
abbr reboot 'sudo /sbin/reboot'
abbr halt 'sudo /sbin/halt'
abbr httpdreload 'sudo /usr/sbin/apachectl -k graceful'
abbr httpdtest 'sudo /usr/sbin/apachectl -t && /usr/sbin/apachectl -t -D DUMP_VHOSTS'

#   # pass options to free ##
abbr meminfo 'free -m -l -t'
 
## get top process eating memory
abbr psmem 'ps auxf | sort -nr -k 4'
abbr psmem10 'ps auxf | sort -nr -k 4 | head -10'
 
## get top process eating cpu ##
abbr pscpu 'ps auxf | sort -nr -k 3'
abbr pscpu10 'ps auxf | sort -nr -k 3 | head -10'

##########
# Docker #
##########

abbr -a dcl "docker container ls -a"
abbr -a dc "docker container"
abbr -a dcr "docker container rm"
abbr -a dcs "docker container stop"
function dstoprm
    docker container stop "$argv[1]" && docker container rm "$argv[1]"
end  
abbr -a dcx  "docker container rm"
# Get latest container ID
abbr -a dl "docker container ps -l -q"

# Get container process
abbr -a dps "docker container ps"

# Get process included stop container
abbr -a dpa "docker container ps -a"
abbr -a dls "docker container ps -a"

# Get images
abbr -a di "docker container images"

# Get container IP
abbr -a dip "docker container inspect --format '{{ .NetworkSettings.IPAddress }}'"

# Run deamonized container, e.g., $dkd base /bin/echo hello
abbr -a dkd "docker container run -d -P"

# Run interactive container, e.g., $dki base /bin/bash
abbr -a dki "docker container run -i -t -P"

# Execute interactive container, e.g., $dex base /bin/bash
abbr -a dex "docker container exec -i -t"

# Stop and Remove all containers
abbr -a drmf 'docker container stop (docker container ps -a -q); docker container rm (docker container ps -a -q)'

# Remove dangling volumes
abbr -a drmv 'docker volume rm (docker volume ls -qf "dangling=true")'

# Remove dangling images
abbr -a drmd 'docker container rmi (docker container images -q)'

# Remove exited containers:
abbr -a drxc 'docker container ps --filter status=dead --filter status=exited -aq | xargs docker container rm -v'

# Remove unused images:
abbr -a drui 'docker container images --no-trunc | grep \'<none>\' | awk \'{ print $3 }\' | xargs docker container rmi'

# Remove all things docker
abbr -a dprune 'docker container system prune -a'

function dstop -d "Stop all containers"
  color_print $COLOR_B "Docker: Stop all containers\n"
  if read_confirm
    set ARG (docker container ps -a -q)
    if test -n "$ARG"
      docker container stop $ARG
    else
      color_print $COLOR_Y "Docker: Nothing to execute."
    end
  end
end

function drm -d "Remove all containers"
  color_print $COLOR_B "Docker: Remove all containers\n"
  if read_confirm
    set ARG (docker container ps -a -q)
    if test -n "$ARG"
      docker container rm $ARG
    else
      color_print $COLOR_Y "Docker: Nothing to execute."
    end
  end
end

function dri -d "Remove all images"
  color_print $COLOR_B "Docker: Remove all images\n"
  if read_confirm
    set ARG (docker container images -q)
    if test -n "$ARG"
      docker container rmi $ARG
    else
      color_print $COLOR_Y "Docker: Nothing to execute."
    end
  end
end

function dbu -d "Dockerfile build, e.g., $dbu tcnksm/test"
  color_print $COLOR_B "Docker: Dockerfile build\n"
  docker build -t=$argv[1] .
end

function dalias -d "Show all abbreviations related to docker"
  color_print $COLOR_B "Docker: Show all abbreviations related to docker.\n"
  abbr | grep 'docker container' | sed "s/^\([^=]*\)=\(.*\)/\1 => \2/"| sed "s/['|\']//g" | sort
end

function dbash -d "Bash into running container"
  color_print $COLOR_B "Docker: Bash into running container.\n"
  docker container exec -it (docker container ps -aqf "name=$argv[1]") bash

end
function dcrnamepub -d "Run a container with given name and port"
    name="$argv[1]"
    pub="$argv[2]"
    img="$argv[3]"
end
