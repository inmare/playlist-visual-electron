import * as PIXI from "pixi.js";
import Color from "@ts/utils/color";
import Layer from "@ts/graphics/layer";

export default class Renderer {
  app: PIXI.Application;
  layers: Array<Layer>;

  constructor(
    app: PIXI.Application,
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    bgColor: Color
  ) {
    this.app = app;
    this.app.init({
      canvas: canvas,
      width: width,
      height: height,
      backgroundColor: bgColor.toHex(),
      antialias: true,
    });
    this.layers = [];
  }

  addLayer(layer: Layer) {
    this.layers.push(layer);
  }

  render(time: number) {
    for (const layer of this.layers) {
      layer.draw(this.app, time);
    }
  }
}
