<template>

    <div class="dropdowns  w-100">


        <!--                             dropdown hooze               -->
        <div id="hDropdown" class="dropdown-content ">
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
                       @click="sData=''; selectData(sData,'clr');$root.$emit('search')"></i>
                </div>
            </div>

            <ul class="list-group mt-2  hide" ref="listItems" :id="'list-data-'+listID">
                <li v-for="h  in   this.filteredData" class="list-group-item  hooze-items"
                    :id="'h'+listID+h['id']" :ref="'h'+listID+h['id']" :key="h['id']"
                    :class="{'active':hooze==h['name']}"
                    @mousedown.prevent="sData='';selectData(h,h['id'])">
                    {{h['name']}}
                </li>
            </ul>
        </div>
    </div>

</template>

<script>
    let selectedBefore = false;
    let selected = '';
    export default {
        props: ['dataLink', 'for', 'multi', 'hooze', 'listID', 'beforeSelected'],
        data() {
            return {
                sData: this.hooze ? this.hooze : '',
                data_dropdown: null,
                province_input: null,
                placeholder: '',
                filteredData: [],
                data: [],
                selected: [],
                activeData: [false],
                offset: -1, // in multi=false همه نمایندگی ها not exist
                backspace: false,
                params: [], //send dropdown params for search
            }
        },

        computed: {},


        mounted() {
//            console.log(this.beforeSelected);
            this.data_dropdown = $('#list-data-' + this.listID);
            this.data_input = $('#dataInput');

            if (this.multi && this.for === 'hooze') {
                this.placeholder = 'حوزه نمایندگی';
                this.offset = 0;
            }

            else if (this.for === 'hooze') {
                this.placeholder = 'حوزه نمایندگی';
//                this.offset = 0;
            }
            else if (this.for === 'school')
                this.placeholder = 'مدارس';
//            this.setAxiosCsrf();
            this.getData();
//            this.activeData[0] = true;
            this.setEvents();
//************* hooze parameters

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

        },
        beforeDestroy() {
            this.$root.$off('hoozeRequest');
        },
        methods: {

            setEvents() {
                //hoozeRequest->hoozeResponse->selectorResponse
                this.$root.$on('hoozeRequest', params => {

                    params.hooze = this.selected[0] ? this.selected[0].id : "";


                    if (params.vaziat === 'd' || params.vaziat === 'a') //school selector is not available
                        this.$root.$emit('hoozeResponse', params);
                    else
                        this.$root.$emit('selectorResponse', params);

                });

                this.$root.$on('search', (params) => {
                    this.params['data'] = [];
                    if (params !== undefined) {
                        this.params['page'] = params['page'];
                        this.params['orderBy'] = params['orderBy'];
                        this.params['direction'] = params['direction'];
                    }

//                    if ((this.multi && !this.activeData[0]) || !this.multi)
                    for (let i in this.selected)
                        this.params['data'].push(this.selected[i].id);
                    this.params['hooze'] = this.params['data'];
//                    console.log(this.params['h']);
                    this.$root.$emit('dropdownResponse', this.params);
                });
            },

            getData() {
                axios.post(this.dataLink, {
                    'for': 'dropdown',
                })
                    .then((response) => {
//                        console.log(response);
                        this.data = response.data;
//                        if (this.multi && this.for === 'hooze') //multi is for  search , not create
//                            this.data.unshift({'name': 'همه نمایندگی ها', 'id': 0});
                        this.filteredData = this.data;
//                        console.log(selectedBefore);
                        if (this.listID === 'edit')
                            for (let i = 0; i < this.data.length; i++)
                                this.activeData[i + 1] = this.data[i].name === this.hooze
                        if (this.beforeSelected) {
                            for (let i = 0; i < this.data.length; i++)
                                if (this.data[i].id === this.beforeSelected) {
                                    this.sData = this.data[i].name;
                                    this.selected.push({id: this.data[i].id, name: this.sData})
                                }

                        }
//                        selected = this.selected;
//                        console.log(this.activeData);
                    }).catch((error) => {
                    console.log(' error:');
                    console.log(error);
                });
            },
            openDropdown(el) {
                if (el === 'h') {
                    this.filteredData = this.data;
                    this.data_dropdown.removeClass('hide');

                }
            },
            closeDropdown(el) {

                if (el === 'h') {

                    this.filteredData = this.data;
                    let i = 0;
//                    let selected = [];
//                    this.activeData[0] = false; //dont count in find
//                    if (this.multi && this.activeData[0] === true) {
////                        console.log('h');
//                        this.sData = 'همه نمایندگی ها ';
//                        this.params['h'] = [];//no filter on types
//                    } else {
//                        console.log(this.activeData);
//                    this.activeData.find((t, index) => {
//                        if (t) {
//
//                            i++;
//                            selected.push(this.data[index + this.offset]);
//                        }
//
//                    });

//                    if (selected.length === 0)
//                        this.params['h'] = [];//no filter on types
//                    else
//                        this.params['h'] = selected;
//                            this.params['t'] = selected.slice(0, -1) + ')';

//                    console.log(selected);
                    if (i < 4) {
                        this.sData = '';
                        for (let i in this.selected) {
                            this.sData += this.selected[i].name + ', ';
                        }
                        this.sData = this.sData.slice(0, this.sData.length - 2); //remove last ,
//                            console.log(this.sData);

                    }
                    else if (i > 0)
                        this.sData = i + ' انتخاب ';
//                        else
//                            this.sData = '';
//                    }
//                    this.selected = selected;
                    this.data_dropdown.addClass('hide');
                }
            },

            selectData(h, hId) {

//                console.log(hId);
                let all = $('#h0.hooze-items');
                if (hId === 'clr') {
//                    all.removeClass('active');
                    $('.hooze-items').removeClass('active');
//                    for (let i in this.activeData) {
//                        this.activeData[i] = false;
//                    }
                    this.selected = [];
                }
                else if (hId === 'key') {

                    this.filteredData = this.data.filter(entry => {
                        return entry['name'].includes(this.sData);
                    });
//                    if (this.multi && this.filteredData[0]['name'].includes('همه'))
//                        this.filteredData.shift(); //remove first item (همه نمایندگی ها)
                    if (this.sData === '' || this.sData === ' ')
                        this.filteredData = this.data;
                    if (this.filteredData.length === 0)
                        this.filteredData = this.data;
                }
                else {

                    this.selected = [];
                    let item = $('#h' + this.listID + hId);
                    if (!this.multi) {
                        $('.hooze-items').removeClass('active');
                        $("#dataInput").blur();
                    }
                    item.toggleClass('active');
                    for (let i = 0; i < this.data.length; i++)
                        if ($(this.$refs['h' + this.listID + this.data[i].id]).hasClass('active'))
                            this.selected.push(this.data[i]);
                    if (!this.multi) {
//                        $("#dataInput").blur();
                        this.closeDropdown('h');
                    }

                }
//                console.log(this.selected);
//                        this.activeData[i] = ($('#h' + i).hasClass('active'));
//                        this.activeData[i] = ($(this.$refs['h' + this.listID + i]).hasClass('active'));
//                    if (!this.multi) {
//                        this.activeData[0] = false;
//                        if (item.hasClass('active')) {
//                            $('.hooze-items').removeClass('active');
//                            item.addClass('active');
//                        }
//
//                        for (let i = 0; i < this.data.length; i++)
//                            this.activeData[i + 1] = ($(this.$refs['h' + this.listID + this.data[i].id]).hasClass('active'));
////                        console.log(this.activeData);
//                        this.closeDropdown('h');
//                    }
//                    else {

//                        if (hId === 0)
//                            if (all.hasClass('active')) {
//                                $('.hooze-items').addClass('active');
//                                this.activeData[0] = true;
//                            }
//                            else {
//                                $('.hooze-items').removeClass('active');
//                                this.activeData[0] = false;
//                                this.sData = '';
//                            }
//                        else {
//                            // one item deselected => remove active class from همه
//                            if (!item.hasClass('active')) {
//                                all.removeClass('active');
//                                this.activeData[0] = false;
//                            }
//                        }

//                    this.activeData[0] = false;//only for undefined error!
//                        for (let i = 0; i < this.data.length; i++)
//                        this.activeData[i] = ($('#h' + i).hasClass('active'));
//                            this.activeData[i] = ($(this.$refs['h' + this.listID + i]).hasClass('active'));
//                        console.log(this.$refs['h' + i]);
//                        console.log(this.activeData);
//                            }
//            }


//                this.filteredData = this.data.filter(entry => {
//                    return entry['name'].includes(this.sData);
//                });
//                if (this.filteredData.length === 0)
//                    this.filteredData = this.data;

//                for (let i = 1; i < this.data.length; i++)
//                    if ($('#h' + i).hasClass('active'))
//                        console.log($('#h' + i)[0]);
            },

            setAxiosCsrf() {
                window.axios.defaults.headers.common['X-CSRF-TOKEN'] =
                    $('meta[name="csrf-token"]').prop('content');

            }
        }

    }


</script>