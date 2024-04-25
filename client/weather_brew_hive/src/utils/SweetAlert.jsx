import Swal from 'sweetalert2';

export default function SweetAlert(message) {
  Swal.fire({
    icon: 'info',
    title: 'Payment Info',
    text: message,
  });
}
