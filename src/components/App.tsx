import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";

import Settings from "@components/Settings";
import SongItem from "@components/SongItem";
import Preview from "@ts/preview";
import Project from "@ts/project";
import { Song, SongText, TextInput } from "@ts/song";
import { ImageValue } from "@ts/config";

import "@scss/App.scss";
import DefaultImage from "@assets/images/DefaultImage.png";

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

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(undefined);
  const appRef = useRef<PIXI.Application>(undefined);
  const previewRef = useRef<HTMLDivElement>(undefined);
  const [songs, setSongs] = useState<Song[]>(defaultSongs);
  const [songIdx, setSongIdx] = useState(-1);
  const [canvasStyle, setCanvasStyle] = useState({
    width: undefined,
    height: undefined,
  });

  const project = new Project(setSongs);
  const preview = new Preview();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!appRef.current) {
      appRef.current = new PIXI.Application();
      const app = appRef.current;

      preview.init(app, canvas);
    }

    const handleResize = () => {
      const div = previewRef.current;
      if (!div) return;

      const isWidthBigger = div.clientWidth / div.clientHeight > 16 / 9;

      setCanvasStyle({
        width: isWidthBigger ? "" : "95%",
        height: isWidthBigger ? "95%" : "",
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  const handleSong = (index: number) => {
    setSongIdx(index);
    const song: Song = songs[index];

    const app = appRef.current;
    if (!app) return;

    for (const key in TextInput) {
      const isValueExist = song[key as keyof SongText] == null;
      const value: string = isValueExist ? "" : song[key as keyof SongText];
      preview.updateText(app, key, value);
    }

    preview.updateImage(app, song.texture);
  };

  return (
    <>
      <div className="wrapper">
        <div className="preview-wrapper" ref={previewRef}>
          <canvas ref={canvasRef} style={{ ...canvasStyle }} />
        </div>
        <div className="settings-wrapper">
          <Settings
            songs={songs}
            songIdx={songIdx}
            appRef={appRef}
            preview={preview}
            project={project}
          />
        </div>
        <div className="song-list-wrapper">
          {songs.map((song: Song, index: number) => {
            return (
              <SongItem
                key={index}
                song={song}
                index={index}
                songIdx={songIdx}
                updateSong={handleSong}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
