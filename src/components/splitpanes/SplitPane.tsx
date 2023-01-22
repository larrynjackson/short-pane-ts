import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import QuoteContext from '../shortcontext/QuoteContext';
import TagContext from '../shortcontext/TagContext';
import SplitPaneContext from '../shortcontext/SplitPaneContext';
import Select, { StylesConfig } from 'react-select';
import { CSSProperties } from 'react';

type SelectObject = {
  value: string;
  label: string;
};

const customControlStyles: CSSProperties = {
  backgroundColor: 'lightyellow',
  borderColor: 'blue',
  width: '250px',
};

const customOptionStyles: CSSProperties = {
  //opacity: 0.5,
  //background: 'blue',
  borderBottom: '1px dotted pink',
  //marginRight: '20px',
  //marginBlock: '20px',

  //color: 'lightblue',
  //backgroundColor: 'lightgray',
  //opacity: 0.5,
  //marginRight: '110px',
  //marginBlock: '20px',
  backgroundSize: '250px',

  //blockSize: '55px',
  maxWidth: '250px',
  borderColor: 'red',
  width: '250px',
};

type IsMulti = false;

const selectStyle: StylesConfig<SelectObject, IsMulti> = {
  option: (provided: any, state: any) => ({
    color: state.isSelected ? 'white' : 'black',
    ...provided,
    ...customOptionStyles,
  }),
  control: (provided) => {
    return {
      ...provided,
      ...customControlStyles,
    };
  },
};

// const selectStyle = {
//   option: (provided: any, state: any) => ({
//     ...provided,

//     // borderBottom: '1px dotted pink',
//     //color: state.isSelected ? 'white' : 'black',
//     //color: 'lightblue',
//     //backgroundColor: 'gray',
//     borderColor: 'blue',
//     width: '250px',
//   }),
//   control: (provided: any, state: any) => ({
//     // none of react-select's styles are passed to <Control />
//     ...provided,
//     color: 'lightblue',
//     backgroundColor: 'lightyellow',
//     borderColor: 'blue',
//     width: '250px',
//     //width: 200,
//   }),
//   singleValue: (provided: any, state: any) => {
//     const opacity = state.isDisabled ? 0.5 : 1;
//     const transition = 'opacity 300ms';

//     return { ...provided, opacity, transition };
//   },
// };

const SplitPane = ({ children, ...props }: any) => {
  const [clientHeight, setClientHeight] = useState<number | null>(null);
  const [clientWidth, setClientWidth] = useState<number | null>(null);
  const yDividerPos = useRef<number | null>(null);
  const xDividerPos = useRef<number | null>(null);

  //console.log('ST children:', children);
  //console.log('ST props:', props);

  const onMouseHoldDown = (e: MouseEvent) => {
    //console.log('mouseHoldDown');
    //console.log('*****************************S holdDown y:', e.clientY);
    //console.log('*********************************S holdDown x:', e.clientX);
    yDividerPos.current = e.clientY;
    xDividerPos.current = e.clientX;
  };

  const onMouseHoldUp = () => {
    //console.log('mouseHoldUp');
    yDividerPos.current = null;
    xDividerPos.current = null;
  };

  const onMouseHoldMove = (e: MouseEvent) => {
    if (!yDividerPos.current && !xDividerPos.current) {
      return;
    }

    setClientHeight(clientHeight! + e.clientY - yDividerPos.current!);
    // console.log(
    //   'S mouseMove setClientH:',
    //   clientHeight! + e.clientY - yDividerPos.current!
    // );
    setClientWidth(clientWidth! + e.clientX - xDividerPos.current!);
    // console.log(
    //   'S mouseMove setClientW:',
    //   clientWidth! + e.clientX - xDividerPos.current!
    // );

    yDividerPos.current = e.clientY;
    //console.log('S mouseMove yDividerPos:', e.clientY);
    xDividerPos.current = e.clientX;
    //console.log('S mouseMove xDividerPos:', e.clientX);
  };

  useEffect(() => {
    document.addEventListener('mouseup', onMouseHoldUp);
    document.addEventListener('mousemove', onMouseHoldMove);

    return () => {
      document.removeEventListener('mouseup', onMouseHoldUp);
      document.removeEventListener('mousemove', onMouseHoldMove);
    };
  });

  return (
    <div {...props}>
      <SplitPaneContext.Provider
        value={{
          clientHeight,
          setClientHeight,
          clientWidth,
          setClientWidth,
          onMouseHoldDown,
        }}
      >
        {children}
      </SplitPaneContext.Provider>
    </div>
  );
};

