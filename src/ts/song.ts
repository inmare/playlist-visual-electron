import * as PIXI from "pixi.js";

interface SongText {
  songname: string;
  songnameKor: string | null;
  composer: string;
  comment: string;
  nickname: string;
}

const TextInput: Record<keyof SongText, keyof SongText> = {
  songname: "songname",
  songnameKor: "songnameKor",
  composer: "composer",
  comment: "comment",
  nickname: "nickname",
} as const;

interface SongTime {
  startTime: number;
  endTime: number;
}

interface SongImage {
  url: string | null;
  texture: PIXI.Texture | null;
}

type Song = SongText & SongTime & SongImage;

export { Song, SongText, TextInput };
