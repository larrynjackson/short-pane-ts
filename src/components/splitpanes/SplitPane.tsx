import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import TagContext from '../shortcontext/TagContext';
import SplitPaneContext from '../shortcontext/SplitPaneContext';
import Select from 'react-select';
import { SelectStyle } from '../css/ReactSelect';
import '../css/splitPane.css';

const SplitPane = ({ children, ...props }: any) => {
  const [clientHeight, setClientHeight] = useState<number | null>(null);
  const [clientWidth, setClientWidth] = useState<number | null>(null);
  const yDividerPos = useRef<number | null>(null);
  const xDividerPos = useRef<number | null>(null);

  const onMouseHoldDown = (e: MouseEvent) => {
    yDividerPos.current = e.clientY;
    xDividerPos.current = e.clientX;
  };

  const onMouseHoldUp = () => {
    yDividerPos.current = null;
    xDividerPos.current = null;
  };

  const onMouseHoldMove = (e: MouseEvent) => {
    if (!yDividerPos.current && !xDividerPos.current) {
      return;
    }

    setClientHeight(clientHeight! + e.clientY - yDividerPos.current!);
    setClientWidth(clientWidth! + e.clientX - xDividerPos.current!);

    yDividerPos.current = e.clientY;
    xDividerPos.current = e.clientX;
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
  }, [clientWidth, setClientWidth, topRef]);

  return <div {...props} className="split-pane-left" ref={topRef} />;
};

export const SplitPaneRight = (props: any) => {
  const { destMap, tag } = useContext(TagContext);

  return (
    <>
      <div {...props} className="split-pane-right">
        <div className="app">
          <span>Shortener Code : Destination</span>
          <span>{tag?.label}</span>
          <div className="flex-container">
            <p>{destMap?.get(tag?.value)} </p>
          </div>
        </div>
      </div>
    </>
  );
};

export const SplitPaneTop = (props: any) => {
  const topRef = createRef<any>();
  const { clientHeight, setClientHeight } = useContext(SplitPaneContext);
  const { destMap, tag, tagArray, setTag, setDest } = useContext(TagContext);

  const handleTagSelectChange = (selectedOption: any) => {
    setDest(destMap.get(selectedOption.value));
    setTag(selectedOption);
  };

  useEffect(() => {
    if (!clientHeight) {
      setClientHeight(topRef.current.clientHeight / 0.75);
      return;
    }

    topRef.current.style.minHeight = clientHeight + 'px';
    topRef.current.style.maxHeight = clientHeight + 'px';
  }, [clientHeight, setClientHeight, topRef]);

  return (
    <div {...props} className="split-pane-top" ref={topRef}>
      <h1>Short Links</h1>
      <div className="react-select_control">
        <div style={{ width: '250px' }}>
          <Select
            maxMenuHeight={250}
            menuPlacement="auto"
            value={tag}
            options={tagArray}
            onChange={handleTagSelectChange}
            styles={SelectStyle}
          />
        </div>
      </div>
    </div>
  );
};

export const SplitPaneBottom = (props: any) => {
  const { tagArray, tag } = useContext(TagContext);
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
