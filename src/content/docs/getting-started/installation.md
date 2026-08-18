---
title: Installation
description: Add SapphifyLib to a robot project.
---

:::caution[Pre-alpha]
The Maven artifacts are not published yet, so this will not resolve. The steps are correct and
will work unchanged once they are.
:::

## Java and C++

In VS Code with the WPILib extension, open the command palette and run
**WPILib: Manage Vendor Libraries → Install new libraries (online)**, then paste:

```
https://frcsdk.sapphify.com/SapphifyLib-2027.json
```

The JSON is copied into your project's `vendordeps/` folder. Commit it — it is part of your robot
code, and a teammate cloning the repository needs it.

:::note[Rebuild every 30 days]
A vendor dependency installed in online mode caches its artifacts locally, and WPILib clears that
cache after about 30 days. Connect to the internet and rebuild before your competition, not at it.
:::

## Why this URL never changes

`frcsdk.sapphify.com` serves the vendordep and nothing else. It is separate from
`maven.sapphify.com`, which serves the artifacts, because this URL ends up copied into every
team's project and into the WPILib vendor repository — so it can never move. The artifact store
behind it can change providers without breaking a single installed library.

## Verifying without a robot

The library's decoders have no WPILib or hardware dependency, so you can check your setup on a
laptop with nothing but a JDK:

```bash
git clone https://github.com/SapphifyRobotics/sapphify-lib
cd sapphify-lib/src/main/java
java com/sapphify/frc/hardware/SapphifyLibSelfCheck.java
```

24 checks covering frame decoding, staleness, fault reporting, configuration validation and
misuse detection. If you are writing your own driver from the
[CAN protocol specification](https://github.com/SapphifyRobotics/sapphify-can-spec), this is how
you check your decoders against ours.
