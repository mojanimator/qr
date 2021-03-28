// import reportsForm from './components/reports-form.vue'
import quizUploader from './components/quiz-uploader.vue'
import imageUploader from './components/image-uploader.vue'
import wallpaperCards from './components/wallpaper-cards.vue'
import quizzes from './components/quizzes.vue'
import quizEditor from './components/quiz-editor.vue'
import refs from './components/refs.vue'
import refEditor from './components/ref-editor.vue'
import refUploader from './components/ref-uploader.vue'
import events from './components/events.vue'
import eventUploader from './components/event-uploader.vue'
import profileUploader from './components/profile-uploader.vue'


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
        refUploader,
        refs,
        refEditor,
        eventUploader,
        events,
        profileUploader,

    }
});
