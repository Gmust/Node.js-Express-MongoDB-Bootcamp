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

document.querySelector('.form-user-data').addEventListener('change', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('photo', document.getElementById('photo').files[0]);
  const newImage = await updateSettings(formData);

  if (newImage) {
    document.querySelector('.nav__user-img')
      .setAttribute('src', `/img/users/${newImage.data.data.user.photo}`);
    document.querySelector('.form__user-photo')
      .setAttribute('src', `/img/users/${newImage.data.data.user.photo}`);
  }
});