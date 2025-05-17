#!/usr/bin/env python3

import requests
import sys
import time

USERNAME = "onickel"
PASSWORD = "Rezhoc-geqzu4-sumhon"
ACCOUNT_NAME = USERNAME  # usually same as username

BASE_URL = "https://shareous1.dexcom.com/ShareWebServices/Services"

def get_session_id():
    r = requests.post(
        f"{BASE_URL}/General/LoginPublisherAccountByName",
        headers={"Content-Type": "application/json"},
        json={"accountName": USERNAME, "password": PASSWORD, "applicationId": "d89443d2-327c-4a6f-89e5-496bbb0317db"}
    )
    r.raise_for_status()
    return r.text.replace('"', '')

def get_glucose(session_id):
    r = requests.post(
        f"{BASE_URL}/Publisher/ReadPublisherLatestGlucoseValues",
        params={"sessionId": session_id, "minutes": 1440, "maxCount": 1},
        headers={"Content-Type": "application/json"},
        json={}
    )
    r.raise_for_status()
    readings = r.json()
    if not readings:
        return "N/A"
    sgv = readings[0]['Value']
    return f" {sgv} mg/dL"  # uses NerdFont 'heartbeat' icon

try:
    sid = get_session_id()
    print(get_glucose(sid))
except Exception as e:
    print("n/a")

