<template>
  <div>
    <div class="sidenav-overlay"></div>
    <div class="drag-target"></div>

    <!-- BEGIN: Footer-->
    <footer class="footer footer-static footer-light">
      <p class="clearfix blue-grey lighten-2 mb-0">
        <span class="float-md-left d-block d-md-inline-block mt-25">
          COPYRIGHT &copy; 2019
          <a
            class="text-bold-800 grey darken-2"
            href="https://1.envato.market/pixinvent_portfolio"
            target="_blank"
            >Pixinvent,</a
          >
          All rights Reserved
        </span>
        <span class="float-md-right d-none d-md-block">
          Hand-crafted & Made with
          <i class="feather icon-heart pink"></i>
        </span>
      </p>
      <button
        class="btn btn-primary btn-icon scroll-top"
        type="button"
        @click="scrollToTop"
      >
        <i class="feather icon-arrow-up"></i>
      </button>
    </footer>
    <!-- END: Footer-->
  </div>
</template>

<script>
export default {
  mounted() {
    // Handle scroll event to show/hide the scroll-to-top button
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    // Clean up the event listener
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrollTopButton = document.querySelector('.scroll-top');
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollTopButton.style.display = "block";
      } else {
        scrollTopButton.style.display = "none";
      }
    },
    scrollToTop() {
      // Smooth scroll to the top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}
</script>
