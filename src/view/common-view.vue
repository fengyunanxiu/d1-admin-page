<template>
    <div v-cloak>
        <div id="breadcrumb">
            <ol class="breadcrumb">
                <li>
                    <small>PREVIEW</small>
                </li>
                <li>
                    <small>{{dfKey}}</small>
                </li>

            </ol>
        </div>

        <div class="tab">
            <el-tabs class="el-tabs" type="border-card">
                <el-tab-pane label="Main">
                    <div class="area-one">
                        <div class ="area">
                            <d1-vue-component ref="basicForm" :options="generateOption" :dataFacetKey="dfKey" :d1CoreBaseUrl="d1CoreBaseUrl"></d1-vue-component>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import d1VueComponent from '@/components/common/d1-vue-component.vue'

    export default {
        name:'commonView',
        components: {
            d1VueComponent
        },
        created() {
            this.dfKey = this.$route.query.dfKey;
            this.generateOption.dataFacetKey = this.dfKey;
        },
        mounted(){

        },

        data() {
            return {
                generateOption: {
                    queryUrl: 'd1-core/d1/query-suite/execute-query' ,
                    importUrl: '',
                    exportUrl: 'd1-core/d1/export/async-export',
                    deleteUrl: '',
                    modifyUrl: '',
                    pageSize: 10,
                    tableData: [{}],
                    dataFacetKey: '',

                    pageSettingData: {
                        form: [{}],
                        table: [{}]
                    },
                    //showToolbarButtonList: true,
                    asyncExport:true,
                    showExportButton:true,

                    // toolbarButtonList: [
                    //     {
                    //         label: 'Export ', //按钮显示的名称
                    //         type: 'primary',  //按钮的类型,默认空,支持  primary，success，info，warning，danger
                    //         name: 'export', // 用户点击时返回的组件
                    //         elColWidth: 3, //按钮的占位
                    //     }
                    // ],

                    openform:true,
                    // tableOperationButtonList: [
                    //     {
                    //         label: 'download', //按钮显示的名称
                    //         type: '',  //按钮的类型,默认空,支持  primary，success，info，warning，danger
                    //         name: 'download', // 按钮点击时间触发的函数名称
                    //         width: 150
                    //     }
                    //  ],
                    // tableCellDataLink: [{
                    //     db_field_name: 'batch_id', //需要增加a标签的字段名
                    //     field_label: [""], //a标签显示的限制值
                    //     dialogDisplaysValueFromFields: '', // 对话框的说明来源于字段
                    //     needCustomProcess: true,  //如果设置为ture,请监听onTableCellDataClick函数
                    //     name:''
                    // },
                    // ]
                },
                dfKey : ''
            }
        },
        computed: {
            d1CoreBaseUrl(){
                return this.baseUrl;
            },
            d1ClientBaseUrl(){
                return "";
            }
        },
        methods:{
            handleToolbarButtonClick(name){
                console.info(name);
            },
            onTableOperationButtonClick(row, name){
                console.info(row);
                console.info(name);
            }
        }



    }

</script>


<style scoped>
    [v-cloak] {
        display: none;
    }

    .breadcrumb {
        padding: 8px 15px;
        margin-bottom: 20px;
        list-style: none;
        background-color: #f5f5f5;
        border-radius: 4px;
        text-align: left;
    }
    .breadcrumb > li {
        display: inline-block;
    }
    ol, ul {
        margin-top: 0;
    }
    .breadcrumb > li + li::before {
        padding: 0 5px;
        color: #ccc;
        content: "/\A0";
    }
    *, ::after, ::before {
        box-sizing: border-box;
    }

    .area,.area-one {
        text-align: left;
    }


</style>

<!--<template>-->

<!--    <div>TESt</div>-->
<!--</template>-->

<!--<script>-->
<!--    export default {-->
<!--        name : 'commonView'-->
<!--    }-->

<!--</script>-->

<!--<style  scoped>-->


<!--</style>-->
