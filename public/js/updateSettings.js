import { showAlert } from './alerts.js';

const updateSettings = async (name, email) => {
  try {

    const data = {
      name,
      email
    };

    const res = await axios.patch('http://localhost:8080/api/v1/users/updateMyData', data);


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

document.querySelector('.form-user-data').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  updateSettings(name, email);
});