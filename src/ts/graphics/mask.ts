import Vector from "@ts/utils/vector";
import * as PIXI from "pixi.js";

export class AbsoluteMask {
  path: Vector[];
  sprite: PIXI.Sprite;

  /**
   * 요소의 위치에 관계없는 절대적인 경로의 마스크
   * @param path 마스크의 경로
   */
  constructor(path: Vector[]) {
    this.path = path;
  }

  // TODO: canvas에 그림을 그릴 때 영상용 캔버스의 크기를 입력받아 mask spirte를 생성해 this.sprite에 할당하기
  // preview.ts의 마스크 생성 코드 참고
}
