import { showAlert } from './alerts.js';

const logout = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/v1/users/logout');
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

document.querySelector('.nav__el--logout')?.addEventListener('click', logout);

const login = async (loginData) => {
  try {
    const res = await axios.post('http://localhost:8080/api/v1/users/login', loginData);

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

document.querySelector('.form--login').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login({ email, password });
});

