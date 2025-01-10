import { createContext, useReducer, JSX } from "react";
import { Song, SongText } from "@ts/song";
import { ImageValue } from "@ts/config";
import DefaultImage from "@assets/images/DefaultImage.png";
import * as PIXI from "pixi.js";

const defaultSongs: Song[] = [
  {
    songname: "[Cube]",
    songnameKor: null,
    composer: "Dr.Yun (윤박사)",
    comment: "[Cube]의 코멘트",
    nickname: "이드",
    startTime: 0,
    endTime: 10,
    url: null,
    texture: null,
    imgPos: ImageValue.default,
  },
  {
    songname: "からくりピエロ",
    songnameKor: "꼭두각시 피에로",
    composer: "40mP",
    comment: "からくりピエロ의 코멘트",
    nickname: "강매",
    startTime: 10,
    endTime: 20,
    url: null,
    texture: null,
    imgPos: ImageValue.default,
  },
];

PIXI.Assets.load(DefaultImage).then((texture) => {
  for (const song of defaultSongs) {
    song.texture = texture;
  }
});

export const SongsContext = createContext(null);
export const SongsDispatchContext = createContext(null);

export function SongsProvider({ children }: { children: JSX.Element }) {
  const [songs, dispatch] = useReducer(playlistReducer, defaultSongs);

  return (
    <SongsContext.Provider value={songs}>
      <SongsDispatchContext.Provider value={dispatch}>
        {children}
      </SongsDispatchContext.Provider>
    </SongsContext.Provider>
  );
}

function playlistReducer(
  songs: Song[],
  action: {
    type: string;
    index: number;
    value: Record<keyof Song, any>;
  }
): Song[] {
  switch (action.type) {
    case "text": {
      const song: Song[] = [...songs];
      song[action.index] = { ...song[action.index], ...action.value };
      return song;
    }
    case "image": {
      const song: Song[] = [...songs];
      song[action.index] = { ...song[action.index], ...action.value };
      return song;
    }
    case "imagePos": {
      const song: Song[] = [...songs];
      song[action.index] = { ...song[action.index], ...action.value };
      return song;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
