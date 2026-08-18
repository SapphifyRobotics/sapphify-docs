---
title: Configuration
description: Value objects, atomic commits, and the loop-rate trap.
---

Configuration is a **value**, not a sequence of setter calls. Build the object you want, apply it,
and the device takes all of it or none of it.

```java
var config = new RotemConfiguration();
config.mountPose.yawDegrees = 90.0;
config.features.magnetometerFusionEnabled = false;
config.features.hostTimeoutSeconds = 2.0;

var status = imu.getConfigurator().apply(config);
```

A freshly constructed `RotemConfiguration` is exactly the factory default, so applying an empty one
resets the device. There is no separate "factory reset" verb to remember.

## Where to put it

```java
public class DrivetrainSubsystem extends SubsystemBase {
  private final CoreRotem imu = new CoreRotem(0, transport);

  public DrivetrainSubsystem() {
    var config = new RotemConfiguration();
    config.mountPose.yawDegrees = 90.0;
    imu.getConfigurator().apply(config);   // constructor — once
  }

  @Override
  public void periodic() {
    // never configure here
  }
}
```

:::danger[Do not configure in periodic()]
Applying configuration every loop iteration wears the device's flash and floods the bus, and it is
nearly always an accident — a `configure()` call that belongs in a constructor ends up in
`periodic()`.

After three seconds of sustained loop-rate applies, the configurator stops writing and returns
`FREQUENT_CONFIG_CALLS`. There is a five-second grace period after construction, so legitimate
start-up bursts stay quiet.
:::

## Validation happens before the bus

Every field is range-checked locally against the range in its javadoc. An out-of-range value costs
nothing and reports precisely, instead of spending a round trip to be rejected by firmware.

```java
config.mountPose.yawDegrees = 200.0;      // permitted range is -180 to 180
imu.getConfigurator().apply(config);      // INVALID_PARAMETER, nothing sent
```

## Commits are atomic

An apply stages every value, range-checks it, then commits once to wear-levelled flash with a
schema version, a monotonic revision counter and a CRC. A brown-out mid-commit leaves the previous
configuration intact. There is no state in which a device is half configured.
