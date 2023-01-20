import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getMachineId } from '../../App';
import { UserData } from '../models/UserData';
import '../../shortener.css';
import { addUser, setCode } from '../middleware/ShortenerApi';

import { useState } from 'react';

type userData = {
  userId: string;
  pwdOne: string;
  pwdTwo: string;
};

const CreateUserPage = () => {
  const [userData, setUserData] = useState<UserData>(new UserData());

  const [apiError, setApiError] = useState<string>('');
  const [nextAction, setNextAction] = useState<string>('CREATE_USER');
  const [isRegisterSubmitted, setIsRegisterSubmitted] = useState(false);
  const [isCodeSubmitted, setIsCodeSubmitted] = useState(false);
  const [passCode, setPassCode] = useState<string>('');

  const handleRegisterChange = (event: any) => {
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

  const handleRegisterSubmit = async (event: any) => {
    event.preventDefault();
    if (
      userData.userId.length === 0 ||
      userData.pwdOne.length === 0 ||
      userData.pwdTwo.length === 0 ||
      userData.pwdOne !== userData.pwdTwo
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
      formData.append('MachineId', `${machineId}`);
      console.log('formData:', formData);
      const dataMap = await addUser(formData);

      setApiError(dataMap.get('Error'));
      if (dataMap.get('NextAction') === 'SEND_CODE') {
        setNextAction(dataMap.get('NextAction'));
        setIsRegisterSubmitted(true);
      }
    } catch (event) {
      if (event instanceof Error) {
        setApiError(event.message);
      }
    }
  };

  const handleCodeSubmit = async (event: any) => {
    event.preventDefault();
    if (passCode.length === 0) {
      confirmAlert({
        title: 'Input Data Error',
        message: 'Enter the emailed code.',
        buttons: [
          {
            label: 'Continue',
          },
        ],
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append('PassCode', passCode);

      console.log('formData:', formData);
      const dataMap = await setCode(formData);
      console.log('setCode dataMap:', dataMap);

      setApiError(dataMap.get('Error'));
      if (dataMap.get('NextAction') === 'LOGIN') {
        setNextAction(dataMap.get('NextAction'));
        setIsCodeSubmitted(true);
      }
    } catch (event) {
      if (event instanceof Error) {
        setApiError(event.message);
      }
    }
  };

  const handleCodeChange = (event: any) => {
    const { value } = event.target;
    setPassCode(value);
  };

  const renderRegisterForm = (
    <>
      {apiError && <div className="error">{apiError}</div>}
      <div className="form">
        <form onSubmit={handleRegisterSubmit}>
          <div className="input-container">
            <input
              type="email"
              name="userId"
              placeholder="someone@example.com"
              onChange={handleRegisterChange}
            />
            <input
              type="password"
              name="pwdOne"
              placeholder="Enter password"
              onChange={handleRegisterChange}
            />
            <input
              type="password"
              name="pwdTwo"
              placeholder="Re-enter password"
              onChange={handleRegisterChange}
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

  const renderCodeForm = (
    <>
      {apiError && <div className="error">{apiError}</div>}
      <div className="form">
        <form onSubmit={handleCodeSubmit}>
          <div className="input-container">
            <input
              type="text"
              name="code"
              placeholder="enter code"
              onChange={handleCodeChange}
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

  const renderSuccessScreen = <div></div>;

  return (
    <>
      {nextAction === 'CREATE_USER' && (
        <div className="app">
          <div className="login-form">
            <div className="title">Register New User</div>
            {isRegisterSubmitted ? renderCodeForm : renderRegisterForm}
          </div>
        </div>
      )}
      {nextAction === 'SEND_CODE' && (
        <div className="app">
          <div className="login-form">
            <div className="title">Enter Emailed Code</div>
            {isCodeSubmitted ? renderSuccessScreen : renderCodeForm}
          </div>
        </div>
      )}
      {nextAction === 'LOGIN' && (
        <div className="app">
          <div className="login-form">
            <div className="title">User Created</div>
            <div className="title">Login</div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateUserPage;
