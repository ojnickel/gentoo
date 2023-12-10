# .using xrandr set HDMI properly -> under/overscan
#sh ~/initxrandr.sh
#  turn laptop monitor off
#xrandr --output LVDS --off --output HDMI-0 --auto
#xrandr  --addmode DP-1 "1920x1080_60.00"

#set keyboard slow
#xset r rate 1100 1
xset r rate 1000 10
    
#if [ -d /etc/X11/xinit/xinitrc.d ] ; then
 #for f in /etc/X11/xinit/xinitrc.d/?* ; do
  #[ -x "$f" ] && . "$f"
 #done
 #unset f
#fi

xrdb -merge ~/.Xresources
#set resolution
xrandr --output DP-1 --mode 1920x1080 --rate 60.00

eval $(dbus-launch --sh-syntax --exit-with-session <window_manager>)

exec i3

