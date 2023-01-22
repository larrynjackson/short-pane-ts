import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getMachineId } from '../../App';
import { UserData } from '../models/UserData';
import { changePassword, resetPassword } from '../middleware/ShortenerApi';

import { useState } from 'react';

const PasswordAdminPage = () => {
  const [userData, setUserData] = useState<UserData>(new UserData());

  const [apiError, setApiError] = useState<string>('');
  const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false);

  const nextAction = 'LOOP';

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

  const handleResetPassword = async (event: any) => {
    event.preventDefault();
    if (userData.userId.length === 0) {
      confirmAlert({
        title: 'Input Data Errors',
        message: 'Enter your email address.',
        buttons: [
          {
            label: 'Continue',
          },
        ],
      });
      return;
    }
    try {
      const dataMap = await resetPassword(userData.userId);
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

  const renderPasswordForm = (
    <>
      {apiError && <div className="error">{apiError}</div>}
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
              <button type="reset">Clear</button>
              <button type="button" onClick={handleResetPassword}>
                Reset Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );

  return (
    <>
      {nextAction === 'LOOP' && (
        <div className="app">
          <div className="login-form">
            <div className="title">Change Password</div>
            {isPasswordSubmitted && <div className="success">success</div>}
            {renderPasswordForm}
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordAdminPage;
