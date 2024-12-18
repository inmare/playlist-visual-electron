const videoSize = {
  width: 1920,
  height: 1080,
} as const;

const previewLabel = {
  bgImage: "Background Image",
  audioSpectrum: "Audio Spectrum",
  imageContainer: {
    container: "Image Container",
    image: "Image",
  },
  gradient: "Gradient",
  textContainer: {
    container: "Text Container",
    // TODO: text의 경우에는 기존의 설정이 따로 있고, 그걸 가지고 와야 됨
  },
} as const;

export { videoSize, previewLabel };
