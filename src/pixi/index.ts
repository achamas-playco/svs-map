import * as PIXI from 'pixi.js';
import { defaultViewHeight, defaultViewWidth } from 'src/model/state';
import { keys, textures } from 'src/colors';
import { Events, Event } from 'src/events';
import MapView from 'src/model/mapView';

export function createPIXIApplication() {
  const app = new PIXI.Application({
    width: defaultViewWidth,
    height: defaultViewHeight,
    backgroundColor: 0x110000,
  });

  keys.forEach(texture => app.loader.add(texture, `img/colors/${texture}.png`));

  app.loader.load((_, resources) => {
    keys.forEach(textureKey => {
      const texture = resources[textureKey].texture;
      if (texture) {
        textures.set(textureKey, texture);
      }
    });

    new MapView();
  });

  Events.on(Event.Mount, (element: HTMLElement) => {
    element.appendChild(app.renderer.view);
    app.resizeTo = element;
  });

  return app;
}

const app = createPIXIApplication();

export default app;
