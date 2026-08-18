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

## Wiring, and the rules that constrain it

These are not suggestions. Each one maps to a rule an inspector checks.

**Power it from the Power Distribution hub, on a small fuse.** R610 requires every circuit to be
powered solely by a single protected connector pair of the PD. R622 then sizes wire by the
*protective device*, not by what the board draws — on a 40 A channel it would demand 12 AWG.
The exemption is explicit: manufacturer-supplied wires are legal "provided they are powered by the
smallest value fuse or breaker which permits proper device operation."

| | |
|---|---|
| Required protection | **2 A ATM fuse** (or the smallest available that holds) |
| Supplied pigtail | 24 AWG power pair, 28 AWG CAN pair |
| Draw | 200 mA at 5 V design ceiling; 180 mA expected |

Quote that fuse value to your inspector. Without it, a board on a 40 A channel is technically
non-compliant no matter how little current it draws.

**Wire colours.** R624 requires the positive lead to be red, yellow, white, brown or
black-with-stripe, and the negative black or blue, on all non-signal wiring. The supplied pigtail
already complies. CAN is signal level and exempt, but the WPILib convention is yellow for CAN-H
and green for CAN-L — follow it.

**Frame isolation.** R611 requires greater than 120 Ω between either battery post and any point on
the robot frame, and it names sensors with grounded enclosures as a common failure. **All four M3
mounting holes on ROTEM are isolated from copper** — no ground plane, no stitching, nothing. You
can bolt it to a metal chassis with metal hardware and stay compliant.

**Termination.** R716 permits a device to sit inline on the bus and forbids anything that
interferes with, alters or blocks communication. ROTEM daisy-chains and does neither. Close both
termination jumpers **only** if the module is at a physical end of the bus — in the standard
topology the roboRIO and the PD already terminate it, and adding a third terminator will break the
bus.

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
