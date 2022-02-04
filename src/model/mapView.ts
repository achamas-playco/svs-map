import { Container, Sprite } from 'pixi.js';
import app from 'src/pixi';
import state from 'src/model/state';
import { Event, Events } from 'src/events';
import { textures, randomColor } from 'src/colors';

const margin = {
  horizontal: 1,
  vertical: 1,
};

export default class MapView {
  cells: Sprite[] = [];
  container: Container = new Container();
  color: string = randomColor();

  constructor() {
    this.doLayout();
    app.stage.addChild(this.container);

    Events.on(Event.MiniMapChange, this.onMiniMapChange);
  }

  doLayout() {
    const { view, item } = state;
    const sqrt = Math.sqrt(item.count);
    const columns = Math.round(sqrt);
    const rows = Math.ceil(sqrt);
    const availableWidth = view.width - margin.horizontal * 2;
    const availableHeight = view.height - margin.vertical * 2;
    const cellWidth =
      (availableWidth - margin.horizontal * (columns - 1)) / columns;
    const cellHeight = (availableHeight - margin.vertical * (rows - 1)) / rows;
    const left = 0;
    const top = 0;

    let x = left;
    let y = top;
    let id = 0;

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      x = left;
      for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        if (Math.random() < 0.2) {
          this.color = randomColor();
        }
        const cell = this.newCell(x, y, cellWidth, cellHeight);
        this.cells.push(cell);
        x += cellWidth + margin.horizontal;
        ++id;
        if (id === item.count) {
          break;
        }
      }
      y += cellHeight + margin.vertical;
    }
  }

  purge() {
    if (this.cells.length) {
      this.cells.forEach(cell => {
        this.container.removeChild(cell);
        cell.destroy();
      });
    }
    this.cells = [];
  }

  newCell(x: number, y: number, width: number, height: number) {
    const texture = textures.get(this.color);
    const sprite = new Sprite(texture);

    sprite.interactive = state.item.interactive;
    sprite.x = x;
    sprite.y = y;
    sprite.width = width;
    sprite.height = height;

    const onMouseOver = () => {};

    const onMouseOut = () => {};

    sprite
      .on('mouseover', onMouseOver)
      .on('touchstart', onMouseOver)
      .on('touchend', onMouseOut)
      .on('mouseout', onMouseOut);

    this.container.addChild(sprite);

    return sprite;
  }

  onMiniMapChange = ({
    outerBounds,
    innerBounds,
  }: {
    outerBounds: DOMRect;
    innerBounds: DOMRect;
  }) => {
    const { container } = this;

    const x =
      ((innerBounds.left - outerBounds.left) / outerBounds.width) *
      state.view.width;

    const y =
      ((innerBounds.top - outerBounds.top) / outerBounds.height) *
      state.view.height;

    container.scale.x = this.container.scale.y = state.view.scale;
    container.x = x;
    container.y = y;
  };
}
