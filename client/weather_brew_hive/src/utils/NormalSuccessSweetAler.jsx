import Swal from 'sweetalert2';

export default function NormalSuccessSweetAlert(message) {
  Swal.fire({
    icon: 'success',
    title: 'Successful',
    text: message,
  });
}
