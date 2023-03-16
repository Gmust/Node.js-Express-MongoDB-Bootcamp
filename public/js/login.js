import { showAlert } from './alerts.js';


export const logout = async () => {
  try {
    const res = await axios.get('/api/v1/users/logout');
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', 'Logged out successfully!');
        location.assign('/');
      }, 1500);
    } else {
      location.reload(true);
    }
    return res;
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};


export const login = async (loginData) => {
  try {
    const res = await axios.post('/api/v1/users/login', loginData);

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', 'Logged in successfully!');
        location.assign('/');
      }, 1500);
    }
    return res;
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};

