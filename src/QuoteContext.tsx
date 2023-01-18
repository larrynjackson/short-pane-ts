import { useState, createContext } from 'react';
import { quotes } from './App';

export type QuoteType = {
  id: number;
  author: string;
  description: string;
};

export type QuoteContextType = {
  quotes: QuoteType[];
  quote: QuoteType;
  setQuote: React.Dispatch<React.SetStateAction<QuoteType>>;
};

export type QuoteContextProviderProps = {
  children: React.ReactNode;
};

const QuoteContext = createContext({} as QuoteContextType);

export const QuoteContextProvider = ({
  children,
}: QuoteContextProviderProps) => {
  const [quote, setQuote] = useState<QuoteType>(quotes[0]);
  return (
    <QuoteContext.Provider value={{ quotes, quote, setQuote }}>
      {children}
    </QuoteContext.Provider>
  );
};
export default QuoteContext;
