import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getMachineId } from '../../App';
import { DestinationData } from '../models/DestinationData';

import { isLoggedin, addDest } from '../middleware/ShortenerApi';

import { useState, useEffect } from 'react';

const AddDestinationPage = () => {
  const [destinationData, setDestinationData] = useState<DestinationData>(
    new DestinationData()
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const [isDestinationAdded, setIsDestinationAdded] = useState(false);

  const nextAction = 'LOOP';

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
    checkIsLoggedIn();
  }, []);

  const handleDestinationChange = (event: any) => {
    const { type, name, value } = event.target;
    let updatedValue = value;
    if (type === 'number') {
      updatedValue = Number(updatedValue);
    }
    const change = {
      [name]: updatedValue,
    };
    let destinationData: DestinationData = new DestinationData();
    setDestinationData((nd) => {
      destinationData = new DestinationData({ ...nd, ...change });
      return destinationData;
    });
  };

  const handleDestinationSubmit = async (event: any) => {
    event.preventDefault();
    if (destinationData.destination.length === 0) {
      confirmAlert({
        title: 'Input Data Errors',
        message: 'Invalid destination url',
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
      formData.append('Destination', destinationData.destination);
      formData.append('Tag', destinationData.tag);
      formData.append('MachineId', `${machineId}`);
      const dataMap = await addDest(formData);
      setApiError(dataMap.get('Error'));
      if (dataMap.get('Error') === '') {
        setIsDestinationAdded(true);
      } else {
        setIsDestinationAdded(false);
      }
    } catch (event) {
      if (event instanceof Error) {
        setApiError(event.message);
      }
    }
  };

  const renderDestinationForm = (
    <>
      {apiError && <div className="error">{apiError}</div>}
      <div className="form">
        <form onSubmit={handleDestinationSubmit}>
          <div className="input-container">
            <input
              type="text"
              name="destination"
              placeholder="destination URL"
              onChange={handleDestinationChange}
            />
            <input
              type="text"
              name="tag"
              placeholder="Enter tag"
              onChange={handleDestinationChange}
            />

            <div className="button-container">
              <input type="submit" />
            </div>
            <div className="button-container">
              <button type="reset">Clear</button>
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
            <div className="title">New Destination</div>
            {isDestinationAdded && <div className="success">success</div>}
            {renderDestinationForm}
          </div>
        </div>
      )}
    </>
  );
};

export default AddDestinationPage;
