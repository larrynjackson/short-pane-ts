import React from 'react';

export type TagOptionType = {
  value: string;
  label: string;
};

export interface ITagContext {
  dest: string;
  setDest: React.Dispatch<React.SetStateAction<string>>;
  destMap: any;
  setDestMap: React.Dispatch<React.SetStateAction<any>>;
  tagArray: TagOptionType[] | undefined;
  setTagArray: React.Dispatch<
    React.SetStateAction<TagOptionType[] | undefined>
  >;
  tag: TagOptionType | undefined;
  setTag: React.Dispatch<React.SetStateAction<TagOptionType | undefined>>;

  // clientHeight: number | null;
  // setClientHeight: React.Dispatch<React.SetStateAction<number | null>>;
  // clientWidth: number | null;
  // setClientWidth: React.Dispatch<React.SetStateAction<number | null>>;
  // onMouseHoldDown: (e: MouseEvent) => void;
}

const TagContext = React.createContext<ITagContext>({} as ITagContext);
export default TagContext;

// import { useState, createContext, useEffect } from 'react';
// import { list, listTag } from '../middleware/ShortenerApi';

// export type TagOptionType = {
//   value: string;
//   label: string;
// };

// export type TagContextType = {
//   destMap: any;
//   tagArray: TagOptionType[];
//   tag: TagOptionType;
//   setTag: React.Dispatch<React.SetStateAction<TagOptionType>>;
// };

// export type TagContextProviderProps = {
//   children: React.ReactNode;
// };

// const TagContext = createContext({} as TagContextType);

// export const TagContextProvider = ({ children }: TagContextProviderProps) => {
//   // let tagArray: TagOptionType[] = [];
//   // let destMap = new Map();

//   // useEffect(() => {
//   //   const getUserCodeDestMap = async () => {
//   //     try {
//   //       destMap = await list();
//   //       destMap.delete('Error');
//   //       destMap.delete('NextAction');
//   //       console.log('destMap:', destMap);
//   //     } catch (event) {
//   //       if (event instanceof Error) {
//   //         console.log('destMapError:', event.message);
//   //       }
//   //     }
//   //   };

//   //   const getUserCodeTagMap = async () => {
//   //     try {
//   //       const userCodeTagMap = await listTag();
//   //       userCodeTagMap.delete('Error');
//   //       userCodeTagMap.delete('NextAction');
//   //       tagArray = Array.from(userCodeTagMap, function (entry) {
//   //         if (entry[1] === '') {
//   //           entry[1] = 'NoTag';
//   //         }
//   //         return { value: entry[0], label: entry[0] + ' => ' + entry[1] };
//   //       });
//   //       console.log('userCodeTagMap:', userCodeTagMap);
//   //       console.log('tagArray:', tagArray);
//   //     } catch (event) {
//   //       if (event instanceof Error) {
//   //         console.log('codeTagMapError:', event.message);
//   //       }
//   //     }
//   //   };
//   //   getUserCodeDestMap();
//   //   getUserCodeTagMap();
//   // }, []);

//   const [tag, setTag] = useState<TagOptionType>(tagArray[0]);

//   return (
//     <TagContext.Provider value={{ destMap, tagArray, tag, setTag }}>
//       {children}
//     </TagContext.Provider>
//   );
// };
// export default TagContext;
