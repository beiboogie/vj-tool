// PV Tool — Copyright (c) 2026 DanteAlighieri13210914
// Licensed under AGPL-3.0. For commercial use, see COMMERCIAL.md

import type { TemplateConfig } from '../core/types';

export const dynamicBackgroundTemplate: TemplateConfig = {
  name: '动态背景',
  nameKey: 'tpl_dynamicBackground',
  palette: {
    background: '#000000',
    primary: '#ffffff',
    secondary: '#ffffff',
    accent: '#ffffff',
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
  ],
};
