---
title: Status codes
description: Why nothing throws, and what each code tells you to do.
---

**Nothing in this library throws for a device or bus condition.** A device on a CAN bus can
legitimately disappear mid-match — a connector vibrates loose, a bus browns out, someone in the pit
unplugs the wrong thing. Robot code that dies with an exception in that situation is worse than
robot code that keeps driving on its last good pose and reports a fault.

Programming errors still throw. Passing device number 63, which is reserved, is a bug in your code
rather than a field condition, and it throws immediately so you find it at your desk.

## Reading a status

```java
var status = imu.getConfigurator().apply(config);
if (status.isError()) {
    DriverStation.reportError(status.description(), false);
}
```

`description()` is written to be shown to a human verbatim. It names the remedy, not just the
symptom:

> **DEVICE_NOT_PRESENT** — No ROTEM device answered at this device number. Verify the device is
> powered (the SYS LED is lit), that the CAN wiring is intact, and that the bus is terminated at
> both ends — measure about 60 ohms across CANH and CANL with the robot off. 120 ohms means one
> termination is missing.

## Codes you are most likely to meet

| Code | What it means |
|---|---|
| `OK` | Call succeeded |
| `DEVICE_NOT_PRESENT` | Nothing answered — power, wiring or termination |
| `SIGNAL_STALE` | Frames arrived once but stopped being fresh |
| `DEVICE_ID_CONFLICT` | Two devices share a device number |
| `BUS_OFF` | Controller went bus-off; recovery is automatic |
| `INVALID_PARAMETER` | A configuration value was out of range; nothing was applied |
| `CONFIG_TIMEOUT` | No acknowledgement; the previous configuration still stands |
| `FREQUENT_CONFIG_CALLS` | You are configuring in a loop — see [Configuration](/api/configuration/) |
| `CALIBRATION_INVALID` | No valid factory calibration on this unit |
| `ESTIMATOR_NOT_CONVERGED` | Still converging; leave the robot still for a moment |
| `ESTIMATOR_FAULT` | Numerical fault; heading is not trustworthy until it reconverges |

A failed read produces a signal carrying the status and a documented fallback value, never a
`null`. Code that ignores the status gets a predictable number instead of a crash; code that checks
it gets something worth printing.
