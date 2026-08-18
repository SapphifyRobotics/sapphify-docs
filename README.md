# SAPPHIFY documentation

The documentation site for SAPPHIFY FRC CAN devices — [docs.sapphify.com](https://docs.sapphify.com).

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

```bash
npm install
npm run dev      # local preview
npm run build    # static output in dist/
```

## Why this exists as its own site

The `website` field in our entry in the WPILib vendor repository is the link a team follows from
the dependency manager, and the first thing a reviewer clicks. Of the 22 entries in the 2027
bundle, **17 point at a documentation site** — `docs.ctr-electronics.com`,
`docs.revrobotics.com`, `docs.reduxrobotics.com`, `docs.photonvision.org`,
`docs.advantagekit.org`. None points at a product marketing page. A library covering several
devices needs documentation, not a brochure.

## Why Starlight

Static HTML with **no JavaScript by default**, and search that runs client-side through Pagefind
with no external service. That matters more than it sounds: this site has to be usable in a pit on
saturated venue wifi, and it must never depend on a third party being reachable during a
competition. The whole build is 1.3 MB.

## Structure

The navigation follows the shape FRC programmers already know from Phoenix's documentation —
get running, then the device, then the API, then the wire protocol, then what to do when it
breaks:

```
Getting started    installation, first heading
Hardware reference one page per device
API reference      signals, status codes, configuration, diagnostics
CAN protocol       overview, linking the normative specification
Troubleshooting    CAN bus
```

Mechanical and electrical detail belongs in a versioned PDF user manual, not here. This site owns
software behaviour.

## House rules

- No performance figure appears anywhere until it has been measured and the method published
  alongside it.
- Pre-alpha status is stated on the page, never implied by omission.
- Anything not yet implemented says so plainly. A feature that looks shipped and is not costs more
  trust than it buys.
