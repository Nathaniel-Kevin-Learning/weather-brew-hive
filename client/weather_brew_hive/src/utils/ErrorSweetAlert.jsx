import Swal from 'sweetalert2';

export default function ErrorSweetAlert(error = 'there is something wrong') {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: error,
  });
}
