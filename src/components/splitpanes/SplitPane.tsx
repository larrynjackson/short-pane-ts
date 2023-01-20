import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import QuoteContext from '../shortcontext/QuoteContext';
import SplitPaneContext from '../shortcontext/SplitPaneContext';

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

  //console.log('D props:', props);
  //console.log('D onMouseHoldDown:', onMouseHoldDown);

  return <div {...props} onMouseDown={onMouseHoldDown} />;
};

export const SplitPaneLeft = (props: any) => {
  const topRef = createRef<any>();
  const { clientWidth, setClientWidth } = useContext(SplitPaneContext);

  useEffect(() => {
    if (!clientWidth) {
      setClientWidth(topRef.current.clientWidth / 2);
      return;
    }

    topRef.current.style.minWidth = clientWidth + 'px';
    topRef.current.style.maxWidth = clientWidth + 'px';
  }, [clientWidth]);

  return <div {...props} className="split-pane-left" ref={topRef} />;
};

export const SplitPaneRight = (props: any) => {
  const { quotes, quote } = useContext(QuoteContext);
  const squote = quotes.find((el) => el.id === quote!.id);

  return (
    <div {...props} className="split-pane-right">
      <div className="quote">
        <blockquote>{squote?.description}</blockquote>—{' '}
        <span>{squote?.author}</span>
      </div>
    </div>
  );
};

export const SplitPaneTop = (props: any) => {
  const topRef = createRef<any>();
  const { clientHeight, setClientHeight } = useContext(SplitPaneContext);
  const { quotes, setQuote } = useContext(QuoteContext);

  useEffect(() => {
    if (!clientHeight) {
      setClientHeight(topRef.current.clientHeight);
      return;
    }

    topRef.current.style.minHeight = clientHeight + 'px';
    topRef.current.style.maxHeight = clientHeight + 'px';
  }, [clientHeight]);

  return (
    <div {...props} className="split-pane-top" ref={topRef}>
      <h1>Famous quotes:</h1>
      <ul>
        {quotes.map((el, i) => {
          return (
            <li key={i}>
              <a href="#" onClick={() => setQuote(el)}>
                {el.author}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const SplitPaneBottom = (props: any) => {
  const { quote } = useContext(QuoteContext);
  //console.log('SB children:', props.children);
  //console.log('SB props:', props);

  return (
    <div {...props} className="split-pane-bottom">
      Current <b>quote id</b>: {quote.id}
    </div>
  );
};

export default SplitPane;
