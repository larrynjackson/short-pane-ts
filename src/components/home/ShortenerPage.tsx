import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from '../splitpanes/SplitPane';
import QuoteContext, { QuoteType } from '../shortcontext/QuoteContext';
import TagContext, { TagOptionType } from '../shortcontext/TagContext';
import { isLoggedin, list, listTag } from '../middleware/ShortenerApi';
import { getMachineId } from '../../App';

//import Select, { StylesConfig } from 'react-select';

import { useState, useEffect, CSSProperties } from 'react';

// type SelectObject = {
//   value: string;
//   label: string;
// };

// const customControlStyles: CSSProperties = {
//   color: 'lightblue',
//   backgroundColor: 'lightyellow',
//   borderColor: 'blue',
//   width: '200px',
// };

// type IsMulti = false;

// const selectStyle: StylesConfig<SelectObject, IsMulti> = {
//   control: (provided) => {
//     return {
//       ...provided,
//       ...customControlStyles,
//     };
//   },
// };

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
  //let tagArray: TagOptionType[] = [];
  //let destMap = new Map();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const [destMap, setDestMap] = useState<any>();
  const [tagArray, setTagArray] = useState<TagOptionType[] | undefined>();
  const [quote, setQuote] = useState<QuoteType>(quotes[0]);
  const [tag, setTag] = useState<TagOptionType | undefined>();
  const [dest, setDest] = useState<string>('');

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

    const getUserCodeDestMap = async () => {
      try {
        const destMap = await list();
        destMap.delete('Error');
        destMap.delete('NextAction');
        console.log('destMap:', destMap);
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

        //setTag(tagArray[0]);
        console.log('userCodeTagMap:', userCodeTagMap);
        console.log('tagArray:', tagArray);
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

  //   const handleTagSelectChange = (selectedOption: any) => {
  //     console.log('selectedOption:', selectedOption);
  //   };

  const renderSplitPanes = (
    <>
      {error && <div className="error">{error}</div>}

      <div className="App">
        <QuoteContext.Provider value={{ quotes, quote, setQuote }}>
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

  //   const renderSelectList = (
  //     <>
  //       <div className="react-select__control">
  //         <Select
  //           options={userCodeTagOptions}
  //           onChange={handleTagSelectChange}
  //           styles={selectStyle}
  //         />
  //       </div>
  //     </>
  //   );

  return (
    <>
      <div className="app">
        {isLoggedIn ? renderSplitPanes : renderNotLoggedIn}
      </div>
    </>
  );
}

export default ShortenerPage;
