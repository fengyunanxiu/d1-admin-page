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
                        <el-col :xs="16" :sm="12" :md="12" :lg="8">
                            <el-input v-model="d1Options" type="textarea" size="small"></el-input>
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
                            <d1-vue-component ref="d1VueComponet" :options="generateOption" :dataFacetKey="dsFacetKey" :d1CoreBaseUrl="d1CoreBaseUrl"
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

    let generateOption = {
            queryUrl: 'd1-core/d1/query-suite/execute-query' ,
            exportUrl: '/d1-client/d1/query-suite/executeQuery',
            showExportButton: true,
            pageSize: 10,
            tableData: [{}],
            dataFacetKey: '',
            showForm:true,
            showTableSelection: true,
            loadFormTableOnCreate:false,
            pageSettingData: {
            form: [{}],
                table: [{}]
            },
        openform:true,
        toolbarPlaceholder:["This is Description"],
        loadingPrompt: "Loading, Please wait...",
        showToolbarButtonList: true,

            toolbarButtonList: [
            {
                label: 'Delete', //按钮显示的名称
                type: 'danger',  //按钮的类型,默认空,支持  primary，success，info，warning，danger
                name: 'delete', // 用户点击时返回的组件
                elColWidth: 3, //按钮的占位
            }
        ],
            showTableOperationButton: true,
            tableOperationButtonList: [
            {
                label: 'download', //按钮显示的名称
                type: '',  //按钮的类型,默认空,支持  primary，success，info，warning，danger
                name: 'download', // 按钮点击时间触发的函数名称
                width: 150
            }
        ],
        tableCellDataLink: [{
            db_field_name: 'batch_id', //需要增加a标签的字段名
            field_label: [""], //a标签显示的限制值
            dialogDisplaysValueFromFields: '', // 对话框的说明来源于字段
            needCustomProcess: true,  //如果设置为ture,请监听onTableCellDataClick函数
            name:''
        }]
    };

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
                generateOption: generateOption,
                dsFacetKey:'',
                showD1VueComponent: false,
                d1Options:JSON.stringify(generateOption, null, "\t")
            }
        },
        computed: {
            d1CoreBaseUrl(){
                return this.baseUrl;
            },
            d1ClientBaseUrl(){
                return "";
            },
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

                if(!this.dsFacetKey){
                    this.$message.warning('Please input data facet key');
                    return;
                }
                this.showD1VueComponent = true;
                try{
                    let options = JSON.parse(this.d1Options);
                    options.dataFacetKey = this.dsFacetKey;
                    // this.$refs.d1VueComponet.setDataFacetKey(this.dsFacetKey);
                    this.$refs.d1VueComponet.initOptions(options);
                    this.$refs.d1VueComponet.loadFormTableSetting();
                    this.$refs.d1VueComponet.runQuery();
                }catch (data) {
                    console.info(data);
                    this.$message.warning('Failed to initialize component: invalid parameter');
                }


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
