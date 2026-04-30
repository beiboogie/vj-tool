// PV Tool — Copyright (c) 2026 DanteAlighieri13210914
// Licensed under AGPL-3.0. For commercial use, see COMMERCIAL.md

import * as PIXI from 'pixi.js';
import { BaseEffect } from './base';
import type { UpdateContext } from '../core/types';
import { resolveColor } from '../core/types';

interface DynamicTextParticle {
  textObj: PIXI.Text;
  baseX: number;
  baseY: number;
  baseAlpha: number;
  fadeSpeed: number;
  fadePhase: number;
  switchInterval: number;
  lastSwitchTime: number;
  currentChar: string;
}

export class DynamicScatteredText extends BaseEffect {
  readonly name = 'dynamicScatteredText';
  private particles: DynamicTextParticle[] = [];
  private initialized = false;
  private userText = '';
  private chars: string = '';

  protected setup(): void {}

  private initParticles(width: number, height: number): void {
    if (this.initialized) return;
    this.initialized = true;

    this.userText = this.config._userText || '';
    this.chars = this.userText || this.config.chars || 'つもにはでをがのへとかられ';
    const count = this.config.count ?? 15;
    const color = resolveColor(this.config.color ?? '$secondary', this.palette);
    const fontFamily = this.config.fontFamily ?? '"Noto Serif JP", "Yu Mincho", serif';
    const minSize = this.config.minSize ?? 20;
    const maxSize = this.config.maxSize ?? 60;

    for (let i = 0; i < count; i++) {
      const fontSize = minSize + Math.random() * (maxSize - minSize);

      const style = new PIXI.TextStyle({
        fontFamily,
        fontSize,
        fill: color,
        fontWeight: Math.random() > 0.5 ? 'bold' : 'normal',
      });

      const textObj = new PIXI.Text({ text: '', style });
      textObj.anchor.set(0.5);
      textObj.rotation = (Math.random() - 0.5) * 0.6;

      const baseX = Math.random() * width;
      const baseY = Math.random() * height;
      textObj.x = baseX;
      textObj.y = baseY;

      const baseAlpha = 0.35 + Math.random() * 0.5;
      textObj.alpha = 0;

      this.particles.push({
        textObj,
        baseX,
        baseY,
        baseAlpha,
        fadeSpeed: 0.3 + Math.random() * 0.5,
        fadePhase: Math.random() * Math.PI * 2,
        switchInterval: 1 + Math.random() * 2,
        lastSwitchTime: -1,
        currentChar: '',
      });

      this.container.addChild(textObj);
    }
  }

  private updateChars(ctx: UpdateContext): void {
    const currentText = ctx.currentText || '';
    const newChars = currentText || this.config.chars || 'つもにはでをがのへとかられ';

    if (newChars !== this.chars) {
      this.chars = newChars;
    }
  }

  private getCharAt(time: number, index: number): string {
    if (!this.chars) return '';
    const charIndex = Math.floor(time * 2 + index) % this.chars.length;
    return this.chars[charIndex];
  }

  update(ctx: UpdateContext): void {
    this.initParticles(ctx.screenWidth, ctx.screenHeight);
    this.updateChars(ctx);

    const spd = ctx.animationSpeed;

    for (const p of this.particles) {
      const drift = ctx.motionIntensity;
      
      p.textObj.x = p.baseX + Math.sin(ctx.time * 0.3 * spd + p.fadePhase) * 10 * drift;
      p.textObj.y = p.baseY + Math.cos(ctx.time * 0.2 * spd + p.fadePhase) * 8 * drift;

      if (ctx.time - p.lastSwitchTime >= p.switchInterval / spd) {
        p.lastSwitchTime = ctx.time;
        p.currentChar = this.getCharAt(ctx.time, this.particles.indexOf(p));
        p.textObj.text = p.currentChar;
      }

      const fadeAlpha = p.baseAlpha + Math.sin(ctx.time * p.fadeSpeed * spd + p.fadePhase) * 0.08;
      p.textObj.alpha = fadeAlpha;
    }
  }
}
