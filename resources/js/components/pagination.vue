<template>

    <ul class="justify-content-center pagination">

        <!--first/previouse-->

        <template v-if=" paginator.current_page===1">
            <li class="page-item disabled ">
                <span class="page-link link-first  " aria-hidden="true">&laquo;</span>
            </li>
            <li class="page-item disabled">
                <span class="page-link  " aria-hidden="true">&lsaquo;</span>
            </li>
        </template>

        <template v-else-if=" paginator.current_page > 1">
            <li class="page-item">
                <a class="page-link link-first" aria-label="First" @click="$root.$emit('paginate_click',{'page':1})">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>

            <li class="page-item">
                <a class="page-link" aria-label="Previous"
                   @click="$root.$emit('paginate_click',{'page':paginator.current_page-1})">
                    <span aria-hidden="true">&lsaquo;</span>
                </a>
            </li>
        </template>

        <!--links-->

        <li v-for="i in this.range(this.from,this.to)" class="page-item "
            :class="{' active' :  paginator.current_page===i }">
            <a class="page-link" @click="$root.$emit('paginate_click',{'page':i})">
                {{ i }}
            </a>
        </li>

        <!-- next/last -->

        <template v-if="paginator.current_page < paginator.last_page">
            <li class="page-item">
                <a class="page-link" aria-label="Next"
                   @click="$root.$emit('paginate_click',{'page':paginator.current_page+1})">
                    <span aria-hidden="true">&rsaquo;</span>
                </a>
            </li>

            <li class="page-item">
                <a class="page-link link-last" aria-label="Last"
                   @click="$root.$emit('paginate_click',{'page':paginator.last_page})">
                    <span aria-hidden="true">{{paginator.last_page}}</span>
                </a>
            </li>
        </template>
        <!--disable next/last-->
        <template v-else-if="paginator.current_page >= paginator.last_page">
            <li class="page-item disabled">
                <a class="page-link" aria-label="Next">
                    <span aria-hidden="true">&rsaquo;</span>
                </a>
            </li>

            <li class="page-item disabled">
                <a class="page-link link-last " aria-label="Last">
                    <span aria-hidden="true">{{paginator.last_page}}</span>
                </a>
            </li>
        </template>

    </ul>

</template>

<script>


    export default {
        components: {},
        data() {
            return {
                paginator: {},
                interval: 3,
                from: 0,
                to: -1,
            }
        },
        props: [],
        mounted() {


        },
        created() {
            this.setEvents();
        },

        methods: {
            setEvents() {
                this.$root.$on('paginationChange', (paginator) => {
                    this.paginator = paginator;
                    this.from = this.paginator.current_page - this.interval;
                    if (this.from < 1)
                        this.from = 1;
                    this.to = this.paginator.current_page + this.interval;
                    if (this.to > this.paginator.last_page)
                        this.to = this.paginator.last_page;

//                    console.log(this.from, this.to);

                });
            },
            range(from, to) {
                let array = [],
                    j = 0;
                for (let i = from; i <= to; i++) {
                    array[j] = i;
                    j++;
                }
                return array;
            }
        }
    }

</script>