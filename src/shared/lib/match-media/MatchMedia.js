export const pxToRem = (pixels) => {
  return pixels / 16;
};

export const MatchMedia = {
  mobile: window.matchMedia(`(width <= ${pxToRem(767.98)}rem)`),
};
