/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useRef, useEffect } from 'react';
import { Events, Event } from 'src/events';
import state from 'src/model/state';

export const calcMiniMap = () => {
  const outerWidth = Math.round(state.view.width * 0.25);
  const outerHeight = Math.round(
    (outerWidth / state.view.width) * state.view.height
  );
  const innerWidth = outerWidth * state.view.scale;
  const innerHeight = outerHeight * state.view.scale;
  const innerOffsetX = Math.round(innerWidth / 2) * -1;
  const innerOffsetY = Math.round(innerHeight / 2) * -1;
  const innerX = outerWidth * (state.view.x / state.view.width);
  const innerY = outerHeight * (state.view.y / state.view.height);

  return {
    outerWidth,
    outerHeight,
    innerWidth,
    innerHeight,
    innerOffsetX,
    innerOffsetY,
    innerX,
    innerY,
  };
};

export default function MiniMap() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outerRef.current && innerRef.current) {
      const updateView = () => {
        const {
          outerWidth,
          outerHeight,
          innerWidth,
          innerHeight,
          innerOffsetX,
          innerOffsetY,
          innerX,
          innerY,
        } = calcMiniMap();

        outerRef.current!.style.cssText = `width:${outerWidth}px;height:${outerHeight}px;`;
        innerRef.current!.style.cssText = `width:${innerWidth}px;height:${innerHeight}px;left:${innerX}px;top:${innerY}px;margin-left:${innerOffsetX}px;margin-top:${innerOffsetY}px;`;

        const outerBounds = outerRef.current!.getBoundingClientRect();
        const innerBounds = innerRef.current!.getBoundingClientRect();

        Events.emit(Event.MiniMapChange, { outerBounds, innerBounds });
      };

      Events.on(Event.UpdateView, updateView);

      updateView();
    }
  }, [outerRef.current, innerRef.current]);

  return (
    <div
      data-id="MiniMap"
      css={css`
        position: absolute;
        left: 10px;
        top: 10px;
      `}
    >
      <div
        data-id="MiniMap-outer"
        ref={outerRef}
        css={css`
          outline: 2px solid white;
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.5);
        `}
      ></div>
      <div
        data-id="MiniMap-inner"
        ref={innerRef}
        css={css`
          outline: 5px solid #ffc500;
          position: absolute;
          background-color: rgba(255, 255, 255, 0.3);
        `}
      ></div>
    </div>
  );
}
