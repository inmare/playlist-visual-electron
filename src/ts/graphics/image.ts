import Vector from "@ts/utils/vector";
import Layer from "@ts/graphics/layer";
import Color from "@ts/utils/color";
import * as PIXI from "pixi.js";
import { getRandomId } from "../utils/random";
import Mask from "@ts/graphics/mask";

export default class Image extends Layer {
  app: PIXI.Application;
  sprite: PIXI.Sprite;
  pos: Vector;
  scale: Vector;
  alpha: number;
  mask: Mask | undefined;
  label: string | undefined;

  /**
   * 기본적인 이미지 그래픽
   * @param sprite 이미지 스프라이트
   * @param pos 위치
   * @param scale 크기
   * @param alpha 투명도
   * @param label 레이블, 없으면 "Image"가 붙음
   */
  constructor(
    sprite: PIXI.Sprite,
    pos: Vector,
    scale: Vector = new Vector(1, 1),
    alpha = 1,
    mask: Mask | undefined = undefined,
    label: string | undefined = "Image"
  ) {
    super();
    this.sprite = sprite;
    this.pos = pos;
    this.scale = scale;
    this.alpha = alpha;
    this.mask = mask;
    this.label = label + getRandomId();
  }

  draw(app: PIXI.Application, time: number) {
    this.sprite.scale.set(this.scale.x, this.scale.y);
    this.sprite.x = this.pos.x - this.sprite.width / 2;
    this.sprite.y = this.pos.y - this.sprite.height / 2;
    this.sprite.alpha = this.alpha;
    // add temporary mask
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to create canvas context");
    }

    if (this.mask) this.sprite.mask = this.mask.sprite;
    app.stage.addChild(this.sprite);
  }
}
