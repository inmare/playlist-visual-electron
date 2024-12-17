import { Song, SongText } from "./song";
import * as PIXI from "pixi.js";
import { loadImage } from "./utils";

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

  updateText(
    songs: Song[],
    songIdx: number,
    name: keyof SongText,
    value: string
  ) {
    const song: Song[] = [...songs];
    song[songIdx][name] = value;
    this.setSongs(song);
  }

  async updateImage(songs: Song[], songIdx: number, filePath: string) {
    const song: Song[] = [...songs];
    song[songIdx].url = filePath;

    const canvas = await loadImage(filePath);
    const texture = PIXI.Texture.from(canvas);
    song[songIdx].texture = texture;

    this.setSongs(song);
  }
}
