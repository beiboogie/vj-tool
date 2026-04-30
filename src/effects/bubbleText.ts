// PV Tool — Copyright (c) 2026 DanteAlighieri13210914
// Licensed under AGPL-3.0. For commercial use, see COMMERCIAL.md

import * as PIXI from 'pixi.js';
import { BaseEffect } from './base';
import type { UpdateContext } from '../core/types';
import { resolveColor } from '../core/types';

interface BubbleChar {
  text: PIXI.Text;
  x: number;
  y: number;
  speed: number;
  rotSpeed: number;
  rotation: number;
  size: number;
}

export class BubbleText extends BaseEffect {
  readonly name = 'bubbleText';
  private chars: BubbleChar[] = [];
  private initialized = false;
  private pool: string = '';

  protected setup(): void {}

  private spawn(sw: number, sh: number, ctx: UpdateContext): void {
    const currentText = ctx.currentText || '';
    const newPool = currentText || this.config.chars || '春を告げる夜を越えて踊れ';

    if (newPool !== this.pool) {
      this.pool = newPool;
    }

    if (this.initialized) return;
    this.initialized = true;

    const count = this.config.count ?? 20;
    const color = resolveColor(this.config.color ?? '$accent', this.palette);
    const strokeColor = resolveColor(this.config.strokeColor ?? '$primary', this.palette);
    const fontFamily = this.config.fontFamily ?? '"Noto Serif JP", "Yu Mincho", serif';
    const minSize = this.config.minSize ?? 24;
    const maxSize = this.config.maxSize ?? 56;

    for (let i = 0; i < count; i++) {
      const ch = this.pool[Math.floor(Math.random() * this.pool.length)];
      const size = minSize + Math.random() * (maxSize - minSize);

      const style = new PIXI.TextStyle({
        fontFamily,
        fontSize: size,
        fill: color,
        fontWeight: 'bold',
        stroke: { color: strokeColor, width: Math.max(2, size * 0.06) },
        dropShadow: {
          color: color,
          blur: size * 0.3,
          alpha: 0.5,
          distance: 0,
        },
      });
      const text = new PIXI.Text({ text: ch, style });
      text.anchor.set(0.5);

      const x = Math.random() * sw;
      const y = sh + size + Math.random() * sh * 0.5;

      text.x = x;
      text.y = y;

      const fc: BubbleChar = {
        text,
        x,
        y,
        speed: 20 + Math.random() * 40,
        rotSpeed: (Math.random() - 0.5) * 0.8,
        rotation: (Math.random() - 0.5) * 0.3,
        size,
      };

      this.chars.push(fc);
      this.container.addChild(text);
    }
  }

  update(ctx: UpdateContext): void {
    this.spawn(ctx.screenWidth, ctx.screenHeight, ctx);

    const spd = ctx.animationSpeed;
    const intensity = ctx.motionIntensity;

    for (const c of this.chars) {
      c.y -= c.speed * spd * 0.4 * (1 + ctx.beatIntensity * 0.3) * ctx.deltaTime;

      if (c.y < -c.size * 2) {
        c.y = ctx.screenHeight + c.size * 2;
        c.x = Math.random() * ctx.screenWidth;
        c.text.text = this.pool[Math.floor(Math.random() * this.pool.length)];
      }

      c.rotation += c.rotSpeed * spd * 0.4 * ctx.deltaTime * intensity;
      c.text.x = c.x;
      c.text.y = c.y;
      c.text.rotation = c.rotation;
    }
  }
}
