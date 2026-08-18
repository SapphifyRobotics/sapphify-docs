---
title: CAN protocol
description: Every frame, field, scaling and status bit — published.
---

The full specification lives in its own repository, versioned with the firmware:

**[SAPPHIFY CAN protocol specification](https://github.com/SapphifyRobotics/sapphify-can-spec)**

Any team can write its own driver, replay its own logs, or integrate a SAPPHIFY device into a
non-WPILib stack from that document alone. No SAPPHIFY software is required and no part of it is
withheld. It is CC BY 4.0; implementations are unrestricted.

## Why we publish it

The closed alternative does not. There is no frame layout, no arbitration-ID reference and no DBC
anywhere in CTRE's documentation — what exists is consumer-level guidance about update frequencies
and bus utilisation. That is a reasonable choice for them and a poor one for a team trying to
understand what its sensor is actually doing.

Redux publishes theirs too. We are the second open vendor here, not the only one, and being second
is still the right side of the line.

## Addressing

Standard FRC 29-bit extended identifiers: device type (5 bits), manufacturer (8), API class (6),
API index (4), device number (6). ROTEM uses device type **4**, "Gyro Sensor".

:::caution[Manufacturer ID pending]
Every SAPPHIFY device shares one manufacturer ID, requested from FIRST's reserved pool (21–255).
Until it is assigned, pre-release firmware uses the "Team Use" ID **8**. The value is defined once
as a named constant that firmware, library, specification and tooling all reference, so the
assignment changes one line. Version 1.0 of the specification is not cut until it lands.
:::

## One protocol, every device

Addressing, health flags, identity, configuration persistence, time synchronisation and firmware
update are defined once and behave identically on every SAPPHIFY device. Only the measurement
frames differ per product. A team that learns one device has learned all of them.

## Time synchronisation

Every sample is timestamped on-device and published with its data, and a bus-time discipline
message lets several devices share one time base. This works on a plain 1 Mbps bus, needs no
companion hardware and costs nothing. The achievable precision will be **measured and published**,
not asserted.
