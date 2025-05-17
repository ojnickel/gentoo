#!/usr/bin/env python3

from dexcom_reader import Dexcom
from dexcom_reader.glucose_units import GlucoseUnit

dexcom = Dexcom("onickel", "Rezhoc-geqzu4-sumhon", "deu")  # or "de"
reading = dexcom.get_current_glucose_reading()

value = reading.value
trend = reading.trend_description
print(f"{value} mg/dL ({trend})")

