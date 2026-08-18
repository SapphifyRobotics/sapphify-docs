---
title: Diagnostics and alerts
description: Turning "our odometry is broken" into a readable diagnosis.
---

The single largest support cost in this product category is a team that knows something is wrong
and cannot see what. ROTEM publishes health as first-class signals rather than as a debug
afterthought.

## Alerts

```java
for (String alert : imu.getActiveAlerts()) {
  DriverStation.reportWarning(alert, false);
}
```

Each string is written for the person standing in the pit, and names the likely mechanical or
electrical cause rather than the bit that was set:

- *ROTEM AHRS 0: high vibration. Check swerve module bearings and belt tension; the vibration
  analyser names the offending frequency.*
- *ROTEM AHRS 0: magnetic disturbance detected, heading correction suspended.*
- *ROTEM AHRS 0: another device answers on this device number. Give each device a unique number.*
- *ROTEM AHRS 0: estimator numerical fault. Heading is not trustworthy until it reconverges.*

An empty list means the device is healthy.

## Quality signals

| Signal | Units | What it answers |
|---|---|---|
| `getYawUncertainty()` | deg | How confident is the filter, right now? |
| `getAccumulatedDrift()` | deg | How far has heading wandered since the last zero? |

`getYawUncertainty()` comes from the filter covariance — it is the estimator's own opinion, not a
constant from a datasheet. Gate your pose estimator on it:

```java
var sigma = imu.getYawUncertainty();
if (sigma.isValid() && sigma.value() < 2.0) {
  poseEstimator.addVisionMeasurement(...);
}
```

## Health flags

`getHealth()` returns the decoded flag word. Each flag maps to exactly one alert string, and that
mapping is part of the library's public test suite, so an alert can never silently stop firing.

Flags cover calibration validity and age, mount pose state, magnetometer enable and disturbance,
gyro and accelerometer saturation, vibration, FIFO overrun, timing discontinuity, host heartbeat
loss, device ID conflict, bus-off recovery, black-box state, temperature outside the calibrated
range, estimator numerical fault, and firmware/library version mismatch.
