import SettingInput from "@components/SettingInput";
import { Song } from "@/ts/song";
import "@scss/Settings.scss";

export default function Settings(props: {
  songs: Song[];
  songIdx: number;
  updateProject: (songIdx: number, name: string, value: string) => void;
  updatePreview: (name: string, value: string) => void;
}) {
  const { songs, songIdx, updateProject, updatePreview } = props;

  const handleUpdate = (name: string, value: string) => {
    updateProject(songIdx, name, value);
    updatePreview(name, value);
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
    if (fileName) console.log(fileName);
  };

  return (
    <>
      <div className="settings">
        <div
          style={{ color: "#ffffff", backgroundColor: "blue" }}
          onClick={handleFileInput}
        >
          <p>이미지 파일</p>
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
