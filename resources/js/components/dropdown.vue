<template>

    <div class="   w-100">


        <!--                             dropdown data               -->
        <div :id="'hDropdown'+refId" class="dropdown-content ">
            <div class="input-group   center-block ">
                <div class="input-group-prepend   btn-group-vertical p-1">
                    <i class="fa fa-search text-primary  "></i>
                </div>
                <input type="text" :placeholder="placeholder" v-model="sData" :id="'input_qr_text_'+refId"
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

            <ul class="list-group mb-5  hide" ref="listItems" :id="'list-data-docs-'+refId ">
                <li v-for="h  in   this.filteredData" class="list-group-item  data-items"
                    :id="refId+h['id']" :ref="refId+h['id']" :key="h['id']"
                    :class="{'active':data==h['name']}"
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
        props: ['dataLink', 'for', 'multi', 'beforeSelected', 'refId', 'placeholder'],
        data() {
            return {
                sData: this.data ? this.data : '',

                data_dropdown: null,
                province_input: null,

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
//            console.log('drop');
            this.data_dropdown = $('#list-data-docs-' + this.refId);
            this.data_input = $('#dataInput');


            this.getData();
//************* data parameters

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
        updated() {
//            this.getData();
            if (!this.data) {
                this.getData();
                console.log(this.data);
            }

//            console.log(this.filteredData);
        },
        created() {

        },
        methods: {


            getData() {
                axios.post(this.dataLink, {})
                    .then((response) => {
//                        console.log(response);
                        this.data = response.data;
                        this.filteredData = this.data;
                    }).catch((error) => {
                    console.log(' error:');
                    console.log(error);
                });
            },
            openDropdown(el) {
                if (el === 'h') {
                    this.filteredData = this.data;
//                    console.log(this.data);
                    this.data_dropdown.removeClass('hide');

                }
            },
            closeDropdown(el) {

                if (el === 'h') {

                    this.filteredData = this.data;
                    let i = 0;
                    if (i < 4) {
                        this.sData = '';
                        for (let i in this.selected) {
                            this.sData += this.selected[i].name + ', ';
                        }
                        this.sData = this.sData.slice(0, this.sData.length - 2); //remove last ,
//                            console.log(this.sData);

                    }
                    this.data_dropdown.addClass('hide');
                }
            },

            selectData(h, hId) {
                if (hId === 'clr') {
//                    all.removeClass('active');
                    $('.data-items').removeClass('active');
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
                    let item = $('#' + this.refId + hId);
                    if (!this.multi) {
                        $('.data-items').removeClass('active');
                        $('#input_qr_text_' + this.refId).blur();
                    }
                    item.toggleClass('active');
//                    console.log(this.data.length);
                    for (let i = 0; i < this.data.length; i++)
                        if ($(this.$refs[this.refId + this.data[i].id]).hasClass('active'))
                            this.selected.push(this.data[i]);
                    if (!this.multi) {
//                        $("#dataInput").blur();
                        this.closeDropdown('h');
                    }

                }
                this.$root.$emit('dropdown_click', {'group_id': this.selected.length > 0 ? this.selected[0].id : 1});
            },

        }

    }


</script>