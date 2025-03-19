import * as PIXI from "pixi.js";
import Color from "@ts/utils/color";

export default class Renderer {
  app: PIXI.Application;
  layers: Array<any>;

  constructor(
    app: PIXI.Application,
    width: number,
    height: number,
    bgColor: Color
  ) {
    this.app = app;
    this.app.init({
      width: width,
      height: height,
      backgroundColor: bgColor.toHex(),
    });
    this.layers = [];
  }

  addLayer(graphics: any) {
    this.layers.push(graphics);
    this.app.stage.addChild(graphics);
  }
}
