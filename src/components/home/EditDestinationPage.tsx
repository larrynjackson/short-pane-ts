import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getMachineId } from '../../App';
//import { DestinationData } from '../models/DestinationData';
import '../../shortener.css';
import { TagOptionType } from '../shortcontext/TagContext';
import Select, { StylesConfig } from 'react-select';
import { CSSProperties } from 'react';

import {
  isLoggedin,
  list,
  listTag,
  editDest,
  deleteShortCode,
} from '../middleware/ShortenerApi';

import { useState, useEffect } from 'react';

// type DestinatioData = {
//   destination: string;
//   tag: string;
// };

const EditDestinationPage: React.FC = () => {
  //   const [destinationData, setDestinationData] = useState<DestinationData>(
  //     new DestinationData()
  //   );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [nextAction, setNextAction] = useState<string>('LOOP');
  const [isDestinationModified, setIsDestinationModified] = useState(false);
  const [destMap, setDestMap] = useState<any>();
  const [codeTagMap, setCodeTagMap] = useState<any>();
  const [shortCode, setShortCode] = useState<string>('');
  const [tagArray, setTagArray] = useState<TagOptionType[] | undefined>();
  const [tagOption, setTagOption] = useState<TagOptionType | undefined>();
  const [tag, setTag] = useState<string>('');
  const [destination, setDestination] = useState<string>('');

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
          setApiError(event.message);
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
        const codeTagMap = await listTag();
        codeTagMap.delete('Error');
        codeTagMap.delete('NextAction');
        setCodeTagMap(codeTagMap);
        const tagArray: TagOptionType[] = Array.from(
          codeTagMap,
          function (entry) {
            if (entry[1] === '') {
              entry[1] = 'NoTag';
            }
            return { value: entry[0], label: entry[1] + ' => ' + entry[0] };
          }
        );
        setTagArray(tagArray);
        console.log('userCodeTagMap:', codeTagMap);
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

  const handleDelete = async (event: any) => {
    confirmAlert({
      title: 'Confirm Delete Destination',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const dataMap = await deleteShortCode(shortCode);
              if (dataMap.get('Error') === '') {
                /////////////////////////////////////////
                setApiError('');
                try {
                  const destMap = await list();
                  setApiError(destMap.get('Error'));
                  destMap.delete('Error');
                  destMap.delete('NextAction');
                  console.log('destMap:', destMap);
                  setDestMap(destMap);
                } catch (event) {
                  if (event instanceof Error) {
                    console.log('destMapError:', event.message);
                    setApiError(event.message);
                  }
                }

                try {
                  const userCodeTagMap = await listTag();
                  setApiError(userCodeTagMap.get('Error'));
                  userCodeTagMap.delete('Error');
                  userCodeTagMap.delete('NextAction');
                  const tagArray: TagOptionType[] = Array.from(
                    userCodeTagMap,
                    function (entry) {
                      if (entry[1] === '') {
                        entry[1] = 'NoTag';
                      }
                      return {
                        value: entry[0],
                        label: entry[1] + ' => ' + entry[0],
                      };
                    }
                  );
                  setTagArray(tagArray);
                  //setTagOption(tagArray[0]);
                  console.log('userCodeTagMap:', userCodeTagMap);
                  console.log('tagArray:', tagArray);
                } catch (event) {
                  if (event instanceof Error) {
                    console.log('codeTagMapError:', event.message);
                    setApiError(event.message);
                  }
                }
                if (apiError === '') {
                  setIsDestinationModified(true);
                } else {
                  setIsDestinationModified(false);
                }
                //////////////////////////////////////////
              } else {
                setApiError(dataMap.get('Error'));
                setIsDestinationModified(false);
              }
            } catch (event) {
              if (event instanceof Error) {
                setApiError(event.message);
              }
            }
          },
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const handleDestinationSubmit = async (event: any) => {
    event.preventDefault();
    if (
      destination.length === 0 ||
      tag.length === 0 ||
      shortCode.length === 0
    ) {
      confirmAlert({
        title: 'Input Data Errors',
        message: 'Invalid destination or code',
        buttons: [
          {
            label: 'Continue',
          },
        ],
      });
      return;
    }
    try {
      const machineId = getMachineId();

      const formData = new FormData();
      formData.append('Destination', destination);
      formData.append('Tag', tag);
      formData.append('ShortCode', shortCode);
      formData.append('MachineId', `${machineId}`);
      console.log('formData:', formData);

      const dataMap = await editDest(formData);
      console.log('destination dataMap:', dataMap);
      setApiError(dataMap.get('Error'));
      if (dataMap.get('Error') === '') {
        destMap.set(shortCode, destination);
        codeTagMap.set(shortCode, tag);

        ///////////////////////////
        const tagArray: TagOptionType[] = Array.from(
          codeTagMap,
          function (entry: any) {
            if (entry[1] === '') {
              entry[1] = 'NoTag';
            }
            return { value: entry[0], label: entry[1] + ' => ' + entry[0] };
          }
        );
        setTagArray(tagArray);

        const newTagOption = tagArray.find((o) => o.value === shortCode);
        setTagOption(newTagOption);
        setIsDestinationModified(true);
      } else {
        setIsDestinationModified(false);
      }
    } catch (event) {
      if (event instanceof Error) {
        setApiError(event.message);
      }
    }
  };

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
    borderBottom: '1px dotted pink',
    backgroundSize: '250px',
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

  const onDestChange = (value: string) => {
    setDestination(value);
  };
  const onTagChange = (value: string) => {
    setTag(value);
  };

  const handleTagSelectChange = (selectedOption: any) => {
    setTag(codeTagMap.get(selectedOption.value));
    setShortCode(selectedOption.value);
    setDestination(destMap.get(selectedOption.value));
    console.log('selectedOption:', selectedOption);
  };

  const renderDestinationForm = (
    <>
      {apiError && <div className="error">{apiError}</div>}
      <div className="form">
        <form id="edit-destination-form" onSubmit={handleDestinationSubmit}>
          <div className="react-select_control">
            <div style={{ width: '250px' }}>
              <Select
                maxMenuHeight={250}
                menuPlacement="auto"
                value={tagOption}
                options={tagArray}
                onChange={handleTagSelectChange}
                styles={selectStyle}
              />
            </div>
          </div>

          <div className="input-container">
            <input
              value={destination}
              type="text"
              name="destination"
              placeholder="destination URL"
              onChange={(e) => onDestChange(e.target.value)}
            />
            <input
              value={tag}
              type="text"
              name="tag"
              placeholder="Enter tag"
              onChange={(e) => onTagChange(e.target.value)}
            />

            <div className="button-container">
              <input type="submit" />
            </div>
            <div className="button-container">
              <button type="reset" onClick={handleDelete}>
                Delete Destination
              </button>
            </div>
          </div>
        </form>
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
      {nextAction === 'LOOP' && !isLoggedIn && (
        <div className="app">{renderNotLoggedIn}</div>
      )}

      {nextAction === 'LOOP' && (
        <div className="app">
          <div className="login-form">
            <div className="title">Edit/Delete Destination</div>
            {isDestinationModified && <div className="success">success</div>}
            {renderDestinationForm}
          </div>
        </div>
      )}
    </>
  );
};

export default EditDestinationPage;
