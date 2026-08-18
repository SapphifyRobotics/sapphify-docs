import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://frc.sapphify.com',
  integrations: [
    starlight({
      title: 'SAPPHIFY FRC',
      description:
        'Documentation for SAPPHIFY FRC CAN devices: SapphifyLib, the published CAN protocol, and the ROTEM attitude and heading reference.',
      customCss: ['./src/styles/theme.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/SapphifyRobotics' },
      ],
      editLink: {
        baseUrl: 'https://github.com/SapphifyRobotics/sapphify-docs/edit/main/',
      },
      lastUpdated: true,
      // Nav spine adapted from the structure CTRE uses for Phoenix 6, which is the
      // shape FRC programmers already know: get running, then the device, then the API,
      // then the wire protocol, then what to do when it breaks.
      sidebar: [
        {
          label: 'Getting started',
          items: [
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Your first heading', slug: 'getting-started/first-heading' },
          ],
        },
        {
          label: 'Hardware reference',
          items: [{ label: 'ROTEM', slug: 'hardware/rotem' }],
        },
        {
          label: 'API reference',
          items: [
            { label: 'Signals', slug: 'api/signals' },
            { label: 'Status codes', slug: 'api/status-codes' },
            { label: 'Configuration', slug: 'api/configuration' },
            { label: 'Diagnostics and alerts', slug: 'api/diagnostics' },
          ],
        },
        {
          label: 'CAN protocol',
          items: [{ label: 'Overview', slug: 'protocol/overview' }],
        },
        {
          label: 'Troubleshooting',
          items: [{ label: 'CAN bus', slug: 'troubleshooting/can-bus' }],
        },
      ],
    }),
  ],
});
