import * as PIXI from "pixi.js";
import { DropShadowFilter } from "pixi-filters";
import DefaultImage from "@assets/images/DefaultImage.png";
import { TextInput } from "@ts/song";

const loadImage = (url: string) => {
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
};

export class Preview {
  async init(app: PIXI.Application, canvas: HTMLCanvasElement) {
    app.init({
      canvas: canvas,
      width: 1920,
      height: 1080,
      backgroundColor: 0x000000,
    });

    const canvasImage = await loadImage(DefaultImage);
    const texture = PIXI.Texture.from(canvasImage);
    const bgSprite = new PIXI.Sprite(texture);
    bgSprite.label = "Background image";
    bgSprite.scale.set(1.5);
    app.stage.addChild(bgSprite);

    const sprite = new PIXI.Sprite(texture);
    sprite.label = "Image";
    sprite.filters = [new DropShadowFilter()];
    app.stage.addChild(sprite);

    const textContainer = new PIXI.Container({ label: "Text container" });
    textContainer.filters = [
      new DropShadowFilter({
        offset: new PIXI.Point(0, 0),
        color: 0x000000,
        alpha: 1,
        blur: 2,
        quality: 15,
      }),
    ];
    app.stage.addChild(textContainer);

    const textStyle = new PIXI.TextStyle({
      fontFamily: "Pretendard JP Variable",
      fontSize: 96,
      fill: 0xffffff,
      align: "left",
      fontWeight: "700",
    });

    TextInput.forEach((value, index) => {
      const text = new PIXI.Text({
        text: "",
        style: textStyle,
        label: value as string,
      });

      text.y = textStyle.fontSize * index;
      textContainer.addChild(text);
    });
  }
}
