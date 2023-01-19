import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from '../splitpanes/SplitPane';
import QuoteContext, { QuoteType } from '../shortcontext/QuoteContext';
import { isLoggedin } from '../middleware/ShortenerApi';
import { getMachineId } from '../../App';

import { useState, useEffect } from 'react';

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
function ShortenerPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState<QuoteType>(quotes[0]);

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      try {
        const machineId = getMachineId();
        const formData = new FormData();
        formData.append('MachineId', `${machineId}`);
        console.log('formData:', formData);
        const dataMap = await isLoggedin(formData);
        console.log('login dataMap:', dataMap);
        if (dataMap.get('NextAction') === 'SHORTENER') {
          setIsLoggedIn(true);
        }
      } catch (event) {
        if (event instanceof Error) {
          setError(event.message);
        }
      }
    };
    checkIsLoggedIn();
  }, []);

  const renderSplitPanes = (
    <>
      {error && <div className="error">{error}</div>}
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
    </>
  );

  const renderNotLoggedIn = (
    <>
      <div>
        <h1>You must login</h1>
      </div>
    </>
  );

  return (
    <>
      <div className="app">
        {isLoggedIn ? renderSplitPanes : renderNotLoggedIn}
      </div>
    </>
  );
}

export default ShortenerPage;
