<template>

    <div class="col row ">

        <div v-for="g in groups" class="  col-md-6  ">
            <div class="my-3 mx-1 p-2 m-card no-radius  ">
                <div v-for="name,idx in g.name" class="">
                    <div v-if="idx===0" class="text-dark-blue font-weight-bold px-2 m-card-header">{{name}}</div>
                    <div v-else="" class="  my-1   pl-3 py-1 hoverable-dark m-card-body">{{name}}</div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>


    export default {
        props: ['groups',],
        data() {
            return {}
        },

        computed: {},


        mounted() {
        },
        created() {

        }
        ,
        beforeDestroy() {
        }
        ,
        updated() {

        }
        ,
        methods: {
            detachGroups() {

            },

        },


    }


</script>
<style>


</style>