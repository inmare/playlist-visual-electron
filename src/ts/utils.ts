import * as PIXI from "pixi.js";
import { videoSize } from "./config";

export function loadImage(url: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) {
        reject("Canvas context is null");
        return;
      }
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      resolve(canvas);
    };
    image.src = url;
  });
}

/**
 * 이미지의 넓이가 영상의 넓이에 맞을 수 있도록 비율을 계산하는 함수
 * @param image 이미지 텍스처
 * @returns 이미지의 넓이에 곱하면 영상의 넓이가 되는 비율
 */
export function calculateRatio(image: PIXI.Texture): number {
  return videoSize.width / image.width;
}
