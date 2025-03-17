import Color from "@ts/utils/color";
import Vector from "@ts/utils/vector";

export default class Square {
  pos: Vector;
  width: number;
  height: number;
  color: Color;
  gradient: Color[];

  /**
   * 기본적인 사각형 그래픽
   * @param pos 위치
   * @param width 너비
   * @param height 높이
   * @param color 색상, 없으면 흰색이 됨
   * @param gradient 그라데이션, 있으면 기존의 색상은 무시됨
   */
  constructor(
    pos: Vector,
    width: number,
    height: number,
    color: Color | undefined = new Color([255, 255, 255]),
    gradient: Color[] | undefined = undefined
  ) {
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.color = color;
    this.gradient = gradient;
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
}
