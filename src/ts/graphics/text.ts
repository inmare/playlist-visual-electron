import Layer from "@ts/graphics/layer";
import * as PIXI from "pixi.js";
import { getRandomId } from "@ts/utils/random";
import Vector from "@ts/utils/vector";
import Color from "@ts/utils/color";

export default class Text extends Layer {
  text: string;
  pos: Vector;
  fontSize: number;
  color: Color;
  fontFamily: string;
  fontWeight: PIXI.TextStyleFontWeight;
  lineHeight: number;
  label: string | undefined;

  /**
   * 기본적인 텍스트 그래픽
   * @param text 텍스트
   * @param pos 위치
   * @param color 색상
   * @param fontSize 글자 크기
   * @param fontFamily 폰트 종류
   * @param fontWeight 폰트 굵기
   * @param lineHeight 줄 간격
   * @param label 레이블, 없으면 "Text"가 붙음
   */
  constructor(
    text: string,
    pos: Vector,
    fontSize: number,
    color: Color,
    fontFamily: string,
    fontWeight: PIXI.TextStyleFontWeight,
    lineHeight: number,
    label: string = "Text"
  ) {
    super();
    this.text = text;
    this.pos = pos;
    this.color = color;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
    this.lineHeight = lineHeight;
    this.label = label + getRandomId();
  }

  draw(app: PIXI.Application, time: number) {
    const textStyle = new PIXI.TextStyle({
      fontFamily: this.fontFamily,
      fill: this.color.toHex(),
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      lineHeight: this.lineHeight,
    });

    const text = new PIXI.Text({
      text: this.text,
      style: textStyle,
      label: this.label,
    });
    text.position.set(this.pos.x, this.pos.y);

    app.stage.addChild(text);
  }
}
