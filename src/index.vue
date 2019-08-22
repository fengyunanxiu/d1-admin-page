<template>
    <div v-cloak>
        <!--<div id="breadcrumb">-->
            <!--<ol class="breadcrumb">-->
                <!--<li>-->
                    <!--<small>PREVIEW</small>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<small>{{dfKey}}</small>-->
                <!--</li>-->
            <!--</ol>-->
        <!--</div>-->

        <div class="tab">
            <el-tabs class="el-tabs" type="border-card">
                <el-tab-pane label="Demo">
                    <div class="area-one">
                        <div class ="area">
                    <el-row :gutter="10">
                        <el-col :xs="12" :sm="8" :md="6" :lg="4">
                            <el-input v-model="dsFacetKey" placeholder="data facet key" size="small"></el-input>
                        </el-col>
                        <el-col :xs="11" :sm="11" :md="11" :lg="11">

                            <el-button type="primary" size="small" @click="handleQuery"><i class="fa fa-search"
                                                                                           aria-hidden="true"></i> Route
                            </el-button>
                        </el-col>
                    </el-row>
                        </div>
                    </div>


                    <div class="area-two" v-show="showD1VueComponent">
                        <div class ="area">
                            <d1-vue-component ref="d1VueComponet" :options="generateOption"
                                @onToolbarButtonClick="handleToolbarButtonClick"
                                @onTableOperationButtonClick="onTableOperationButtonClick"
                                @handleTableDataFormatter="handleTableDataFormatter"
                                @completeLoadForm="completeLoadForm"
                            ></d1-vue-component>


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
        },
        mounted(){

        },

        data() {
            return {
                generateOption: {
                    queryUrl: this.baseUrl + '/d1-client/d1/client/executeQuery?' ,
                    importUrl: '',
                    exportUrl: this.baseUrl + '/d1-client/d1/query-suite/executeQuery?',
                    deleteUrl: '',
                    showExportButton: true,
                    modifyUrl: '',
                    pageSize: 10,
                    tableData: [{}],
                    dataFacetKey: '',
                    loadTableDataAfterLoadFormTableAtOnce:false,
                    loadFormTableOnCreate: false,
                    pageSettingData: {
                        form: [{}],
                        table: [{}]
                    },
                    showToolbarButtonList: false,
                    showTableSelection: false,
                    toolbarButtonList: [
                        {
                            label: 'Delete', //按钮显示的名称
                            type: 'danger',  //按钮的类型,默认空,支持  primary，success，info，warning，danger
                            name: 'delete', // 用户点击时返回的组件
                            elColWidth: 3, //按钮的占位
                        }
                    ],
                    showTableOperationButton: false,
                    tableOperationButtonList: [
                        {
                            label: 'download', //按钮显示的名称
                            type: '',  //按钮的类型,默认空,支持  primary，success，info，warning，danger
                            name: 'download', // 按钮点击时间触发的函数名称
                            width: 150
                        }
                     ],
                    // tableCellDataLink: [{
                    //     db_field_name: 'batch_id', //需要增加a标签的字段名
                    //     field_label: [""], //a标签显示的限制值
                    //     dialogDisplaysValueFromFields: '', // 对话框的说明来源于字段
                    //     needCustomProcess: true,  //如果设置为ture,请监听onTableCellDataClick函数
                    //     name:''
                    // },
                    // ]
                },
                dsFacetKey:'',
                showD1VueComponent: false
            }
        },
        methods:{
            handleToolbarButtonClick(name){
                console.info(name);
            },
            onTableOperationButtonClick(row, name){
                console.info(row);
                console.info(name);
            },
            handleQuery(){
                this.showD1VueComponent = false;
                this.$refs.d1VueComponet.setDataFacetKey(this.dsFacetKey);
                this.$refs.d1VueComponet.loadFormTableSettibg();
                this.$refs.d1VueComponet.runQuery();
            },
            completeLoadForm(){
                this.showD1VueComponent = true;
            },
            handleTableDataFormatter(tableData,componentName){
                // TODO
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
    .area-one{
        margin-bottom: 20px;
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
