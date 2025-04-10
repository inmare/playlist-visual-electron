import { defaultValue } from "pixi.js";

enum ElementType {
  Square,
  Text,
  Image,
}

type NumberPairControl = {
  default: [number, number];
};

type NumberControl = {
  default: number;
};

type Element = {
  name: string; // 요소 이름
  editable: boolean; // 수정 가능 여부
};

type SquareElement = Element & {
  type: ElementType.Square;
};

// 이미지 요소 중 컨트롤이 가능한 요소
// TODO: 좌표, 스케일 처럼 한번에 2개의 요소를 컨트롤 해야하는 경우 추가
type ImageElement = Element & {
  type: ElementType.Image;
  url: string | null; // 이미지 URL
  pos: NumberPairControl; // 이미지 위치
  scale: NumberPairControl; // 이미지 크기
};

// 텍스트 요소 중 컨트롤이 가능한 요소
type TextElement = Element & {
  type: ElementType.Text;
  text: string; // 텍스트 내용
  pos: NumberPairControl; // 텍스트 위치
  fontSize: NumberControl; // 폰트 크기
  inputRow: number; // 입력창의 줄 수
};

type PossibleElement = SquareElement | ImageElement | TextElement;

type Template = {
  project: {
    width: number;
    height: number;
    fps: number;
  };
  element: PossibleElement[];
};

const PlaylistTemplate: Template = {
  project: {
    width: 1920,
    height: 1080,
    fps: 30,
  },
  element: [
    {
      name: "배경",
      editable: false,
      type: ElementType.Square,
    },
    {
      name: "제목",
      editable: true,
      type: ElementType.Text,
      text: "제목",
      pos: { default: [0, 0] },
      fontSize: { default: 50 },
      inputRow: 2,
    },
    {
      name: "썸네일",
      editable: true,
      type: ElementType.Image,
      url: null,
      pos: { default: [0, 0] },
      scale: { default: [100, 100] },
    },
  ],
} as const;

export { PlaylistTemplate, Element, ElementType };
