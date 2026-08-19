---
title: WPILib integration
description: The Rotem class — geometry, alerts, dashboards and simulation.
---

`CoreRotem` has no WPILib dependency at all, so the same code drives robot code, a bench tool and
log replay. `Rotem` is the thin subclass that adds the WPILib-typed surface and nothing else.

```java
import com.sapphify.frc.hardware.Rotem;

public class Drivetrain extends SubsystemBase {
  private final Rotem imu = new Rotem(0);          // can_s0
  // private final Rotem imu = new Rotem(0, SapphifyCanBus.systemCore(4));

  @Override
  public void periodic() {
    imu.refreshAlerts();
    poseEstimator.update(imu.getRotation2d(), modulePositions);
  }
}
```

## Geometry

| Method | Returns |
|---|---|
| `getRotation2d()` | heading, for a pose estimator |
| `getRotation3d()` | full orientation, built from the quaternion |
| `getQuaternionWpi()` | WPILib `Quaternion` |

Counter-clockwise positive in NWU, matching WPILib. The coordinate-system documentation warns that
some IMUs are clockwise-positive and must be inverted in user code; this one is not.

`getRotation3d()` is derived from the quaternion rather than from re-composed Euler angles, which
lose information near gimbal lock.

## Alerts

```java
imu.refreshAlerts();   // call from periodic()
```

Every health flag is bound to one WPILib `Alert` at construction, with a severity that matches
what the fault actually means:

| Level | Flags |
|---|---|
| `HIGH` | device ID conflict, estimator numerical fault, firmware/library mismatch |
| `MEDIUM` | high vibration, magnetic disturbance, sensor saturation, FIFO overrun |
| `LOW` | temperature outside the calibrated range, calibration stale |

The text is the same wording the core layer produces, which names the likely mechanical cause
rather than the bit that was set. `Alert` has built-in change detection, so calling `refreshAlerts()`
every loop is the intended usage rather than something to optimise around.

## Dashboards

`Rotem` implements `Sendable` with the `Gyro` dashboard type, so it renders as a compass:

```java
SmartDashboard.putData("IMU", imu);
```

Published properties: heading, yaw uncertainty, drift since zero, a healthy boolean, and the bus
name. The class is also annotated `@Logged`, so Epilogue picks it up.

:::note[LiveWindow is gone]
WPILib 2027 removed the `LiveWindow` and `Shuffleboard` classes entirely. Devices no longer
auto-publish in what used to be Test mode — now called Utility mode — so put the `putData` call in
your own code.
:::

## Simulation

```java
var sim = imu.getSimState();
sim.setYaw(Units.degreesToRadians(90));
sim.setYawUncertainty(0.4);
```

Named and unit-matched to WPILib's own `OnboardIMUSim`. The device appears in the simulation GUI
under **Other Devices** as `SAPPHIFY:ROTEM[0]`.

## Usage reporting

The constructor calls `HAL.reportUsage("ROTEM", deviceNumber, "SapphifyLib")`, the string-based API
that replaced the enum-based `HAL.report` in 2027. Nothing is required of you.
