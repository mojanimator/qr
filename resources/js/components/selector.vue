<template>

    <div class="dropdowns col-12 row  align-items-start">


        <!--                             dropdown hooze               -->
        <div id="sDropdown" class="dropdown-content  col-md-6 col-sm-6">
            <div class="input-group   center-block ">
                <div class="input-group-prepend   btn-group-vertical p-1">
                    <i class="fa fa-search text-primary  "></i>
                </div>
                <input type="text" :placeholder="placeholder" v-model="sData" id="dataInput"
                       class="my-1 py-1 pr-1 form-control border"
                       @focus="openDropdown('h')"
                       @click="openDropdown('h')"
                       @blur="closeDropdown('h')"
                       @keypress.enter="closeDropdown('h')"
                       @keyup="selectData(sData,'key')">
                <div class=" input-group-append  btn-group-vertical   ">
                    <i class=" glyphicon glyphicon-remove text-danger  clear-btn"
                       @click="sData=''; selectData(sData,'clr');getData()"></i>

                    <div v-if="loading">
                        <i class="fas fa-spinner fa-pulse"></i>
                    </div>
                </div>
                <div v-if="newable" class="add-btn input-group-addon  "
                     @click=" selectData(sData,-1);sData=''">

                    <i class="fas fa-plus-square    text-success  "></i>

                </div>

            </div>

            <ul class="list-group mt-2  hide" ref="listItems" id="select-data">
                <li v-for="h,idx in   this.filteredData" class="list-group-item  hooze-items"
                    :id="'h'+idx" :ref="'h'+idx" :key="idx"
                    @mousedown.prevent="sData='';selectData(h,idx)">
                    {{h}}
                </li>


            </ul>
        </div>
        <div class="selected-items col-md-6 col-sm-6">
            <ul class="  mt-2   " id="list-selected">
                <li v-for="s,idx in   selected" class="   selected-item  "
                    :id="'s'+idx" :ref="'s'+idx" :key="'s'+idx">
                    {{s}}

                    <i class=" glyphicon glyphicon-remove text-white  clear-btn p-1"
                       @click=" unselect(s) "
                    ></i>

                </li>

            </ul>
        </div>

    </div>

</template>

<script>

    let selectedBefore = false;
    export default {
        props: ['dataLink', 'for', 'multi', 'selectedBefore', 'newable'],
        data() {
            return {
                data_dropdown: null,
                province_input: null,
                placeholder: '',
                filteredData: [],
                data: [],
                sData: '',
                loading: false,
                backspace: false,
                params: [], //send dropdown params for search
                selected: [], //send dropdown params for search
            }
        },

        computed: {},


        mounted() {

            if (this.for === 'tags') {
                this.placeholder = 'tags';
//            this.setAxiosCsrf();
                this.getData("tags");
            }

//            this.activeData[0] = true;
//            this.setEvents();
//************* hooze parameters
            this.data_dropdown = $('#select-data');
            this.data_input = $('#dataInput');
            this.data_input.on('keydown', (e) => {
                if (e.keyCode === 8) {
                    this.backspace = true;
                    this.searchCounty = '';
                    this.filteredCounties = [];
                    this.openDropdown('h');
                } else {
                    this.backspace = false;
                }
            });
        },
        created() {
            //hoozeRequest->hoozeResponse->selectorResponse
//            this.$root.$on('hoozeResponse', params => {
//                params.zamime = this.selected;
//                this.$root.$emit('selectorResponse', params);
//            });
        }
        ,
        beforeDestroy() {
//            this.$root.$off('hoozeResponse');
        }
        ,
        updated() {


        }
        ,
        methods: {
            unselect(id) {
                for (let i in this.selected)
                    if (this.selected[i] === id) {
                        this.selected.splice(i, 1);

                    }
            }
            ,
            setEvents() {


//                this.$root.$on('search', (params) => {
//                    this.params['data'] = [];
//                    if (params !== undefined)
//                        this.params['page'] = params['page'];
//
//                    if ((this.multi && !this.activeData[0]) || !this.multi)
//                        for (let i in this.activeData)
//                            if (this.activeData[i])
//                                this.params['data'].push(i);
//
////                    console.log(this.params);
//                    this.$root.$emit('dropdownResponse', this.params);
//                });

                //hoozeRequest->hoozeResponse->selectorResponse
//                this.$root.$on('hoozeResponse', params => {
//
//                    params.zamime = this.selected;
//                    this.$root.$emit('selectorResponse', params);
//                });
            }
            ,

            getData(type) {
                this.loading = true;

                if (type === "tags") {
                    this.selected = this.selectedBefore;
                    this.data = this.$parent.tags;
                }
                this.loading = false;

            },


            openDropdown(el) {
                if (el === 'h') {
                    this.filteredData = this.data;
                    this.data_dropdown.removeClass('hide');

                }
            }
            ,
            closeDropdown(el) {
                this.data_dropdown.addClass('hide');
            }
            ,

            selectData(h, hId) {

//                console.log(hId);

                if (hId === 'clr') {

                }
                else if (hId === 'key') {

                    this.filteredData = this.data.filter(entry => {
                        return entry.includes(this.sData);
                    });

                    if (this.sData === '' || this.sData === ' ')
                        this.filteredData = this.data;
                    if (this.filteredData.length === 0)
                        this.filteredData = this.data;
                }
                else {

                    let find = false;
                    for (let i in this.selected)
                        if (this.selected[i] === h) {
//                            console.log(this.selected[i].name + ',' + h.name);
                            find = true;
                            break;
                        }

                    if (!find && h !== '') {
                        this.selected.push(h);
//                        console.log(this.selected);
                    }
                }
            }
            ,
            showDialog(params) {
                let color;
                if (params['type'] === 'success')
                    color = '#60aa2f';
                else if (params['type'] === 'error')
                    color = '#d33';
                swal.fire({
                    title: params['title'],
                    text: params['message'],
                    type: params['type'],
                    showCancelButton: false,
                    showCloseButton: true,
//                        cancelButtonText: 'خیر',
                    confirmButtonColor: color,
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'تایید',
                }).then((result) => {
                    if (result.value) {
//                            this.saveChanges();
                    }
                });
            }
            ,

        }

    }


</script>
<style>


</style>