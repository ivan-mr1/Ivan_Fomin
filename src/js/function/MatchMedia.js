const pxToRem = (pixels) => {
  return pixels / 16;
};

const MatchMedia = {
  mobile: window.matchMedia(`(width <= ${pxToRem(767.98)}rem)`),
};

export default MatchMedia;
