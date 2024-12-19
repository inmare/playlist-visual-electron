import * as PIXI from "pixi.js";
import { DropShadowFilter } from "pixi-filters";
import DefaultImage from "@assets/images/DefaultImage.png";
import { calculateRatio, getLineLength } from "@ts/utils";
import {
  VideoSize,
  PreviewLabel,
  TextPosition,
  TextSetting,
  TextConfig,
  TextOrder,
  TextStyle,
  FontWeight,
} from "@ts/config";

const createMask = () => {
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = VideoSize.width;
  maskCanvas.height = VideoSize.height;
  const maskContext = maskCanvas.getContext("2d");
  maskContext.fillStyle = "#ffffff";
  maskContext.beginPath();
  maskContext.moveTo(0, 0);
  maskContext.lineTo(VideoSize.width * 0.8, 0);
  maskContext.lineTo(VideoSize.width * 0.65, VideoSize.height);
  maskContext.lineTo(0, VideoSize.height);
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
    new PIXI.Point(VideoSize.width / 2, VideoSize.height / 2)
  );
  sprite.position.set(initPoint.x, initPoint.y);
};

const getImages = (app: PIXI.Application): PIXI.Sprite[] => {
  const imageMaskContainer = app.stage
    .getChildByName(PreviewLabel.imageContainer)
    .getChildByName(PreviewLabel.maskContainer) as PIXI.Container;
  const image = imageMaskContainer.getChildByName(
    PreviewLabel.image
  ) as PIXI.Sprite;
  const bgImage = app.stage.getChildByName(PreviewLabel.bgImage) as PIXI.Sprite;
  return [image, bgImage];
};

