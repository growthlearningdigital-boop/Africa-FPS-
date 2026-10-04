/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vector2D } from '../types.ts';

export class Camera {
  public x: number = 0;
  public y: number = 0;
  public targetX: number = 0;
  public targetY: number = 0;
  public zoom: number = 1.0;
  public targetZoom: number = 1.0;
  public viewportWidth: number = 1200;
  public viewportHeight: number = 800;
  
  // Bounds
  public mapWidth: number = 2400;
  public mapHeight: number = 1800;

  // Screen shake
  private shakeIntensity: number = 0;
  private shakeDecay: number = 0.9;
  public shakeOffsetX: number = 0;
  public shakeOffsetY: number = 0;

  constructor(initialX: number = 400, initialY: number = 300) {
    this.x = initialX;
    this.y = initialY;
    this.targetX = initialX;
    this.targetY = initialY;
  }

  public setViewport(width: number, height: number) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  public setMapBounds(width: number, height: number) {
    this.mapWidth = width;
    this.mapHeight = height;
  }

  public lookAt(x: number, y: number, immediate: boolean = false) {
    this.targetX = x;
    this.targetY = y;
    if (immediate) {
      this.x = x;
      this.y = y;
    }
  }

  public pan(dx: number, dy: number) {
    this.targetX += dx / this.zoom;
    this.targetY += dy / this.zoom;
  }

  public setZoom(zoom: number) {
    this.targetZoom = Math.max(0.65, Math.min(1.5, zoom));
  }

  public addShake(intensity: number) {
    this.shakeIntensity = Math.min(30, this.shakeIntensity + intensity);
  }

  public update(dt: number = 1 / 60) {
    // Smooth camera interpolation
    this.x += (this.targetX - this.x) * 0.12;
    this.y += (this.targetY - this.y) * 0.12;
    this.zoom += (this.targetZoom - this.zoom) * 0.15;

    // Bounds clamping
    const halfW = (this.viewportWidth / 2) / this.zoom;
    const halfH = (this.viewportHeight / 2) / this.zoom;

    if (this.mapWidth > halfW * 2) {
      this.x = Math.max(halfW, Math.min(this.mapWidth - halfW, this.x));
      this.targetX = Math.max(halfW, Math.min(this.mapWidth - halfW, this.targetX));
    }
    if (this.mapHeight > halfH * 2) {
      this.y = Math.max(halfH, Math.min(this.mapHeight - halfH, this.y));
      this.targetY = Math.max(halfH, Math.min(this.mapHeight - halfH, this.targetY));
    }

    // Shake
    if (this.shakeIntensity > 0.1) {
      this.shakeOffsetX = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.shakeOffsetY = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.shakeIntensity *= this.shakeDecay;
    } else {
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
      this.shakeIntensity = 0;
    }
  }

  public screenToWorld(screenX: number, screenY: number): Vector2D {
    const centeredX = screenX - this.viewportWidth / 2;
    const centeredY = screenY - this.viewportHeight / 2;
    return {
      x: this.x + centeredX / this.zoom,
      y: this.y + centeredY / this.zoom,
    };
  }

  public worldToScreen(worldX: number, worldY: number): Vector2D {
    return {
      x: (worldX - this.x) * this.zoom + this.viewportWidth / 2 + this.shakeOffsetX,
      y: (worldY - this.y) * this.zoom + this.viewportHeight / 2 + this.shakeOffsetY,
    };
  }

  public applyTransform(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(
      this.viewportWidth / 2 + this.shakeOffsetX,
      this.viewportHeight / 2 + this.shakeOffsetY
    );
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  public restoreTransform(ctx: CanvasRenderingContext2D) {
    ctx.restore();
  }

  public isVisible(x: number, y: number, radius: number = 80): boolean {
    const margin = radius + 50;
    const halfW = (this.viewportWidth / 2) / this.zoom + margin;
    const halfH = (this.viewportHeight / 2) / this.zoom + margin;
    return (
      x >= this.x - halfW &&
      x <= this.x + halfW &&
      y >= this.y - halfH &&
      y <= this.y + halfH
    );
  }
}
