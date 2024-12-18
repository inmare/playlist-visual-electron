import { Song } from "@ts/song";
import "@scss/SongItem.scss";

export default function SongItem(props: {
  song: Song;
  index: number;
  songIdx: number;
  updateSong: (index: number) => void;
}) {
  const { song, index, updateSong } = props;

  return (
    <div
      key={index}
      className={
        "song-item" + (index === props.songIdx ? " song-item-selected" : "")
      }
      onClick={() => {
        updateSong(index);
      }}
    >
      <p>
        <span>{index + 1}. </span>
        <span>{song.songname}</span>
      </p>
    </div>
  );
}
