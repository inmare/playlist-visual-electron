import * as PIXI from "pixi.js";
import Vector from "@ts/utils/vector";

export default class Group {
  _container: PIXI.Container;
  label: string;
  elements: PIXI.Graphics[];
  pos: Vector;

  constructor(
    label: string,
    elements: PIXI.Graphics[],
    pos: Vector = new Vector(0, 0)
  ) {
    this.label = label;
    this.elements = elements;
    this.pos = pos;
    this._container = new PIXI.Container();
  }
}
