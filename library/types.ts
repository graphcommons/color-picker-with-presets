export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type Transparent = {
  r: 255,
  g: 255,
  b: 255,
  a: 0,
};

export type Invalid = {
  r: -1,
  g: -1,
  b: -1,
  a: -1,
};

export type Gradient = {
  direction:  "to-right" | "to-bottom";
  colors: RGBA[];
};

export type Point = {
  x: number;
  y: number;
}

export type Invisible = Point & {
  x: -1;
  y: -1;
}

export type Preset = {
  key: string;
  label: string;
  colors: RGBA[];
  keepHistory: boolean;
};
