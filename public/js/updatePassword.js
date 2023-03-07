import { showAlert } from './alerts.js';

const updatePassword = async (passwordCurrent, password, passwordConfirm) => {
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

document.querySelector('.form-user-settings').addEventListener('submit', async (e) => {
  e.preventDefault();

  document.querySelector('.btn--save-password').textContent = 'Updating...';

  const passwordCurrent = document.getElementById('password-current').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;
  await updatePassword(passwordCurrent, password, passwordConfirm);

  document.querySelector('.btn--save-password').textContent = 'Save password';
  document.getElementById('password-current').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password-confirm').value = '';

});