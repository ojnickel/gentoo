#!/bin/bash

API_KEY="55ccc6e8fff30f154e887f2e867b108e"
CITY="Munich,de"
UNIT="metric"
URL="https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=${UNIT}"

# Nerd Font weather icons
get_icon() {
  case $1 in
    01d) echo "󰖨" ;; # Sunny
    01n) echo "" ;; # Clear night
    02d|02n) echo "" ;; # Few clouds
    03d|03n) echo "" ;; # Scattered clouds
    04d|04n) echo "" ;; # Broken clouds
    09d|09n) echo "" ;; # Shower rain
    10d|10n) echo "" ;; # Rain
    11d|11n) echo "" ;; # Thunderstorm
    13d|13n) echo "" ;; # Snow
    50d|50n) echo "" ;; # Mist
    *) echo "" ;;   # Unknown
  esac
}

response=$(curl -sf "$URL")
if [[ -n "$response" ]]; then
  icon_code=$(echo "$response" | jq -r '.weather[0].icon')
  temp=$(echo "$response" | jq -r '.main.temp' | cut -d. -f1)
  icon=$(get_icon "$icon_code")
  echo "$icon ${temp}°C"
else
  echo " n/a"
fi

##!/bin/bash

#weather=$(curl -s 'wttr.in/?format=%C+%t')

#condition=$(echo "$weather" | cut -d' ' -f1)
#temp=$(echo "$weather" | grep -o '+[0-9]\+°C')

## Default icon
#icon=""  # Cloud

## Match icons to weather condition
#case "$condition" in
    #"Sunny") icon="󰖨" ;;     # Sunny
    #"Clear") icon="" ;;     # Sun
  #"Partly cloudy") icon="" ;;     # Sun + Cloud
  #"Cloudy") icon="" ;;           # Cloud
  #"Overcast") icon="" ;;
  #"Rain"|"Light rain") icon="" ;; # Rain
  #"Thunderstorm") icon="" ;;
  #"Snow"|"Light snow") icon="" ;; # Snowflake
  #*) icon="" ;;                   # Default / Unknown
#esac

#echo "$icon $temp"

