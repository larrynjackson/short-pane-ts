import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getMachineId } from '../../App';
import { UserData } from '../models/UserData';
import { changePassword, isLoggedin } from '../middleware/ShortenerApi';

import { useState, useEffect } from 'react';

const PasswordAdminPage = () => {
  const [userData, setUserData] = useState<UserData>(new UserData());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false);

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

  const handlePasswordChange = (event: any) => {
    const { type, name, value } = event.target;
    let updatedValue = value;
    if (type === 'number') {
      updatedValue = Number(updatedValue);
    }
    const change = {
      [name]: updatedValue,
    };
    let addNewUser: UserData = new UserData();
    setUserData((nu) => {
      addNewUser = new UserData({ ...nu, ...change });
      return addNewUser;
    });
  };

  const handlePasswordSubmit = async (event: any) => {
    event.preventDefault();
    if (
      userData.userId.length === 0 ||
      userData.pwdOne.length === 0 ||
      userData.pwdTwo.length === 0 ||
      userData.pwdThree.length === 0 ||
      userData.pwdTwo !== userData.pwdThree
    ) {
      confirmAlert({
        title: 'Input Data Errors',
        message: 'Incomplete data or password mismatch.',
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
      formData.append('User', userData.userId);
      formData.append('Password', userData.pwdOne);
      formData.append('PassCode', userData.pwdTwo);
      formData.append('MachineId', `${machineId}`);
      const dataMap = await changePassword(formData);
      setApiError(dataMap.get('Error'));

      if (dataMap.get('Error') === '') {
        setIsPasswordSubmitted(true);
      } else {
        setIsPasswordSubmitted(false);
      }
    } catch (event) {
      if (event instanceof Error) {
        setApiError(event.message);
      }
    }
  };

  const handleClear = () => {
    setUserData(new UserData());
  };

  const renderPasswordForm = (
    <>
      <div className="form">
        <form onSubmit={handlePasswordSubmit}>
          <div className="input-container">
            <input
              type="email"
              name="userId"
              placeholder="someone@example.com"
              onChange={handlePasswordChange}
            />
            <input
              type="password"
              name="pwdOne"
              placeholder="Enter password"
              onChange={handlePasswordChange}
            />
            <input
              type="password"
              name="pwdTwo"
              placeholder="Enter new password"
              onChange={handlePasswordChange}
            />
            <input
              type="password"
              name="pwdThree"
              placeholder="Re-enter new password"
              onChange={handlePasswordChange}
            />
            <div className="button-container">
              <input type="submit" />
            </div>
            <div className="button-container">
              <button type="reset" onClick={handleClear}>
                Clear
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
            <div className="title">Change Password</div>
            {apiError && <div className="error">{apiError}</div>}
            {isPasswordSubmitted && <div className="success">success</div>}
            {renderPasswordForm}
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordAdminPage;
