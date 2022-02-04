import { Texture, Resource } from 'pixi.js';

export const keys = [
  'red',
  'green',
  'blue',
  'grape',
  'mocha',
  'ice',
  'iron',
  'strawberry',
  'banana',
];

export const textures: Map<string, Texture<Resource>> = new Map();

export const randomTexture = () => {
  const key = randomColor();
  const texture = textures.get(key);
  return texture;
};

export const randomColor = () => {
  const index = Math.round(Math.random() * (keys.length - 1));
  const key = keys[index];
  return key;
};
