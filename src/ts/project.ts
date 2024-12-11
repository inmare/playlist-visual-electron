import { Song } from "./song";

export class Project {
  constructor(private setSongs: (songs: Song[]) => void) {}

  // addSong(song: Song) {
  //   this.songs.push(song);
  // }

  // updateProject(key: SongProperty, value: string) {
  //   const song = { ...this.songs[0] };
  //   song[key] = value;
  //   this.setSongs([song]);
  // }

  updateProject(songs: Song[], songIdx: number, name: string, value: string) {
    const song: Song[] = [...songs];
    song[songIdx][name] = value;
    this.setSongs(song);
  }
}
