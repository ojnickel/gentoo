#!/bin/bash

# Read temperature in °C
temp=$(cat /sys/devices/virtual/thermal/thermal_zone2/hwmon2/temp1_input)
temp=$((temp / 1000))

# Colors — insert your actual hex values here
darkgreen="#223322"
darkergreen="#1b3b1b"
orange="#896433"
darkorange="#cc5500"
darkred="#cc3333"

# Decide icon and background
if [ "$temp" -lt 30 ]; then
  icon=""
  bg="$darkgreen"
elif [ "$temp" -lt 40 ]; then
  icon=""
  bg="$darkergreen"
elif [ "$temp" -lt 50 ]; then
  icon=""
  bg="$orange"
elif [ "$temp" -lt 60 ]; then
  icon=""
  bg="$darkorange"
else
  icon=""
  bg="$darkred"
fi

# Output formatted with padding and background (pill shape)
echo "%{B$bg}%{F#ffffff}  $icon ${temp}°C  %{B-}%{F-}"
