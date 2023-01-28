import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getMachineId } from '../../App';
import { UserData } from '../models/UserData';

import { login, logOut, resetPassword } from '../middleware/ShortenerApi';

import { useState } from 'react';

const LoginPage = () => {
  const [userData, setUserData] = useState<UserData>(new UserData());

  const [apiError, setApiError] = useState<string>('');
  const [nextAction, setNextAction] = useState<string>('LOGIN');
  const [isLoginSubmitted, setIsLoginSubmitted] = useState(false);
  //const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false);

  const handleLoginChange = (event: any) => {
    const { type, name, value } = event.target;
    let updatedValue = value;
    if (type === 'number') {
      updatedValue = Number(updatedValue);
    }
    const change = {
      [name]: updatedValue,
    };
    let loginUser: UserData = new UserData();
    setUserData((nu) => {
      loginUser = new UserData({ ...nu, ...change });
      return loginUser;
    });
  };

  const handleLogOut = async (event: any) => {
    const machineId = getMachineId();
    const formData = new FormData();
    formData.append('MachineId', `${machineId}`);
    const dataMap = await logOut(formData);
    setApiError(dataMap.get('Error'));
  };

  const handleLoginSubmit = async (event: any) => {
    event.preventDefault();
    if (userData.userId.length === 0 || userData.pwdOne.length === 0) {
      confirmAlert({
        title: 'Input Data Errors',
        message: 'Invalid username or password',
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
      const dataMap = await login(formData);
      setApiError(dataMap.get('Error'));
      if (dataMap.get('NextAction') === 'SHORTENER') {
        setNextAction(dataMap.get('NextAction'));
        setIsLoginSubmitted(true);
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

      // if (dataMap.get('Error') === '') {
      //   setIsPasswordSubmitted(true);
      // } else {
      //   setIsPasswordSubmitted(false);
      // }
    } catch (event) {
      if (event instanceof Error) {
        setApiError(event.message);
      }
    }
  };

  const renderLoginForm = (
    <>
      {apiError && <div className="error">{apiError}</div>}
      <div className="form">
        <form onSubmit={handleLoginSubmit}>
          <div className="input-container">
            <input
              type="email"
              name="userId"
              placeholder="someone@example.com"
              onChange={handleLoginChange}
            />
            <input
              type="password"
              name="pwdOne"
              placeholder="Enter password"
              onChange={handleLoginChange}
            />

            <div className="button-container">
              <input type="submit" />
            </div>
            <div className="button-container">
              <button type="reset">Clear</button>
              <button type="button" onClick={handleLogOut}>
                Logout
              </button>
            </div>
            <div className="button-container">
              <button type="button" onClick={handleResetPassword}>
                Reset Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );

  const renderSuccessScreen = <div></div>;

  return (
    <>
      {nextAction === 'LOGIN' && (
        <div className="app">
          <div className="login-form">
            <div className="title">Login</div>
            {isLoginSubmitted ? renderSuccessScreen : renderLoginForm}
          </div>
        </div>
      )}

      {nextAction === 'SHORTENER' && (
        <div className="app">
          <div className="login-form">
            <div className="title">Login Successful</div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
