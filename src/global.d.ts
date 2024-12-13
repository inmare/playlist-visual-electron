declare global {
  interface Window {
    electronAPI: {
      loadImage: () => Promise<string | null>;
    };
  }
}
