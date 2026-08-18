---
title: Your first heading
description: Read a robot heading from a ROTEM in about five minutes.
---

The goal from unboxing to a working heading in robot code is under five minutes with no prior
knowledge. If it takes longer, that is a documentation bug — please report it.

## Wire it

ROTEM takes 6–28 V and CAN on a single Micro-Fit connector, and the two connectors are wired in
parallel so the device daisy-chains into your bus. Close **both** termination jumpers only if the
module sits at a physical end of the bus; opening either one disables the whole termination
network.

## Read it

```java
import com.sapphify.frc.hardware.CoreRotem;

public class Drivetrain {
  private final CoreRotem imu = new CoreRotem(0, transport);

  public double getHeadingDegrees() {
    var yaw = imu.getYaw();
    if (!yaw.isValid()) {
      // The device is not answering. Keep the last good pose rather than
      // feeding a garbage heading into the estimator.
      return lastKnownHeading;
    }
    lastKnownHeading = yaw.value();
    return lastKnownHeading;
  }
}
```

Device number `0` is the factory default. It is stored in flash and survives power cycles, and you
can change it over USB with no bus and no deployed robot code.

## Then read whether to trust it

This is the part other IMUs do not offer, and the reason to bother:

```java
var sigma = imu.getYawUncertainty();   // the filter's own 1σ, in degrees
var drift = imu.getAccumulatedDrift(); // estimated error since the last zero

for (String alert : imu.getActiveAlerts()) {
  DriverStation.reportWarning(alert, false);
}
```

An alert reads like `ROTEM AHRS 0: high vibration. Check swerve module bearings and belt tension`
— it names the likely mechanical cause, because the person reading it in the pit is usually not
the person who wrote the code.

## Zero it

```java
imu.zeroYaw();
```

Call this when the robot is stationary and squared to the field. Heading is not absolute unless an
absolute reference has been accepted, and the uncertainty signal tells you how much that matters.
