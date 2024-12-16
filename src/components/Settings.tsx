import SettingInput from "@components/SettingInput";
import { Song } from "@/ts/song";
import "@scss/Settings.scss";
import { loadImage } from "@/ts/utils";
import { useState } from "react";

export default function Settings(props: {
  songs: Song[];
  songIdx: number;
  updateProject: (songIdx: number, name: string, value: string) => void;
  updatePreviewText: (name: string, value: string) => void;
  updatePreviewImage: (canvas: HTMLCanvasElement) => void;
}) {
  const {
    songs,
    songIdx,
    updateProject,
    updatePreviewText,
    updatePreviewImage,
  } = props;

  const [imagePath, setImagePath] = useState<string>("이미지 경로");

  const handleUpdate = (name: string, value: string) => {
    updateProject(songIdx, name, value);
    updatePreviewText(name, value);
  };

  type TextInput = {
    ui: string;
    value: string;
  };

  const textList: TextInput[] = [
    {
      ui: "곡 제목",
      value: "songname",
    },
    {
      ui: "번역된 곡 제목",
      value: "songnameKor",
    },
    {
      ui: "작곡가",
      value: "composer",
    },
    {
      ui: "코멘트",
      value: "comment",
    },
    {
      ui: "닉네임",
      value: "nickname",
    },
  ];

  const handleFileInput = async () => {
    const fileName = await window.electronAPI.loadImage();
    if (!fileName) return;

    setImagePath(fileName);
    const canvas = await loadImage(fileName);
    updatePreviewImage(canvas);
  };

  return (
    <>
      <div className="settings">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <button
            onClick={handleFileInput}
            style={{ color: "#ffffff", backgroundColor: "blue" }}
          >
            이미지 파일
          </button>
          <textarea
            // name=""
            // id=""
            disabled
            rows={1}
            value={imagePath}
            style={{ resize: "none" }}
          />
        </div>
        {textList.map((item: TextInput, index: number) => {
          let content = "";
          if (songIdx >= 0) {
            content = (songs[songIdx][item.value] as string) ?? "";
          }
          return (
            <SettingInput
              key={String(index)}
              uiText={item.ui}
              value={item.value}
              content={content as string}
              update={handleUpdate}
            />
          );
        })}
      </div>
    </>
  );
}
