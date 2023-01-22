import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from '../splitpanes/SplitPane';
import TagContext, { TagOptionType } from '../shortcontext/TagContext';
import { isLoggedin, list, listTag } from '../middleware/ShortenerApi';
import { getMachineId } from '../../App';

import { useState, useEffect } from 'react';

function ShortenerPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const [destMap, setDestMap] = useState<any>();
  const [tagArray, setTagArray] = useState<TagOptionType[] | undefined>();
  const [tag, setTag] = useState<TagOptionType | undefined>();
  const [dest, setDest] = useState<string>('');

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      try {
        const machineId = getMachineId();
        const formData = new FormData();
        formData.append('MachineId', `${machineId}`);
        const dataMap = await isLoggedin(formData);
        if (dataMap.get('NextAction') === 'SHORTENER') {
          setIsLoggedIn(true);
        }
      } catch (event) {
        if (event instanceof Error) {
          setError(event.message);
        }
      }
    };

    const getUserCodeDestMap = async () => {
      try {
        const destMap = await list();
        destMap.delete('Error');
        destMap.delete('NextAction');
        setDestMap(destMap);
      } catch (event) {
        if (event instanceof Error) {
          console.log('destMapError:', event.message);
        }
      }
    };

    const getUserCodeTagMap = async () => {
      try {
        const userCodeTagMap = await listTag();
        userCodeTagMap.delete('Error');
        userCodeTagMap.delete('NextAction');
        const tagArray: TagOptionType[] = Array.from(
          userCodeTagMap,
          function (entry) {
            if (entry[1] === '') {
              entry[1] = 'NoTag';
            }
            return { value: entry[0], label: entry[1] + ' => ' + entry[0] };
          }
        );
        setTagArray(tagArray);
        setTag(tagArray[0]);
      } catch (event) {
        if (event instanceof Error) {
          console.log('codeTagMapError:', event.message);
        }
      }
    };

    checkIsLoggedIn();
    getUserCodeDestMap();
    getUserCodeTagMap();
  }, []);

  const renderSplitPanes = (
    <>
      {error && <div className="error">{error}</div>}

      <div className="App">
        <TagContext.Provider
          value={{
            dest,
            setDest,
            destMap,
            setDestMap,
            tagArray,
            setTagArray,
            tag,
            setTag,
          }}
        >
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
        </TagContext.Provider>
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
