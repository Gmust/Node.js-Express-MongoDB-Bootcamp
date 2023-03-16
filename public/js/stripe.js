const stripe = Stripe('pk_test_51MlDhLCjjVsEhy3P7KO6pOiVMAxsZc1wYFTKYjL4Fl27m8cZE8C6dRh7VYxU1HVKTxgF521QQFiCPnQQZHdbFtpH00886oPDS3');
import { showAlert } from './alerts.js';

const bookingBtn = document.getElementById('books-tour');

export const bookTour = async tourId => {
  try {
    const session = await axios.get(`/api/v1/booking/checkout-session/${tourId}`);

    console.log(session)

    window.location.replace(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};



