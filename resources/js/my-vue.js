// import reportsForm from './components/reports-form.vue'
import quizUploader from './components/quiz-uploader.vue'
import imageUploader from './components/image-uploader.vue'
import wallpaperCards from './components/wallpaper-cards.vue'
import quizzes from './components/quizzes.vue'
import quizEditor from './components/quiz-editor.vue'
import refs from './components/refs.vue'
import refEditor from './components/ref-editor.vue'


Vue.config.devtools = false;
Vue.config.debug = false;
Vue.config.silent = true;
const app = new Vue({
    el: '#app',
    mode: 'production',

    components: {
        imageUploader,
        quizUploader,
        wallpaperCards,
        quizzes,
        quizEditor,
        refs,
        refEditor,

    }
});
