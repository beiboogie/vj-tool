// PV Tool — Copyright (c) 2026 DanteAlighieri13210914
// Licensed under AGPL-3.0. For commercial use, see COMMERCIAL.md

import type { TemplateConfig } from '../core/types';

export const treeTemplate: TemplateConfig = {
  name: '树',
  nameKey: 'tpl_tree',
  palette: {
    background: '#000000',
    primary: '#888888',
    secondary: '#aaaaaa',
    accent: '#888888',
    text: '#ffffff',
  },
  effects: [
    {
      type: 'dynamicScatteredText',
      layer: 'text',
      config: {
        color: '$primary',
        count: 30,
      },
    },
    {
      type: 'fallingText',
      layer: 'decoration',
      config: {
        color: '$text',
        count: 50,
      },
    },
  ],
};
