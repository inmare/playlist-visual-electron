import * as PIXI from "pixi.js";
import { DropShadowFilter } from "pixi-filters";
import DefaultImage from "@assets/images/DefaultImage.png";
import { TextInput } from "@ts/song";
import { calculateRatio } from "@ts/utils";
import { videoSize, previewLabel } from "@ts/config";

const createMask = () => {
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
  return PIXI.Texture.from(maskCanvas);
};

const calcPoint = (sprite: PIXI.Sprite, point: PIXI.Point): PIXI.Point => {
  const x = point.x - sprite.width / 2;
  const y = point.y - sprite.height / 2;
  return new PIXI.Point(x, y);
};

const setInitPoint = (sprite: PIXI.Sprite, ratio: number): void => {
  sprite.scale.set(ratio);
  // sprite의 scale을 변경한 다음 위치를 조정해서 정중앙에 위치하도록 함
  const initPoint = calcPoint(
    sprite,
    new PIXI.Point(videoSize.width / 2, videoSize.height / 2)
  );
  sprite.position.set(initPoint.x, initPoint.y);
};

export default class Preview {
  async init(app: PIXI.Application, canvas: HTMLCanvasElement) {
    app.init({
      canvas: canvas,
      width: videoSize.width,
      height: videoSize.height,
      backgroundColor: 0x000000,
      antialias: true,
    });
    // 기본 이미지 로드 및 비율 계산
    const defaultImage = await PIXI.Assets.load(DefaultImage);
    const ratio = calculateRatio(defaultImage);
    // 배경 이미지 설정
    const bgSprite = new PIXI.Sprite(defaultImage);
    bgSprite.label = previewLabel.bgImage;
    setInitPoint(bgSprite, ratio);
    app.stage.addChild(bgSprite);

    // 마스크 설정
    const maskTexture = createMask();
    const maskSprite = new PIXI.Sprite(maskTexture);

    // drop shadow용 제일 밖 container 설정
    const imageContainer = new PIXI.Container();
    imageContainer.label = previewLabel.imageContainer;
    const imageDropShadow = new DropShadowFilter({
      offset: new PIXI.Point(0, 0),
      color: 0x000000,
      alpha: 1,
      blur: 7,
      quality: 15,
    });
    imageContainer.filters = [imageDropShadow];

    // mask용 container 설정
    const imageMaskContainer = new PIXI.Container();
    imageMaskContainer.label = previewLabel.maskContainer;
    imageMaskContainer.mask = maskSprite;

    const imageBlur = new PIXI.BlurFilter({
      antialias: true,
      strength: 10,
      padding: 100,
    });
    const imageColorMatrix = new PIXI.ColorMatrixFilter();
    imageColorMatrix.brightness(0.5, false);

    const sprite = new PIXI.Sprite(defaultImage);
    sprite.label = previewLabel.image;
    setInitPoint(sprite, ratio * 1.5);
    sprite.filters = [imageBlur, imageColorMatrix];

    imageMaskContainer.addChild(sprite);
    imageContainer.addChild(imageMaskContainer);
    app.stage.addChild(imageContainer);

    // 텍스트 설정
    const textContainer = new PIXI.Container({
      label: previewLabel.textContainer,
    });
    const textDropShadow = new DropShadowFilter({
      offset: new PIXI.Point(0, 0),
      color: 0x000000,
      alpha: 1,
      blur: 2,
      quality: 15,
    });
    textContainer.filters = [textDropShadow];
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
      previewLabel.textContainer
    ) as PIXI.Container;
    const text = textContainer.getChildByName(name) as PIXI.Text;
    text.text = value;
  }

  updateImage(app: PIXI.Application, texture: PIXI.Texture) {
    const imageMaskContainer = app.stage
      .getChildByName(previewLabel.imageContainer)
      .getChildByName(previewLabel.maskContainer) as PIXI.Container;
    const image = imageMaskContainer.getChildByName(
      previewLabel.image
    ) as PIXI.Sprite;
    const bgImage = app.stage.getChildByName(
      previewLabel.bgImage
    ) as PIXI.Sprite;
    image.texture = texture;
    bgImage.texture = texture;
    // 이미지의 위치, 크기도 같이 초기화
    const ratio = calculateRatio(texture);

    setInitPoint(image, ratio * 1.5);
    setInitPoint(bgImage, ratio);
  }
}
