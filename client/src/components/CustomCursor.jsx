import { useEffect } from 'react';
import useFluidCursor from '../hooks/useFluidCursor';

const FluidCursor = () => {
  useEffect(() => {
    useFluidCursor();
  }, []);

  return (
    <canvas id="fluid" className="fluid-canvas" />
  );
};

export default FluidCursor;
