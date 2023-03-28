#! /bin/sh
# .using xrandr set HDMI properly -> under/overscan
sh ~/initxrandr.sh
#  turn laptop monitor off
xrandr --output LVDS --off --output HDMI-0 --auto
#set keyboard slow
xset r rate 1100 1
    
if [ -d /etc/X11/xinit/xinitrc.d ] ; then
 for f in /etc/X11/xinit/xinitrc.d/?* ; do
  [ -x "$f" ] && . "$f"
 done
 unset f
fi

xrdb -merge ~/.Xresources
eval $(dbus-launch --sh-syntax --exit-with-session <window_manager>)

exec i3
