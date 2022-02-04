/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import MapView from 'src/components/map/view';
import MiniMap from 'src/components/map/miniMap';

export default function MapContainer() {
  return (
    <div
      data-id="MapContainer"
      css={css`
        overflow: hidden;
        outline: 1px solid red;
        width: 100%;
        height: 100%;
      `}
    >
      <MapView />
      <MiniMap />
    </div>
  );
}
