---
title: ROTEM
description: CAN FD attitude and heading reference — specifications, status lights and mounting.
---

ROTEM is a 50 × 50 mm four-layer CAN FD attitude and heading reference built around an ICM-45686
IMU with a fitted MMC5983MA magnetometer and an STM32U575. It reports orientation to robot code,
and it reports how much it trusts that orientation.

## Specifications

| | |
|---|---|
| Outline | 50 × 50 mm, four layers, four M3 mounting holes |
| Input | 6–28 V, reverse-polarity protected, PTC and TVS on the input |
| Bus | CAN FD and classic CAN 2.0B at 1 Mbps, split termination on jumpers |
| IMU | ICM-45686, ±4000 °/s, ±32 g |
| Magnetometer | MMC5983MA, fitted; fusion **off by default** |
| Logging | 64 Mbit onboard flash, black-box recorder |
| Debug | USB-C device port, self-powered |
| Device type | 4 (Gyro Sensor) in the FIRST device-type table |

USB-C does not power the board. Main input is required; VBUS is protected sense only.

## Status lights

Two RGB indicators. SYS reports the device, CAN reports the bus.

| SYS | CAN | Meaning |
|---|---|---|
| Off | Off | No power, or no firmware |
| Blue slow blink | Off | Booting and running self-test |
| Green steady | Alternating green | Healthy, robot enabled |
| Green steady | Simultaneous amber blink | Healthy, robot disabled |
| Green steady | Alternating amber | CAN present, no host software |
| Green or red | Alternating red | No CAN, or bus-off |
| Blue alternating | Blue alternating | Firmware update or bootloader |
| Amber | Amber | Recoverable warning — read the health frame |
| Red | Red/amber alternating | Hardware or self-test fault |

There is deliberately no branded light sequence, no fade and no breathing animation. Every state
above means something.

## Mounting and orientation

Mount pose is configured **on the device** and persisted, not corrected in robot code. A board
mounted sideways then reports robot-frame orientation to everything on the bus — the configuration
tool and the black-box log included — rather than only to the one program that remembered to
rotate it.

```java
var config = new RotemConfiguration();
config.mountPose.yawDegrees = 90.0;
imu.getConfigurator().apply(config);
```

The commit is atomic and lands in wear-levelled flash with a CRC, so a brown-out mid-commit leaves
the previous configuration intact. Mount calibration that does not survive a power cycle is a
defect, not a limitation.

## Magnetometer policy

Fusion is **off by default**, and that is a considered position rather than an oversight. An FRC
field is full of motors, steel and current; a heading that silently shifts when a neighbouring
robot drives past is worse than no magnetometer at all, because the failure is invisible.

With fusion off the magnetometer still runs as a **drift auditor** — it reports estimated heading
error since zeroing without touching the published heading. Turning fusion on keeps every
correction gated by the disturbance detector and applied gradually. Heading never steps.