export default class Preview {
  async init(app: PIXI.Application, canvas: HTMLCanvasElement) {
    app.init({
      canvas: canvas,
      width: VideoSize.width,
      height: VideoSize.height,
      backgroundColor: 0x000000,
      antialias: true,
    });
    // 기본 이미지 로드 및 비율 계산
    const defaultImage = await PIXI.Assets.load(DefaultImage);
    const ratio = calculateRatio(defaultImage);
    // 배경 이미지 설정
    const bgSprite = new PIXI.Sprite(defaultImage);
    bgSprite.label = PreviewLabel.bgImage;
    setInitPoint(bgSprite, ratio);
    app.stage.addChild(bgSprite);

    // 마스크 설정
    const maskTexture = createMask();
    const maskSprite = new PIXI.Sprite(maskTexture);

    // drop shadow용 제일 밖 container 설정
    const imageContainer = new PIXI.Container();
    imageContainer.label = PreviewLabel.imageContainer;
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
    imageMaskContainer.label = PreviewLabel.maskContainer;
    imageMaskContainer.mask = maskSprite;

    const imageBlur = new PIXI.BlurFilter({
      antialias: true,
      strength: 10,
      padding: 100,
    });
    const imageColorMatrix = new PIXI.ColorMatrixFilter();
    imageColorMatrix.brightness(0.5, false);

    const sprite = new PIXI.Sprite(defaultImage);
    sprite.label = PreviewLabel.image;
    setInitPoint(sprite, ratio * 1.5);
    sprite.filters = [imageBlur, imageColorMatrix];

    imageMaskContainer.addChild(sprite);
    imageContainer.addChild(imageMaskContainer);
    app.stage.addChild(imageContainer);

    const audioSpectrumContainer = new PIXI.Container();
    audioSpectrumContainer.label = PreviewLabel.audioSpectrum;

    const spectrumWidth = 1;
    const spectrumFunc = (i: number) => {
      return (
        (Math.sin(i / (16 * Math.PI)) +
          Math.sin(i / (2 * 16 * Math.PI) - 4 / Math.PI) +
          Math.sin(i / (4 * 16 * Math.PI) + 4 / Math.PI) +
          3) *
        50
      );
    };

    for (let i = 0; i < VideoSize.width; i++) {
      const spectrum = new PIXI.Graphics();
      spectrum.fillStyle = 0xffffff;
      spectrum.rect(
        i * spectrumWidth - VideoSize.width / 2,
        -spectrumFunc(i),
        spectrumWidth + 1,
        spectrumFunc(i)
      );
      spectrum.fill();
      audioSpectrumContainer.addChild(spectrum);
    }

    audioSpectrumContainer.rotation = Math.atan(
      (0 - VideoSize.height) / (VideoSize.width * 0.8 - VideoSize.width * 0.65)
    );
    audioSpectrumContainer.position.set(
      (VideoSize.width * (0.8 + 0.65)) / 2,
      VideoSize.height / 2
    );
    audioSpectrumContainer.alpha = 0.15;

    app.stage.addChild(audioSpectrumContainer);

    // 텍스트 설정
    const textContainer = new PIXI.Container({
      label: PreviewLabel.textContainer,
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

    TextOrder.forEach((value: keyof typeof TextConfig, index: number) => {
      const textSetting: TextSetting = TextConfig[value];
      const textStyle = new PIXI.TextStyle({
        fontFamily: "Pretendard JP Variable",
        fill: 0xffffff,
        fontSize: textSetting.singleLine.fontSize,
        fontWeight: textSetting.singleLine.fontWeight,
        lineHeight: textSetting.singleLine.lineHeight,
      });

      const text = new PIXI.Text({
        text: (textSetting.prefix ?? "") + (textSetting.text ?? ""),
        style: textStyle,
        label: value,
      });

      text.position.x = textSetting.x;
      if (textSetting.yPosType === TextPosition.absolute) {
        text.position.y = textSetting.y;
      } else if (textSetting.yPosType === TextPosition.relative) {
        const prevTextConfig = TextConfig[TextOrder[index - 1]];
        const prevPixiText = textContainer.getChildByName(
          prevTextConfig.label
        ) as PIXI.Text;
        const lineLength = getLineLength(prevPixiText.text);
        let prevTextHeight: number;
        if (lineLength > 1) {
          prevTextHeight = lineLength * prevTextConfig.multiLine.lineHeight;
        } else {
          const prevText = prevPixiText.text;
          prevTextHeight =
            prevText === "" ? 0 : prevTextConfig.singleLine.lineHeight;
        }
        text.position.y =
          prevPixiText.position.y + prevTextHeight + textSetting.y;
      }

      textContainer.addChild(text);
    });
  }

  updateText(app: PIXI.Application, name: string, textValue: string) {
    const textContainer = app.stage.getChildByName(
      PreviewLabel.textContainer
    ) as PIXI.Container;

    const changedTextIdx = TextOrder.findIndex((text) => text === name);

    TextOrder.forEach((value: keyof typeof TextConfig, index: number) => {
      if (index < changedTextIdx) return;

      const textSetting: TextSetting = TextConfig[value];
      const text = textContainer.getChildByName(value) as PIXI.Text;

      if (index === changedTextIdx) {
        text.text = (textSetting.prefix ?? "") + textValue;
        const getStyle = (key: keyof TextStyle) => {
          return getLineLength(textValue) > 1 && textSetting.multiLine
            ? textSetting.multiLine[key]
            : textSetting.singleLine[key];
        };
        text.style.fontSize = getStyle("fontSize") as number;
        text.style.fontWeight = getStyle("fontWeight") as FontWeight;
        text.style.lineHeight = getStyle("lineHeight") as number;
      }

      text.position.x = textSetting.x;
      if (textSetting.yPosType === TextPosition.absolute) {
        text.position.y = textSetting.y;
      } else if (textSetting.yPosType === TextPosition.relative) {
        const prevSetting = TextConfig[TextOrder[index - 1]];
        const prevPixiText = textContainer.getChildByName(
          prevSetting.label
        ) as PIXI.Text;
        const prevText = prevPixiText.text;
        const lineLength = getLineLength(prevText);
        const isPrevMultiLine = lineLength > 1 && prevSetting.multiLine;
        let prevTextHeight: number;
        if (isPrevMultiLine) {
          prevTextHeight = lineLength * prevSetting.multiLine.lineHeight;
        } else {
          prevTextHeight =
            prevText === "" ? 0 : prevSetting.singleLine.lineHeight;
        }
        text.position.y =
          prevPixiText.position.y + prevTextHeight + textSetting.y;
      }
    });
  }

  updateImage(app: PIXI.Application, texture: PIXI.Texture) {
    const [image, bgImage] = getImages(app);
    image.texture = texture;
    bgImage.texture = texture;
    // 이미지의 위치, 크기도 같이 초기화
    const ratio = calculateRatio(texture);

    setInitPoint(image, ratio * 1.5);
    setInitPoint(bgImage, ratio);
  }

  updateImagePos(app: PIXI.Application, pos: number) {
    const [image, bgImage] = getImages(app);
    const imagePoint = calcPoint(
      image,
      new PIXI.Point(pos, VideoSize.height / 2)
    );
    const bgImagePoint = calcPoint(
      bgImage,
      new PIXI.Point(pos, VideoSize.height / 2)
    );

    image.position.set(imagePoint.x, imagePoint.y);
    bgImage.position.set(bgImagePoint.x, bgImagePoint.y);
  }
}
