import { ChangeEvent, useEffect, useState } from "react";
import * as PIXI from "pixi.js";

import Preview from "@ts/preview";
import Project from "@ts/project";
import InputTextarea from "@components/InputTextarea";
import InputRange from "./InputRange";
import { Song, SongText, TextInput } from "@ts/song";
import { ImageValue } from "@ts/config";

import "@scss/Settings.scss";
import "@scss/SettingInput.scss";

type InputSetting = {
  uiText: string;
  value: keyof SongText;
  cols: number;
};

const textList: InputSetting[] = [
  {
    uiText: "곡 제목",
    value: TextInput.songname,
    cols: 2,
  },
  {
    uiText: "번역된 곡 제목",
    value: TextInput.songnameKor,
    cols: 2,
  },
  {
    uiText: "작곡가",
    value: TextInput.composer,
    cols: 2,
  },
  {
    uiText: "코멘트",
    value: TextInput.comment,
    cols: 8,
  },
  {
    uiText: "닉네임",
    value: TextInput.nickname,
    cols: 1,
  },
] as const;

export default function Settings({
  songs,
  songIdx,
  appRef,
  preview,
  project,
}: {
  songs: Song[];
  songIdx: number;
  appRef: React.RefObject<PIXI.Application>;
  preview: Preview;
  project: Project;
}) {
  const app = appRef.current;

  const handleUpdate = (name: string, value: string) => {
    project.updateText(songs, songIdx, name as keyof SongText, value);
    preview.updateText(app, name, value);
  };

  const handleFileInput = async () => {
    if (songIdx < 0) return;

    const filePath = await window.electronAPI.loadImage();
    if (!filePath) return;

    await project.updateImage(songs, songIdx, filePath);
    const texture = songs[songIdx].texture;
    preview.updateImage(app, texture);
    preview.updateImagePos(app, songs[songIdx].imgPos);
  };

  const [imagePos, setImagePos] = useState(ImageValue.default);

  const handleImagePos = (pos: number) => {
    setImagePos(pos);
    preview.updateImagePos(app, pos);
    project.updateImagePos(songs, songIdx, imagePos);
  };

  useEffect(() => {
    if (songIdx < 0) return;
    const imagePos = songs[songIdx].imgPos;
    setImagePos(imagePos);
    preview.updateImagePos(app, imagePos);
  }, [songIdx]);

  return (
    <>
      <div className="settings">
        <div className="setting-input">
          <button onClick={handleFileInput}>이미지 업로드</button>
          <InputTextarea
            uiText="이미지 경로"
            value="imagePath"
            editable={false}
            content={songIdx < 0 ? "" : songs[songIdx].url ?? ""}
            rows={1}
          />
        </div>
        <div className="setting-input">
          <label htmlFor="">
            이미지 위치 <span className="image-pos">{imagePos}px</span>
          </label>
          <InputRange
            min={ImageValue.min}
            max={ImageValue.max}
            defaultValue={ImageValue.default}
            step={1}
            disabled={songIdx < 0 ? true : false}
            updatePos={handleImagePos}
            songs={songs}
            songIdx={songIdx}
          />
        </div>
        {textList.map((item: InputSetting, index: number) => {
          let content = "";
          if (songIdx >= 0) {
            content = (songs[songIdx][item.value] as string) ?? "";
          }
          const { uiText, value, cols } = item;
          return (
            <div className="setting-input" key={String(index)}>
              <label htmlFor={value}>{uiText}</label>
              <InputTextarea
                uiText={uiText}
                value={value}
                rows={cols}
                content={content}
                editable={songIdx < 0 ? false : true}
                update={handleUpdate}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
