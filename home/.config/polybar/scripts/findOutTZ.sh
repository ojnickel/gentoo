#!/bin/env bash
for i in /sys/class/thermal/thermal_zone*; do echo "$i: $(<$i/type)"; done
# Full path of temperature sysfs path
# Use `sensors` to find preferred temperature source, then run
for i in /sys/class/hwmon/hwmon*/temp*_input; do echo "$(<$(dirname $i)/name): $(cat ${i%_*}_label 2>/dev/null || echo $(basename ${i%_*})) $(readlink -f $i)"; done
