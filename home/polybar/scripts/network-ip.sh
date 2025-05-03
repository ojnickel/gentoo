#!/bin/bash

# Set your interfaces
LAN_IFACE="eno1"    # <- your Ethernet device
WIFI_IFACE="wlan0"  # <- your Wi-Fi device

# Check LAN
LAN_IP=$(ip addr show "$LAN_IFACE" | grep 'inet ' | awk '{print $2}' | cut -d'/' -f1)

if [ -n "$LAN_IP" ]; then
    echo "󰌗 $LAN_IP"
    exit
fi

# Check Wi-Fi
WIFI_IP=$(ip addr show "$WIFI_IFACE" | grep 'inet ' | awk '{print $2}' | cut -d'/' -f1)

if [ -n "$WIFI_IP" ]; then
    echo " $WIFI_IP"
    exit
fi

# No connection
echo "❌ Offline"
^
