import { showAlert } from './alerts.js';

export const updatePassword = async (passwordCurrent, password, passwordConfirm) => {
  try {
    const data = {
      passwordCurrent,
      password,
      passwordConfirm
    };

    const res = await axios.patch('http://localhost:8080/api/v1/users/updateMyPassword', data);

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', 'Password successfully updated');
      }, 1500);
    }

    return res;
  } catch (e) {
    window.setTimeout(() => {
      showAlert('error', e.response.data.message);
    }, 1500);
  }
};

