import { StylesConfig } from 'react-select';
import { CSSProperties } from 'react';

type SelectObject = {
  value: string;
  label: string;
};

const CustomControlStyles: CSSProperties = {
  backgroundColor: 'white',
  borderColor: 'black',
  width: '250px',
};

const CustomOptionStyles: CSSProperties = {
  backgroundSize: '250px',
  maxWidth: '250px',
  borderColor: 'red',
  width: '250px',
};

type IsMulti = false;

export const SelectStyle: StylesConfig<SelectObject, IsMulti> = {
  option: (provided: any, state: any) => ({
    color: state.isSelected ? 'white' : 'black',
    ...provided,
    ...CustomOptionStyles,
  }),
  control: (provided) => {
    return {
      ...provided,
      ...CustomControlStyles,
    };
  },
};
