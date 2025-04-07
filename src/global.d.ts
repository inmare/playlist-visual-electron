declare global {
  interface Window {
    electronAPI: {
      loadImage: () => Promise<string | null>;
      saveCanvas: (buffer: Uint8Array) => void;
    };
  }
}

export {};
