import * as PIXI from "pixi.js";

export default abstract class Layer {
  abstract draw(app: PIXI.Application, time: number): void;
}
