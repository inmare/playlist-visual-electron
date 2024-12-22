import { TextInput } from "@ts/song";

const VideoSize = {
  width: 1920,
  height: 1080,
} as const;

const PreviewLabel = {
  bgImage: "Background Image",
  audioSpectrum: "Audio Spectrum",
  imageContainer: "Image Container",
  maskContainer: "Mask Container",
  image: "Image",
  flipedImage: "Fliped Image",
  gradient: "Gradient",
  textContainer: "Text Container",
  // TODO: text의 경우에는 기존의 설정이 따로 있고, 그걸 가지고 와야 됨
} as const;

enum TextPosition {
  relative,
  absolute,
}

enum FontWeight {
  thin = "100",
  extraLight = "200",
  light = "300",
  regular = "400",
  medium = "500",
  semiBold = "600",
  bold = "700",
  extraBold = "800",
  black = "900",
}

interface TextStyle {
  fontSize: number;
  fontWeight: FontWeight;
  lineHeight: number;
}

interface TextSetting {
  yPosType: TextPosition;

  x: number;
  y: number;
  label: keyof typeof TextInput | string;
  maxLine?: number;
  singleLine: TextStyle;
  multiLine?: TextStyle;
  text?: string;
  prefix?: string;
}

const answerOfLife = 42;
const titleSuffix = "Title";

const TextConfig: Record<string, TextSetting> = {
  songname: {
    yPosType: TextPosition.absolute,
    x: answerOfLife,
    y: 13,
    label: TextInput.songname,
    maxLine: 2,
    singleLine: {
      fontSize: 139,
      fontWeight: FontWeight.black,
      lineHeight: 139,
    },
    multiLine: {
      fontSize: 82,
      fontWeight: FontWeight.bold,
      lineHeight: 84,
    },
  },
  songnameKor: {
    yPosType: TextPosition.relative,
    x: answerOfLife,
    y: 10,
    label: TextInput.songnameKor,
    maxLine: 2,
    singleLine: {
      fontSize: 65,
      fontWeight: FontWeight.regular,
      lineHeight: 65,
    },
    multiLine: {
      fontSize: 42,
      fontWeight: FontWeight.regular,
      lineHeight: 39,
    },
  },
  composerTitle: {
    yPosType: TextPosition.relative,
    x: answerOfLife,
    y: 34,
    label: TextInput.composer + titleSuffix,
    singleLine: {
      fontSize: 65,
      fontWeight: FontWeight.extraBold,
      lineHeight: 65,
    },
    text: "작곡가",
  },
  composer: {
    yPosType: TextPosition.relative,
    x: answerOfLife,
    y: 10,
    label: TextInput.composer,
    maxLine: 1,
    singleLine: {
      fontSize: 55,
      fontWeight: FontWeight.medium,
      lineHeight: 55,
    },
  },
  commentTitle: {
    yPosType: TextPosition.relative,
    x: answerOfLife,
    y: 20,
    label: TextInput.comment + titleSuffix,
    singleLine: {
      fontSize: 65,
      fontWeight: FontWeight.extraBold,
      lineHeight: 65,
    },
    text: "코멘트",
  },
  comment: {
    yPosType: TextPosition.relative,
    x: answerOfLife,
    y: 10,
    label: TextInput.comment,
    maxLine: 11,
    singleLine: {
      fontSize: 40,
      fontWeight: FontWeight.semiBold,
      lineHeight: 40,
    },
    multiLine: {
      fontSize: 40,
      fontWeight: FontWeight.semiBold,
      lineHeight: 44,
    },
  },
  nickname: {
    yPosType: TextPosition.absolute,
    x: answerOfLife,
    y: 1008,
    label: TextInput.nickname,
    maxLine: 1,
    singleLine: {
      fontSize: 37,
      fontWeight: FontWeight.semiBold,
      lineHeight: 37,
    },
    prefix: "Picked by ",
  },
} as const;

const TextOrder: ReadonlyArray<keyof typeof TextConfig> = [
  TextInput.songname,
  TextInput.songnameKor,
  TextInput.composer + titleSuffix,
  TextInput.composer,
  TextInput.comment + titleSuffix,
  TextInput.comment,
  TextInput.nickname,
];

const ImageValue = {
  min: 960,
  max: 1920,
  default: 960,
};

export {
  VideoSize,
  PreviewLabel,
  TextPosition,
  TextSetting,
  TextStyle,
  TextConfig,
  TextOrder,
  FontWeight,
  ImageValue,
};
