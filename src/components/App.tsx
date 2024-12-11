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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [songs, setSongs] = useState<Song[]>(defaultSongs);
  const [songIdx, setSongIdx] = useState(-1);

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
  }, []);

  const handlePreview = (name: string, value: string) => {
    const app = appRef.current;
    if (!app) return;

    const textContainer = app.stage.getChildByName(
      "Text container"
    ) as PIXI.Container;
    const text = textContainer.getChildByName(name) as PIXI.Text;
    text.text = value;
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
        handlePreview(key, value as string);
      }
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="preview-wrapper">
          <canvas ref={canvasRef} style={{ width: "640px", height: "360px" }} />
        </div>
        <div className="settings-wrapper">
          <Settings
            songs={songs}
            songIdx={songIdx}
            updateProject={handleProject}
            updatePreview={handlePreview}
          />
        </div>
        <div className="song-list-wrapper">
          {songs.map((song: Song, index: number) => {
            return (
              <SongItem
                key={index}
                song={song}
                index={index}
                updateSong={handleSong}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
