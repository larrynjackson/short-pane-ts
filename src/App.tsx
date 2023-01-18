import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from './SplitPane';
import QuoteContext, { QuoteType } from './QuoteContext';
//import SplitPaneContext, { SplitPaneContextType } from './SplitPaneContext';
import { useState } from 'react';

import './App.css';

export const quotes = [
  {
    id: 1,
    author: 'Nelson Mandela',
    description:
      'The greatest glory in living lies not in never falling, but in rising every time we fall.',
  },
  {
    id: 2,
    author: 'Walt Disney',
    description: 'The way to get started is to quit talking and begin doing.',
  },
  {
    id: 3,
    author: 'Oprah Winfrey',
    description:
      "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
  },
];
function App() {
  const [quote, setQuote] = useState<QuoteType>(quotes[0]);

  // const [clientHeight, setClientHeight] = useState<number | null>(null);
  // const [clientWidth, setClientWidth] = useState<number | null>(null);
  // const [xDividerPos, setXdividerPos] = useState<number | null>(null);
  // const [yDividerPos, setYdividerPos] = useState<number | null>(null);

  return (
    <div className="App">
      <QuoteContext.Provider value={{ quotes, quote, setQuote }}>
        <SplitPane className="split-pane-row" sp="A">
          <SplitPaneLeft>
            <SplitPane className="split-pane-col" sp="B">
              <SplitPaneTop />
              <Divider className="separator-row" sp="C" />
              <SplitPaneBottom />
            </SplitPane>
          </SplitPaneLeft>
          <Divider className="separator-col" sp="D" />

          <SplitPaneRight />
        </SplitPane>
      </QuoteContext.Provider>
    </div>
  );
}

export default App;
