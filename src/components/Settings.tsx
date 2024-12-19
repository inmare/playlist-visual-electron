import * as PIXI from "pixi.js";

import Preview from "@ts/preview";
import Project from "@ts/project";
import InputTextarea from "@components/InputTextarea";
import { Song, SongText, TextInput } from "@ts/song";

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
  };

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
          <div>
            <label htmlFor="">이미지 위치</label>
            <span className="image-pos">0px</span>
          </div>
          <div className="range-wrapper">
            <input
              type="range"
              name=""
              id=""
              onChange={(event) => {
                console.log(event.target.value);
              }}
            />
            <div
              style={{
                width: "100%",
                height: "10px",
                backgroundColor: "#ff0000",
              }}
            ></div>
          </div>
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
