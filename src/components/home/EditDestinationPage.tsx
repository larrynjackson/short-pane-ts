import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getMachineId } from '../../App';
import { TagOptionType } from '../shortcontext/TagContext';
import Select from 'react-select';
import { SelectStyle } from '../css/ReactSelect';

import {
  isLoggedin,
  list,
  listTag,
  editDest,
  deleteShortCode,
} from '../middleware/ShortenerApi';

import { useState, useEffect } from 'react';

const EditDestinationPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [isDestinationModified, setIsDestinationModified] = useState(false);
  const [destMap, setDestMap] = useState<any>();
  const [codeTagMap, setCodeTagMap] = useState<any>();
  const [shortCode, setShortCode] = useState<string>('');
  const [tagArray, setTagArray] = useState<TagOptionType[] | undefined>();
  const [tagOption, setTagOption] = useState<TagOptionType | undefined>();
  const [tag, setTag] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [nextAction, setNextAction] = useState<string>('LOOP');

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
          setApiError(event.message);
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
                setApiError('');
                try {
                  const destMap = await list();
                  setApiError(destMap.get('Error'));
                  destMap.delete('Error');
                  destMap.delete('NextAction');
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
                } catch (event) {
                  if (event instanceof Error) {
                    console.log('codeTagMapError:', event.message);
                    setApiError(event.message);
                  }
                }
                if (apiError === '') {
                  setIsDestinationModified(true);

                  setNextAction('GONE');
                } else {
                  setIsDestinationModified(false);
                }
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
      const dataMap = await editDest(formData);
      setApiError(dataMap.get('Error'));
      if (dataMap.get('Error') === '') {
        destMap.set(shortCode, destination);
        codeTagMap.set(shortCode, tag);

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

  const onDestChange = (value: string) => {
    setDestination(value);
  };
  const onTagChange = (value: string) => {
    setTag(value);
  };

  const handleTagSelectChange = (selectedOption: any) => {
    setTagOption(selectedOption);
    setTag(codeTagMap.get(selectedOption.value));
    setShortCode(selectedOption.value);
    setDestination(destMap.get(selectedOption.value));
  };

  const handleContinue = () => {
    setTagOption(undefined);
    setTag('');
    setDestination('');
    setNextAction('LOOP');
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
                styles={SelectStyle}
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

  const renderDeleteSuccess = (
    <>
      <div>
        <div className="button-container">
          <button type="button" onClick={handleContinue}>
            Continue
          </button>
        </div>
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

      {nextAction === 'GONE' && (
        <div className="app">
          <div className="login-form">
            <div className="title">Edit/Delete Destination</div>
            {isDestinationModified && <div className="success">success</div>}
            {renderDeleteSuccess}
          </div>
        </div>
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
