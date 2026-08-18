---
title: CAN bus troubleshooting
description: What to check, in the order worth checking it.
---

## The device does not appear

Work through these in order. The first two account for most cases.

1. **Is it powered?** The SYS LED lights as soon as the board has input voltage. Off means power,
   not CAN. USB-C does not power the board — main input is required.
2. **Measure termination.** With the robot **off**, measure resistance across CANH and CANL. About
   **60 Ω** is correct: two 120 Ω terminators in parallel. Reading **120 Ω** means only one
   terminator is present. Reading much higher means neither is.
3. **Check the jumpers.** Close both termination jumpers only when the module is physically at an
   end of the bus. Opening either one disables the whole termination network — they form a single
   split network, not two independent ones.
4. **Green and yellow.** CAN wiring is conventionally yellow for CANH and green for CANL. Swapped
   pairs are the classic mistake and produce a bus that looks wired and does not work.
5. **Tug every crimp.** A crimp that looks fine and fails under vibration is the most common
   intermittent fault in FRC, and it presents as a device that disappears mid-match.

## Two devices, one number

`DEVICE_ID_CONFLICT` means another device answers on the same device type and number. ROTEM detects
this continuously and reports it — it will **not** silently renumber itself, because a device that
quietly changes address is far harder to debug than one that complains.

Device numbers are scoped per device type, so an AHRS and an encoder can both be device 0 without
conflicting. Assign a new number over USB with no bus and no deployed robot code.

## Heading drifts or jumps

Read the diagnostics before changing anything:

```java
imu.getYawUncertainty();   // the filter's own confidence
imu.getAccumulatedDrift(); // estimated error since the last zero
imu.getActiveAlerts();     // what the device thinks is wrong
```

- **High vibration** — mechanical, not electrical. Check module bearings and belt tension.
- **Magnetic disturbance** — a current-carrying conductor or a steel mechanism near the board.
  Corrections are suspended automatically; heading is not stepped.
- **Sensor saturation** — motion exceeded the configured range during an impact. Accuracy is
  degraded for that interval and recovers.
- **Estimator fault** — the filter hit a numerical fault and reinitialised rather than publish a
  plausible-looking wrong orientation. Heading is untrustworthy until it reports converged.

## Bus-off

`BUS_OFF` almost always means a wiring fault or a bit-rate mismatch rather than a device fault.
Recovery is automatic and the counter is published in the CAN health frame. If it repeats, inspect
the wiring before replacing hardware.
