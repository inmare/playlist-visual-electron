import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import { PassThrough } from "stream";
import { spawn } from "child_process";
import started from "electron-squirrel-startup";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

ipcMain.on("saveCanvas", (event, buffer: Buffer) => {
  // 이미지 하나 저장
  const filePath = path.join(process.cwd(), "sample.png");
  fs.writeFileSync(filePath, buffer);
  console.log("Saved canvas to", filePath);

  console.log(buffer);

  const imageStream = new PassThrough();
  const ffmpeg = spawn("ffmpeg", [
    "-y",
    "-f",
    "image2pipe", // raw 비디오 입력
    "-vcodec",
    "png", // raw 비디오 코덱
    "-s",
    "1920x1080", // 해상도 (반드시 실제 이미지 크기와 일치해야 함)
    "-r",
    "30", // 프레임 레이트
    "-i",
    "-", // 표준 입력에서 데이터 읽기
    "-pix_fmt",
    "yuv420p", // 출력 픽셀 포맷 (일반적인 비디오 포맷)
    "-c:v",
    "libx264", // H.264 코덱
    "output.mp4", // 출력 파일
  ]);

  imageStream.pipe(ffmpeg.stdin);

  for (let i = 0; i < 30 * 5; i++) {
    imageStream.write(buffer);
  }

  imageStream.end();
});

async function handleFileOpen(): Promise<string | null> {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  // 개발 중인 경우에는 절대 경로를 상대 경로로 변경해서 반환 함
  const isDev = process.env.NODE_ENV === "development";
  if (!canceled) {
    if (isDev) {
      return filePaths[0].replace(process.cwd(), ".");
    }
    return filePaths[0];
  }
  return null;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    console.log(MAIN_WINDOW_VITE_NAME);
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("loadImage", handleFileOpen);
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
