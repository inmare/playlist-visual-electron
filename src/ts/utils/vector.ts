import * as PIXI from "pixi.js";

export default class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get pixiPoint(): PIXI.Point {
    return new PIXI.Point(this.x, this.y);
  }

  /**
   * from에서 amount만큼 움직인 새로운 벡터를 반환함
   * @param from 기존 위치
   * @param amount 움직일 양
   * @returns 새로운 벡터
   */
  move(amount: Vector) {
    this.x += amount.x;
    this.y += amount.y;
  }
}
