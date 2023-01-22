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
}

const TagContext = React.createContext<ITagContext>({} as ITagContext);
export default TagContext;
