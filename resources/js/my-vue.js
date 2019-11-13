// import reportsForm from './components/reports-form.vue'
import imageCropper from './components/image-cropper.vue'


Vue.config.devtools = false;
Vue.config.debug = false;
Vue.config.silent = true;
const app = new Vue({
    el: '#app',
    mode: 'production',

    components: {
        imageCropper

    }
});
