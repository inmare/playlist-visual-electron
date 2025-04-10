import Vector from "@ts/utils/vector";
import { getRandomId } from "@ts/utils/random";
import * as PIXI from "pixi.js";
import Color from "../utils/color";

export default class Mask {
  path: Vector[]; // 임시로 직선 경로만 나타낼 수 있게 사용함
  sprite: PIXI.Sprite;
  x: number;
  y: number;
  label: string;

  /**
   * 요소의 위치에 관계없는 절대적인 경로의 마스크
   * @param path 마스크의 경로
   * @param sprite 마스크로 사용할 스프라이트
   * @param x 마스크의 x 좌표. 적용되는 스프라이트의 제일 왼쪽이 0이다
   * @param y 마스크의 y 좌표. 적용되는 스프라이트의 제일 위쪽이 0이다
   * @param label 레이블, 없으면 "Mask"가 붙음
   */
  constructor(path: Vector[], label: string = "Mask") {
    this.path = path;
    this.label = label + getRandomId();

    let maxX = this.path[0].x;
    let maxY = this.path[0].y;

    for (const vec of this.path) {
      if (vec.x > maxX) maxX = vec.x;
      if (vec.y > maxY) maxY = vec.y;
    }

    // AA 때문에 생길 픽셀을 대비한 padding. 의미가 있는지는 모르겠음
    const pad = 5;

    // Mask를 그리고 sprite에 할당
    const canvas = document.createElement("canvas");
    canvas.width = maxX + pad;
    canvas.height = maxY + pad;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = new Color([0, 0, 0]).toHex();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    ctx.fillStyle = new Color([255, 255, 255]).toHex();
    ctx.beginPath();
    // 마스크 그리기. 현재는 직선경로에만 대응함
    this.path.forEach((value, index) => {
      if (index == 0) ctx.moveTo(value.x, value.y);
      else ctx.lineTo(value.x, value.y);
    });
    ctx.closePath();
    ctx.fill();

    this.sprite = new PIXI.Sprite(PIXI.Texture.from(canvas));
  }

  // TODO: canvas에 그림을 그릴 때 영상용 캔버스의 크기를 입력받아 mask spirte를 생성해 this.sprite에 할당하기
  // preview.ts의 마스크 생성 코드 참고
}
