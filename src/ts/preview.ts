import * as PIXI from "pixi.js";
import { DropShadowFilter } from "pixi-filters";
import DefaultImage from "@assets/images/DefaultImage.png";
import { TextInput } from "@ts/song";
import { loadImage } from "@ts/utils";

export class Preview {
  bgImageLabel: string;
  imageLabel: string;
  textContainerLabel: string;

  constructor() {
    this.bgImageLabel = "Background Image";
    this.imageLabel = "Image";
    this.textContainerLabel = "Text Container";
  }

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
    bgSprite.label = this.bgImageLabel;
    bgSprite.scale.set(1.5);
    app.stage.addChild(bgSprite);

    const sprite = new PIXI.Sprite(texture);
    sprite.label = this.imageLabel;
    sprite.filters = [new DropShadowFilter()];
    app.stage.addChild(sprite);

    const textContainer = new PIXI.Container({
      label: this.textContainerLabel,
    });
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

  updateText(app: PIXI.Application, name: string, value: string) {
    const textContainer = app.stage.getChildByName(
      this.textContainerLabel
    ) as PIXI.Container;
    const text = textContainer.getChildByName(name) as PIXI.Text;
    text.text = value;
  }

  updateImage(app: PIXI.Application, canvas: HTMLCanvasElement) {
    // TODO: 이미지 자동 스케일링 코드 추가
    const image = app.stage.getChildByName(this.imageLabel) as PIXI.Sprite;
    const bgImage = app.stage.getChildByName(this.bgImageLabel) as PIXI.Sprite;
    const texture = PIXI.Texture.from(canvas);
    image.texture = texture;
    bgImage.texture = texture;
  }
}
