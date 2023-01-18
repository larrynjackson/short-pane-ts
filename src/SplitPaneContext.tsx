import React from 'react';

export interface ISplitPaneContext {
  clientHeight: number | null;
  setClientHeight: React.Dispatch<React.SetStateAction<number | null>>;
  clientWidth: number | null;
  setClientWidth: React.Dispatch<React.SetStateAction<number | null>>;
  onMouseHoldDown: (e: MouseEvent) => void;
}

const SplitPaneContext = React.createContext<ISplitPaneContext>(
  {} as ISplitPaneContext
);
export default SplitPaneContext;
