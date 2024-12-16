import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import "@scss/App.scss";
import Settings from "@components/Settings";
import SongItem from "./SongItem";
import { Preview } from "@ts/preview";
import { Project } from "@ts/project";
import { Song, TextInput } from "@ts/song";

const defaultSongs: Song[] = [
  {
    songname: "[Cube]",
    songnameKor: null,
    composer: "Dr.Yun (윤박사)",
    comment: "[Cube]의 코멘트",
    nickname: "이드",
    startTime: 0,
    endTime: 10,
  },
  {
    songname: "からくりピエロ",
    songnameKor: "꼭두각시 피에로",
    composer: "40mP",
    comment: "からくりピエロ의 코멘트",
    nickname: "강매",
    startTime: 10,
    endTime: 20,
  },
];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(undefined);
  const appRef = useRef<PIXI.Application>(undefined);
  const divRef = useRef<HTMLDivElement>(undefined);
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
      const div = divRef.current;
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

  const handlePreviewText = (name: string, value: string) => {
    const app = appRef.current;
    if (!app) return;

    preview.updateText(app, name, value);
  };

  const handlePreviewImage = (canvas: HTMLCanvasElement) => {
    const app = appRef.current;
    if (!app) return;

    preview.updateImage(app, canvas);
  };

  const handleProject = (songIdx: number, name: string, value: string) => {
    project.updateProject(songs, songIdx, name, value);
  };

  const handleSong = (index: number) => {
    setSongIdx(index);
    const song: Song = songs[index];

    const app = appRef.current;
    if (!app) return;

    for (const key in song) {
      if (TextInput.includes(key as keyof Song)) {
        const value = song[key] == null ? "" : song[key];
        handlePreviewText(key, value as string);
      }
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="preview-wrapper" ref={divRef}>
          <canvas
            ref={canvasRef}
            style={{ width: canvasStyle.width, height: canvasStyle.height }}
          />
        </div>
        <div className="settings-wrapper">
          <Settings
            songs={songs}
            songIdx={songIdx}
            updateProject={handleProject}
            updatePreviewText={handlePreviewText}
            updatePreviewImage={handlePreviewImage}
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
