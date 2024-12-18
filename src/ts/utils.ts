import * as PIXI from "pixi.js";
import { videoSize } from "./config";

/**
 * 이미지의 넓이가 영상의 넓이에 맞을 수 있도록 비율을 계산하는 함수
 * @param image 이미지 텍스처
 * @returns 이미지의 넓이에 곱하면 영상의 넓이가 되는 비율
 */
export function calculateRatio(image: PIXI.Texture): number {
  return videoSize.width / image.width;
}
