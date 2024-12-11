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

  return (
    <>
      <div className="settings">
        <p>이미지 파일</p>
        {textList.map((item: TextInput, index: number) => {
          const content =
            songIdx < 0 || songs[songIdx][item.value] == null
              ? ""
              : songs[songIdx][item.value];
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
