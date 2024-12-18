import * as PIXI from "pixi.js";
import { DropShadowFilter } from "pixi-filters";
import DefaultImage from "@assets/images/DefaultImage.png";
import { TextInput } from "@ts/song";
import { loadImage, calculateRatio } from "@ts/utils";
import { videoSize, previewLabel } from "@ts/config";

export default class Preview {
  async init(app: PIXI.Application, canvas: HTMLCanvasElement) {
    app.init({
      canvas: canvas,
      width: videoSize.width,
      height: videoSize.height,
      backgroundColor: 0x000000,
      // antialias: true,
    });

    const canvasImage = await loadImage(DefaultImage);
    const defaultImage = PIXI.Texture.from(canvasImage);
    const bgSprite = new PIXI.Sprite(defaultImage);
    bgSprite.label = previewLabel.bgImage;
    const factor = calculateRatio(defaultImage);
    bgSprite.scale.set(factor);
    app.stage.addChild(bgSprite);

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = videoSize.width;
    maskCanvas.height = videoSize.height;
    const maskContext = maskCanvas.getContext("2d");
    maskContext.fillStyle = "#ffffff";
    maskContext.beginPath();
    maskContext.moveTo(0, 0);
    maskContext.lineTo(videoSize.width * 0.8, 0);
    maskContext.lineTo(videoSize.width * 0.65, videoSize.height);
    maskContext.lineTo(0, videoSize.height);
    maskContext.lineTo(0, 0);
    maskContext.fill();
    const maskTexture = PIXI.Texture.from(maskCanvas);
    const maskSprite = new PIXI.Sprite(maskTexture);

    const blurFilter = new PIXI.BlurFilter({
      antialias: true,
      quality: 5,
      padding: 100,
    });
    blurFilter.strength = 20;
    blurFilter.repeatEdgePixels = true;

    const imageContainer = new PIXI.Container();
    imageContainer.label = previewLabel.imageContainer.container;
    imageContainer.filters = [
      new DropShadowFilter({
        offset: new PIXI.Point(0, 0),
        color: 0x000000,
        alpha: 1,
        blur: 7,
        quality: 15,
      }),
    ];
    app.stage.addChild(imageContainer);

    const innerContainer = new PIXI.Container();
    innerContainer.mask = maskSprite;
    imageContainer.addChild(innerContainer);

    const colorMatrixFilter = new PIXI.ColorMatrixFilter();
    colorMatrixFilter.brightness(0.5, false);
    // colorMatrixFilter.grayscale(0.5, false);

    const calcPoint = (sprite: PIXI.Sprite, point: PIXI.Point): PIXI.Point => {
      const x = point.x - sprite.width / 2;
      const y = point.y - sprite.height / 2;
      return new PIXI.Point(x, y);
    };

    const sprite = new PIXI.Sprite(defaultImage);
    sprite.label = previewLabel.imageContainer.image;

    sprite.scale.set(factor * 1.5);

    const initPoint = calcPoint(
      sprite,
      new PIXI.Point(videoSize.width / 2, videoSize.height / 2)
    );

    sprite.position.x = initPoint.x;
    sprite.position.y = initPoint.y;
    sprite.filters = [blurFilter, colorMatrixFilter];

    innerContainer.addChild(sprite);

    const textContainer = new PIXI.Container({
      label: previewLabel.textContainer.container,
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
      lineHeight: 96,
    });

    Object.values(TextInput).forEach((value, index) => {
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
      previewLabel.textContainer.container
    ) as PIXI.Container;
    const text = textContainer.getChildByName(name) as PIXI.Text;
    text.text = value;
  }

  updateImage(app: PIXI.Application, texture: PIXI.Texture) {
    // TODO: 이미지 자동 스케일링 코드 추가
    const imageContainer = app.stage.getChildByName(
      previewLabel.imageContainer.container
    ) as PIXI.Container;
    const image = imageContainer.getChildByName(
      previewLabel.imageContainer.image
    ) as PIXI.Sprite;
    const bgImage = app.stage.getChildByName(
      previewLabel.bgImage
    ) as PIXI.Sprite;
    image.texture = texture;
    bgImage.texture = texture;
  }
}
