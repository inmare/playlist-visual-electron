import { useContext } from "react";
import { SongsContext } from "@/components/SongsProvider";
import SongItem from "@components/SongItem";
import { Song } from "@ts/song";
import "@scss/App.scss";

export default function SongList({
  songIdx,
  handleSong,
}: {
  songIdx: number;
  handleSong: (index: number) => void;
}) {
  const songs = useContext(SongsContext);
  return (
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
  );
}
