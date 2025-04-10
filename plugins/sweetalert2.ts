import Swal from 'sweetalert2';

export default defineNuxtPlugin(nuxtApp => {
  Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  nuxtApp.provide('swal', Swal);
});
