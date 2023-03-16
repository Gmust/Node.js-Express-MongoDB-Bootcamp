import { showAlert } from './alerts.js';


export const updateSettings = async (data) => {
  try {
    const res = await axios.patch('/api/v1/users/updateMyData', data);

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', 'User successfully updated');
      }, 1500);
    }
    return res;
  } catch (e) {
    setTimeout(() => {
      showAlert('error', e.response.data.message);
    });
  }
};

