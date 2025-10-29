#!/bin/bash
# Monitor and fix keyboard repeat rate every minute

while true; do
    # Check current repeat rate
    current_rate=$(xset q | grep "repeat rate" | awk '{print $4}')

    # If it's not 10, fix it
    if [ "$current_rate" != "10" ]; then
        xset r rate 1000 10
        echo "$(date): Fixed keyboard repeat rate from $current_rate to 10"
    fi

    # Wait 60 seconds before checking again
    sleep 60
done
