import Swal from 'sweetalert2';

export default function SuccessSweetAlert(message) {
  Swal.fire({
    icon: 'success',
    title: 'Payment is successfull',
    text: message,
  });
}
