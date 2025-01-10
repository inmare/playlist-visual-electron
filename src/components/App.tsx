import { useEffect, useRef, useState, useReducer, useContext } from "react";
import * as PIXI from "pixi.js";
import { SongsContext, SongsProvider } from "./SongsProvider";
import Settings from "@components/Settings";
import SongList from "./SongList";
import Preview from "@ts/preview";
import { Song, SongText, TextInput } from "@ts/song";
import "@scss/App.scss";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(undefined);
  const appRef = useRef<PIXI.Application>(undefined);
  const previewRef = useRef<HTMLDivElement>(undefined);

  const songs = useContext(SongsContext);
  const [songIdx, setSongIdx] = useState(-1);
  const [canvasStyle, setCanvasStyle] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!appRef.current) {
      appRef.current = new PIXI.Application();
      const app = appRef.current;

      Preview.init(app, canvas);
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
      Preview.updateText(app, key, value);
    }

    Preview.updateImage(app, song.texture);
  };

  return (
    <>
      <div className="wrapper">
        <div className="preview-wrapper" ref={previewRef}>
          <canvas ref={canvasRef} style={{ ...canvasStyle }} />
        </div>
        <div className="settings-wrapper">
          <Settings songIdx={songIdx} appRef={appRef} />
        </div>
        <SongList songIdx={songIdx} handleSong={handleSong} />
      </div>
    </>
  );
}
