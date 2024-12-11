interface Song {
  songname: string;
  songnameKor: string | null;
  composer: string;
  comment: string;
  nickname: string;
  startTime: number;
  endTime: number;
  [key: string]: string | number | null;
}

const TextInput: (keyof Song)[] = [
  "songname",
  "songnameKor",
  "composer",
  "comment",
  "nickname",
];

export { Song, TextInput };
