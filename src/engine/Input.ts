/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Camera } from './Camera.ts';

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private camera: Camera;

  public mouseX: number = 0;
  public mouseY: number = 0;
  public worldMouseX: number = 0;
  public worldMouseY: number = 0;

  public isMouseDown: boolean = false;
  public isRightMouseDown: boolean = false;
  public isMouseClicked: boolean = false;
  public isRightMouseClicked: boolean = false;

  public clickX: number = 0;
  public clickY: number = 0;
  public rightClickX: number = 0;
  public rightClickY: number = 0;

  // Box drag selection
  public isDragging: boolean = false;
  public dragStartX: number = 0;
  public dragStartY: number = 0;
  public dragWorldStartX: number = 0;
  public dragWorldStartY: number = 0;

  private keys: Set<string> = new Set();

  constructor(canvas: HTMLCanvasElement, camera: Camera) {
    this.canvas = canvas;
    this.camera = camera;
    this.setupListeners();
  }

  private setupListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      const worldPos = this.camera.screenToWorld(this.mouseX, this.mouseY);
      this.worldMouseX = worldPos.x;
      this.worldMouseY = worldPos.y;

      if (this.isMouseDown && !this.isDragging) {
        const dist = Math.hypot(this.mouseX - this.dragStartX, this.mouseY - this.dragStartY);
        if (dist > 10) {
          this.isDragging = true;
        }
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      const worldPos = this.camera.screenToWorld(this.mouseX, this.mouseY);
      this.worldMouseX = worldPos.x;
      this.worldMouseY = worldPos.y;

      if (e.button === 0) {
        // Left button
        this.isMouseDown = true;
        this.isMouseClicked = true;
        this.clickX = worldPos.x;
        this.clickY = worldPos.y;
        this.dragStartX = this.mouseX;
        this.dragStartY = this.mouseY;
        this.dragWorldStartX = worldPos.x;
        this.dragWorldStartY = worldPos.y;
        this.isDragging = false;
      } else if (e.button === 2) {
        // Right button (attack / force move)
        this.isRightMouseDown = true;
        this.isRightMouseClicked = true;
        this.rightClickX = worldPos.x;
        this.rightClickY = worldPos.y;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isMouseDown = false;
        this.isDragging = false;
      } else if (e.button === 2) {
        this.isRightMouseDown = false;
      }
    });

    // Zoom via wheel
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY < 0 ? 0.1 : -0.1;
      this.camera.setZoom(this.camera.targetZoom + zoomDelta);
    }, { passive: false });

    // Touch support for mobile / tablets
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.touches[0].clientX - rect.left;
        this.mouseY = e.touches[0].clientY - rect.top;
        const worldPos = this.camera.screenToWorld(this.mouseX, this.mouseY);
        this.worldMouseX = worldPos.x;
        this.worldMouseY = worldPos.y;
        this.isMouseClicked = true;
        this.clickX = worldPos.x;
        this.clickY = worldPos.y;
      }
    }, { passive: true });
  }

  public isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }

  public isSpacePressed(): boolean {
    return this.keys.has('Space');
  }

  public resetFrameClicks() {
    this.isMouseClicked = false;
    this.isRightMouseClicked = false;
  }

  public updateWorldPosition() {
    const worldPos = this.camera.screenToWorld(this.mouseX, this.mouseY);
    this.worldMouseX = worldPos.x;
    this.worldMouseY = worldPos.y;
  }
}
