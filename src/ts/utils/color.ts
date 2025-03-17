import { Color as PColor } from "pixi.js";

type ColorValue = [number, number, number, number] | [number, number, number];

export default class Color extends PColor {
  constructor(value: ColorValue) {
    super(value);
  }

  get hex(): string {
    return this.toHex();
  }

  static stringToArray(value: string) {
    return new PColor(value).toRgba();
  }
}
