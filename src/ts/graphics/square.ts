import Color from "@ts/utils/color";
import Vector from "@ts/utils/vector";
import * as PIXI from "pixi.js";
import { getRandomId } from "@ts/utils/random";
import Layer from "@ts/graphics/layer";

export default class Square extends Layer {
  app: PIXI.Application;
  pos: Vector;
  width: number;
  height: number;
  color: Color;
  gradient: Color[];
  label: string;

  /**
   * 기본적인 사각형 그래픽
   * @param pos 위치
   * @param width 너비
   * @param height 높이
   * @param color 색상, 없으면 흰색이 됨
   * @param gradient 그라데이션, 있으면 기존의 색상은 무시됨
   */
  constructor(
    app: PIXI.Application,
    pos: Vector,
    width: number,
    height: number,
    color: Color | undefined = new Color([255, 255, 255]),
    gradient: Color[] | undefined = undefined,
    label: string | undefined = undefined
  ) {
    super();
    this.app = app;
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.color = color;
    this.gradient = gradient;
    this.label = (label || "Square") + getRandomId();

    this.draw();
  }

  set x(value: number) {
    this.pos.x = value;
  }

  get x(): number {
    return this.pos.x;
  }

  set y(value: number) {
    this.pos.y = value;
  }

  get y(): number {
    return this.pos.y;
  }

  draw() {
    const rect = new PIXI.Graphics({ label: this.label });
    rect.fillStyle = this.color;
    // anchor를 중심으로 설정
    rect.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    rect.fill();
    this.app.stage.addChild(rect);
  }
}
