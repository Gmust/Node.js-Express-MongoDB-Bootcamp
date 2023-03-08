import { showAlert } from './alerts.js';


const updateSettings = async (data) => {
  try {
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

document.querySelector('.form__upload').addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('email', document.getElementById('email').value);
  updateSettings(formData);
});