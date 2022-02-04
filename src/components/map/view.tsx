/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useEffect, useRef } from 'react';
import { Events, Event } from 'src/events';
import { useGesture } from '@use-gesture/react';
import state from 'src/model/state';

document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());

const scaleFactor = 0.1;
const scaleMin = 0.25;
const scaleMax = 5;

const setScale = (value: number) => {
  state.view.scale = Math.max(scaleMin, Math.min(scaleMax, value));
  Events.emit(Event.UpdateView);
};

export default function MapView() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      Events.emit(Event.Mount, ref.current);
    }
  }, [ref.current]);

  const bind = useGesture(
    {
      onDragStart: args => {
        state.drag.startX = state.view.x;
        state.drag.startY = state.view.y;
      },
      onDrag: args => {
        if (args.pinching) {
          return;
        }
        const deltaX =
          state.drag.endX === undefined
            ? args.offset[0]
            : args.offset[0] - state.drag.endX;
        const deltaY =
          state.drag.endY === undefined
            ? args.offset[1]
            : args.offset[1] - state.drag.endY;
        state.view.x = state.drag.startX + deltaX;
        state.view.y = state.drag.startY + deltaY;
        Events.emit(Event.UpdateView);
      },
      onDragEnd: args => {
        state.drag.endX = args.offset[0];
        state.drag.endY = args.offset[1];
      },
      onPinch: args => {
        setScale(args.offset[0]);
        Events.emit(Event.UpdateView);
      },
      onWheel: args => {
        const deltaY = args.delta[1];
        if (deltaY > 0) {
          setScale(state.view.scale + scaleFactor);
        } else if (deltaY < 0) {
          setScale(state.view.scale - scaleFactor);
        }
      },
    },
    {}
  );

  return (
    <div
      data-id="MapView"
      {...bind()}
      ref={ref}
      css={css`
        touch-action: none;
        overflow: hidden;
        width: 100%;
        height: 100%;
      `}
    ></div>
  );
}
