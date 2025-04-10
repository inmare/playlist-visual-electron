import * as PIXI from "pixi.js";
import Color from "@ts/utils/color";
import Layer from "@ts/graphics/layer";

export default class Renderer {
  app: PIXI.Application | undefined;
  width: number;
  height: number;
  bgColor: Color;
  layers: Array<Layer>;

  constructor(
    width: number,
    height: number,
    bgColor: Color = new Color([0, 0, 0])
  ) {
    this.width = width;
    this.height = height;
    this.bgColor = bgColor;
    this.layers = [];
  }

  init(app: PIXI.Application, canvas?: HTMLCanvasElement) {
    this.app = app;
    this.app.init({
      canvas: canvas,
      width: this.width,
      height: this.height,
      backgroundColor: this.bgColor.toHex(),
      antialias: true,
    });
  }

  addLayer(layer: Layer) {
    this.layers.push(layer);
  }

  render(time: number) {
    if (this.app) throw new Error("Renderer is not initialized");

    for (const layer of this.layers) {
      layer.draw(this.app, time);
    }
  }
}