export const Divider = (props: any) => {
  const { onMouseHoldDown } = useContext(SplitPaneContext);
  return <div {...props} onMouseDown={onMouseHoldDown} />;
};

export const SplitPaneLeft = (props: any) => {
  const topRef = createRef<any>();
  const { clientWidth, setClientWidth } = useContext(SplitPaneContext);

  useEffect(() => {
    if (!clientWidth) {
      setClientWidth(topRef.current.clientWidth / 1.7);
      return;
    }

    topRef.current.style.minWidth = clientWidth + 'px';
    topRef.current.style.maxWidth = clientWidth + 'px';
  }, [clientWidth]);

  return <div {...props} className="split-pane-left" ref={topRef} />;
};

export const SplitPaneRight = (props: any) => {
  const { quotes, quote } = useContext(QuoteContext);
  const { destMap, tag } = useContext(TagContext);
  const squote = quotes.find((el) => el.id === quote!.id);

  console.log('pane tag:', tag);
  console.log('pane dest:', destMap);

  return (
    <>
      <div {...props} className="split-pane-right">
        <div className="app">
          <span>Shortener Code : Destination</span>
          {tag?.label} : {destMap?.get(tag?.value)}
          {/* <blockquote>{squote?.description}</blockquote>—{' '}
          <span>{squote?.author}</span> */}
          {/* <blockquote>{tag?.value}</blockquote>— <span>{tag?.label}</span> */}
        </div>
      </div>
    </>
  );
};

export const SplitPaneTop = (props: any) => {
  const topRef = createRef<any>();
  const { clientHeight, setClientHeight } = useContext(SplitPaneContext);
  const { quotes, setQuote } = useContext(QuoteContext);
  const { destMap, tag, tagArray, setTag, dest, setDest } =
    useContext(TagContext);

  const handleTagSelectChange = (selectedOption: any) => {
    setDest(destMap.get(selectedOption.value));
    setTag(selectedOption);
    console.log('selectedOption:', selectedOption);
  };

  console.log('pane top destMap:', destMap);
  console.log('pane top tag:', tag);
  useEffect(() => {
    if (!clientHeight) {
      setClientHeight(topRef.current.clientHeight / 0.75);
      return;
    }

    topRef.current.style.minHeight = clientHeight + 'px';
    topRef.current.style.maxHeight = clientHeight + 'px';
  }, [clientHeight]);

  return (
    <div {...props} className="split-pane-top" ref={topRef}>
      <h1>Famous quotes:</h1>
      <div className="react-select_control">
        <div style={{ width: '250px' }}>
          <Select
            maxMenuHeight={250}
            menuPlacement="auto"
            value={tag}
            options={tagArray}
            onChange={handleTagSelectChange}
            styles={selectStyle}
          />
        </div>
      </div>
      {/* <ul>
        {quotes.map((el, i) => {
          return (
            <li key={i}>
              <a href="#" onClick={() => setQuote(el)}>
                {el.author}
              </a>
            </li>
          );
        })}
      </ul> */}
    </div>
  );
};

export const SplitPaneBottom = (props: any) => {
  const { quote } = useContext(QuoteContext);
  const { tagArray, tag, destMap } = useContext(TagContext);

  //console.log('SB children:', props.children);
  //console.log('SB props:', props);

  console.log('pane bottom tagArray:', tagArray);
  console.log('pane bottom tag:', tag);
  return (
    <div {...props} className="split-pane-bottom">
      <b>Short Code Test</b>: {tag?.value}
      <div>
        <button
          onClick={(e) => window.open(`http://localhost:8080/${tag?.value}`)}
        >
          <b>http://localhost:8080/{tag?.value}</b>
        </button>
      </div>
    </div>
  );
};

export default SplitPane;
