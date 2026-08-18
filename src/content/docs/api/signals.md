---
title: Signals
description: Why a measurement is an object rather than a double.
---

A signal is an object you hold, not a `double` you fetch:

```java
RotemSignal<Double> yaw = imu.getYaw();

yaw.value();                   // 37.4
yaw.units();                   // "deg"
yaw.isValid();                 // false if the read failed
yaw.status();                  // why, if it did
yaw.deviceTimestampSeconds();  // when the device sampled it
yaw.ageSeconds(now);           // how old it is
yaw.isStale(now, 0.25);        // older than 250 ms, or invalid
```

A bare `double` has already thrown away everything you need to judge whether the number is worth
acting on. By the time a heading reaches robot code it has crossed a bus that can drop frames, and
the difference between "37.4 degrees, sampled 3 ms ago" and "37.4 degrees, sampled two seconds ago
before the connector fell out" is the difference between working odometry and a robot driving into
a wall with total confidence.

## Two timestamps

| Method | Meaning | Use it for |
|---|---|---|
| `deviceTimestampSeconds()` | when the device sampled the sensor | pose estimation |
| `receivedTimestampSeconds()` | when the frame reached this robot | judging staleness |

:::note[Latency compensation is not implemented yet]
Both timestamps currently report frame arrival. Carrying a device-side sample timestamp on classic
CAN is the one unresolved design point in the protocol specification, and inventing a value here
would make latency compensation look implemented when it is not. Age and staleness are correct
today; latency becomes meaningful when the protocol carries the sample timestamp.
:::

## Update frequency

Every status frame has an individually configurable rate, including zero to disable it:

```java
imu.setUpdateFrequency(SapphifyProtocol.Api.STATUS_ORIENTATION, 250);
```

Defaults are chosen to be safe on a shared 1 Mbps bus carrying a full robot's worth of devices.
Raise orientation if you are running pose estimation at 250–500 Hz. On a CAN FD bus, prefer the
composite frame, which packs the full estimator state into one large frame — the practical limit
on Systemcore is **frames per second**, not bits per second, because its CAN interfaces share SPI
controllers.
