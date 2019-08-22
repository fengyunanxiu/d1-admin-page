<template>
    <div>

        <el-dialog title="Dictionary"  :visible.sync="confirmToOpenDictDialogVisible"
                   :close-on-click-modal="false"
                   @closed ="closeDictionaryMethod"
                   :center="true"
                   size="tiny">

            <el-collapse ><!--form表单折叠板-->
                <el-collapse-item name="1">
                <el-form>
                    <el-row :gutter="10">
                        <el-col :xs="12" :sm="8" :md="6" :lg="4">
                    <el-form-item label="Domain">
                        <el-input  size="small" v-model ="dictParams.field_domain">
                        </el-input>
                    </el-form-item>
                        </el-col>

                        <el-col :xs="12" :sm="8" :md="6" :lg="4">
                    <el-form-item label="Item">
                        <el-input  size="small" v-model ="dictParams.field_item">
                        </el-input>
                    </el-form-item>
                        </el-col>

                        <el-col :xs="12" :sm="8" :md="6" :lg="4">
                    <el-form-item label="Value">
                        <el-input  size="small" v-model ="dictParams.field_value">
                        </el-input>
                    </el-form-item>
                        </el-col>
                    </el-row>


                    <el-form-item>
                        <el-button type="primary" size="small" @click="handleDictQuery"><i class="fa fa-search"
                                                                                       aria-hidden="true"></i> Search
                        </el-button>

                    </el-form-item>
                </el-form>
                </el-collapse-item>
            </el-collapse>

            <vxe-table
                    border
                    resizable
                    :tree-config="{children: 'dict_list'}"
                    :data.sync="dictTableData">

                <vxe-table-column  label="选择" width="120" >

                    <template slot="header" slot-scope="scope">
                       <el-button @click="clearSelect">Clear</el-button>
                    </template>
                    <template slot-scope="scope">
                        <el-radio class="radio" v-model="dictSelect"   v-if="!scope.row.field_value" :label="scope.row.field_domain +'-d1-' + scope.row.field_item ">&nbsp;
                        </el-radio>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="field_domain" title="Domain"></vxe-table-column>
                <vxe-table-column field="field_item" title="Item" tree-node></vxe-table-column>

                <vxe-table-column field="field_value" title="Value"></vxe-table-column>
                <vxe-table-column field="field_label" title="Label"></vxe-table-column>
                <vxe-table-column field="field_sequence" title="Sequence"></vxe-table-column>
            </vxe-table>

            <div class="tool-bar" style="width: 100%;text-align: right">

                <div class="pagination">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="dictCurrentPage"
                            :page-sizes="[5, 10, 20, 50, 100]"
                            :page-size="dictPageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total=dictTotalRecord>
                    </el-pagination>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary"   @click="saveDictSelect">Save</el-button>
                <el-button type="danger" @click="confirmToOpenDictDialogVisible = false">Close</el-button>
            </div>


        </el-dialog>



        <el-dialog title="Default Val"  :visible.sync="confirmToOpenDefaultDialogVisible"
                   :close-on-click-modal="false"
                   @closed ="closeDefaultMethod"
                   :center="true"
                   size="tiny">

            <el-form

                    label-position="left"
                    label-width="120px"
            >
                <el-radio v-model="defaultsConfigurationDO.field_type" label="AUTO">Auto</el-radio>
                <div style="padding-bottom: 10px"></div>

                <el-form-item label="Type: "   >
                    <el-select v-model="defaultsConfigurationDO.type" :disabled="defaultsConfigurationDO.field_type != 'AUTO' "  size="small">
                        <el-option label="SQL" value="sql"></el-option>
                        <el-option label="CUSTOMER" value="customer"> </el-option>
                    </el-select>

                </el-form-item>

                <el-form-item  label="JDBC URL: " >
                    <el-input  v-model="defaultsConfigurationDO.url" :disabled="defaultsConfigurationDO.field_type != 'AUTO'"  size="small"></el-input>
                </el-form-item>

                <el-form-item label="Username: " >
                    <el-input v-model="defaultsConfigurationDO.username"  :disabled="defaultsConfigurationDO.field_type != 'AUTO'" size="small"></el-input>
                </el-form-item>

                <el-form-item label="Password: " >
                    <el-input  v-model="defaultsConfigurationDO.password" :disabled="defaultsConfigurationDO.field_type != 'AUTO'" size="small"></el-input>
                </el-form-item>

                <el-form-item label="SQL: " >
                    <el-input v-model="defaultsConfigurationDO.sql" type="textarea" :disabled="defaultsConfigurationDO.field_type != 'AUTO' || defaultsConfigurationDO.type != 'sql' "  size="small"></el-input>
                </el-form-item>

                <el-form-item label="Upload plugin: " >
                    <el-input v-model="defaultsConfigurationDO.field_plugin_conf"  :disabled="defaultsConfigurationDO.field_type != 'AUTO' || defaultsConfigurationDO.type != 'customer' "  size="small"></el-input>
                </el-form-item>

                <el-form-item label="cron: " >
                    <el-input  v-model="defaultsConfigurationDO.cron" :disabled="defaultsConfigurationDO.field_type != 'AUTO'"  size="small"></el-input>
                </el-form-item>


                <div style="text-align: center"><el-button type="primary"  :disabled="defaultsConfigurationDO.field_type != 'AUTO'" >Test</el-button></div>
                <div style="padding-bottom: 10px"></div>


                <el-radio v-model="defaultsConfigurationDO.field_type" label="MANUAL">Manual</el-radio>
                <div style="padding-bottom: 10px"></div>

                <el-form-item label="Value: " >
                    <el-input   v-model="defaultsConfigurationDO.field_manual_conf" :disabled="defaultsConfigurationDO.field_type != 'MANUAL'" size="small" placeholder = "JSON格式化字符串"></el-input>
                </el-form-item>




            </el-form>






            <div slot="footer" class="dialog-footer">
                <el-button type="primary"   @click="saveDefaultSelect">Save</el-button>
                <el-button type="danger" @click="confirmToOpenDefaultDialogVisible = false">Close</el-button>
            </div>


        </el-dialog>

        <el-dialog
                title="Tips"
                :visible.sync="confirmOpenPreviewDialogVisible"
                :close-on-click-modal="false"
                :center="true"
                size="tiny">
            <div class="dialog">You can't preview the unsaved changes</div>
            <span slot="footer" class="dialog-footer">
<!--              <el-button type="primary" @click="confirmOpenPreviewDialogVisible = false">No</el-button>-->
              <el-button type="danger" @click="openPreviewPage">Close</el-button>
            </span>
        </el-dialog>



        <div v-loading.fullscreen.lock="tabScreenLoading"
             element-loading-text="Loading, please wait..."
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
        </div>

        <div class="data-source-name">
            <el-row>

                <el-col :xs="15" :sm="15" :md="15" :lg="17" >


                <ol class="breadcrumb">
                    <li>
                        <i class="fa fa-id-card-o"></i> {{node.crumbs.sourceName}}
                    </li>
                    <li>
                        <i class="fa fa-database"></i>
                        <small> {{node.crumbs.schemaName}}</small>
                    </li>
                    <li>
                        <i class="fa fa-table"></i>
                        <small> {{node.crumbs.tableName}}</small>
                    </li>
                    <li class="active">
                        <i class="fa fa-table"></i>
                        <small> {{node.label}}</small>
                    </li>
                </ol>

                </el-col>



                <el-col :xs="9" :sm="9" :md="9" :lg="7" style="text-align: right;padding-right: 10px;padding-top: 3px">


                    <el-button size="mini" @click="refreshSetting"
                               type="danger"
                    > Refresh
                    </el-button>

                    <el-button size="mini" @click="saveAll"
                               type="primary"
                    > Save
                    </el-button>
                    <el-button size="mini"
                               type="success" @click="openPreviewDialog"
                    >
                        Preview
<!--                    <router-link  tag="span"  target="_blank"  :to="{path:'/common-view',query: {dfKey: node.label}}">-->
<!--                      Preview-->
<!--                    </router-link>-->
                    </el-button>
                </el-col>

            </el-row>



        </div>
        <br/>
        <div class="table">
<!--            <vxe-toolbar>-->
<!--                <template v-slot:buttons>-->
<!--                    <vxe-button @click="$refs.xTable.revert()">还原全部</vxe-button>-->
<!--                    <vxe-button @click="saveAll()">保存全部</vxe-button>-->

<!--                </template>-->
<!--            </vxe-toolbar>-->


            <vxe-grid border
                      ref="xTable"
                      resizable
                      stripe
                      show-overflow
                      highlight-current-row
                      highlight-hover-row
                      highlight-hover-column
                      :columns="tableColumns"
                      highlight-current-column
                      row-id="id"

                      :edit-config="{trigger: 'dblclick', mode: 'cell', showStatus: true}"
                      :mouse-config="{selected: true}"
                      :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
                      :data.sync="tableData"
                      @cell-dblclick="openDictionaryDialog"
            >



            </vxe-grid>


        </div>
    </div>
</template>

<script>


    import QueryFormType from "../assets/js/constant/query-form-type";

    export default {
        name: "form-table-setting",
        props: {
            node: {
                type: Object,
                required: false,
                default: () => {
                }
            }
        },
        data() {
            return {
                tabScreenLoading:false ,
                tableColumns: [{
                    type: 'index',
                    width: 40,
                    title: 'No.',
                    fixed:'left'
                },
                    {
                        field: 'db_field_name',
                        title: 'Field Name',
                        minWidth: 120,
                        fixed:'left'
                    },
                    {
                        field: 'db_field_type',
                        title: 'Field Type',
                        minWidth: 110,
                        fixed:'left'
                    },
                    {
                        field: 'db_field_comment',
                        title: 'Field Description',
                        minWidth: 120
                    },
                    {
                        field: 'view_field_label',
                        title: 'Field Label',
                        minWidth: 120,
                        editRender: {name: 'input'}
                    },
                    {
                        field: '',
                        title: 'Form',
                        children: [
                            {
                                field: 'form_field_visible',
                                title: 'Show ?',
                                minWidth: 60,
                                editRender: {
                                    name: 'ElSwitch', type: 'visible', props: {
                                        activeValue: 1,
                                        inactiveValue: 0,
                                        activeColor:"green",
                                        inactiveColor:"gray"
                                    }
                                }
                            },
                            {
                                field: 'form_field_sequence',
                                minWidth: 90,
                                title: 'Sequence',
                                editRender: {name: 'ElInputNumber', props: {max: 9999, min: 1}},
                                sortable:true
                            },
                            {
                                field: 'form_field_query_type',
                                minWidth: 200,
                                title: 'Element Type',
                                editRender: {
                                    name: 'ElSelect', props: {clearable: false},
                                    options: [

                                        {
                                            label: 'EXACT_MATCHING_TEXT',
                                            value: 'EXACT_MATCHING_TEXT'
                                        },{
                                            label: 'FUZZY_MATCHING_TEXT',
                                            value: 'FUZZY_MATCHING_TEXT'
                                        },
                                        {
                                            label: 'SINGLE_CHOICE_LIST',
                                            value: 'SINGLE_CHOICE_LIST'
                                        },  {
                                            label: 'SINGLE_CHOICE_LIST_W_EMPTY',
                                            value: 'SINGLE_CHOICE_LIST_W_EMPTY'
                                        },{
                                            label: 'MULTIPLE_CHOICE_LIST',
                                            value: 'MULTIPLE_CHOICE_LIST'
                                        },
                                        {
                                            label: 'DATE_RANGE',
                                            value: 'DATE_RANGE'
                                        },
                                        {
                                            label: 'SINGLE_DATE',
                                            value: 'SINGLE_DATE'
                                        }, {
                                            label: 'DATE_TIME_RANGE',
                                            value: 'DATE_TIME_RANGE'
                                        },{
                                            label: 'SINGLE_DATETIME',
                                            value: 'SINGLE_DATETIME'
                                        },
                                        {
                                            label: 'NUMBER_RANGE',
                                            value: 'NUMBER_RANGE'
                                        }

                                    ]
                                }
                            },
                            {
                                field: 'form_field_child_field_name',
                                minWidth: 100,
                                title: 'Child Field Name',
                                editRender: {name: 'input'}
                                // TODO ,select 查询；使用现用的字段
                            },
                            {
                                field: 'optional_dic_val',
                                minWidth: 100,
                                title: 'Optional Values',
                                editRender: {name: 'input'},
                                formatter:function(obj){
                                    let row = obj.row;
                                    if(row.form_field_dict_domain_name){
                                        return row.form_field_dict_domain_name + ' + ' + row.form_field_dict_item;
                                    }
                                    return null;

                                }
                            },
                            {
                                field: 'form_field_use_default_val',
                                minWidth: 100,
                                title: 'Use Default Value?',
                                editRender: {
                                    name: 'ElSwitch', type: 'visible', props: {
                                        activeValue: 1,
                                        inactiveValue: 0,
                                        activeColor:"green",
                                        inactiveColor:"gray"
                                    }
                                }
                            },
                            {
                                field: 'form_field_def_val_strategy',
                                minWidth: 100,
                                title: 'Default Value Strategy',
                                editRender: {name: 'input'}


                            },
                            {
                                field: 'form_field_default_val',
                                minWidth: 100,
                                title: 'Default Value',
                                editRender: {name: 'input'}
                            }
                        ],
                    },
                    {
                        field: '',
                        title: 'List / Table',
                        children: [
                            {
                                field: 'table_field_visible',
                                minWidth: 60,
                                title: 'Show ?',
                                editRender: {
                                    name: 'ElSwitch', type: 'visible', props: {
                                        activeValue: 1,
                                        inactiveValue: 0,
                                        activeColor:"green",
                                        inactiveColor:"gray"
                                    }
                                }
                            },
                            {
                                field: 'table_field_order_by',
                                minWidth: 110,
                                title: 'Default Order By',
                                editRender: {
                                    name: 'ElSelect',
                                    props: {clearable: false},
                                    options: [
                                        {
                                            label: 'NONE',
                                            value: 'NONE'
                                        }, {
                                            label: 'DESC',
                                            value: 'DESC'
                                        },
                                        {
                                            label: 'ASC',
                                            value: 'ASC'
                                        }
                                    ]
                                }
                            },
                            {
                                field: 'table_field_sequence',
                                minWidth: 90,
                                title: 'Sequence',
                                editRender: {name: 'ElInputNumber', props: {max: 9999, min: 1}},
                                sortable:true
                            },
                            {
                                field: 'table_field_column_width',
                                minWidth: 70,
                                title: 'Width',
                                editRender: {name: 'ElInputNumber', props: {max: 9999, min: 1}}
                            },
                            {
                                field: 'table_parent_label',
                                minWidth: 80,
                                title: 'Parent Label',
                                editRender: {name: 'input'}
                            },
                        ],
                    },
                    {
                        field: '',
                        title: 'Export',
                        children: [
                            {
                                field: 'export_field_visible',
                                minWidth: 60,
                                title: 'Show ?',
                                editRender: {
                                    name: 'ElSwitch', type: 'visible', props: {
                                        activeValue: 1,
                                        inactiveValue: 0,
                                        activeColor:"green",
                                        inactiveColor:"gray"
                                    }
                                }
                            },
                            {
                                field: 'export_field_sequence',
                                minWidth: 90,
                                title: 'Sequence',
                                editRender: {name: 'ElInputNumber', props: {max: 9999, min: 1}},
                                sortable:true
                            },
                            {
                                field: 'export_field_width',
                                minWidth: 70,
                                title: 'Width',
                                editRender: {name: 'ElInputNumber', props: {max: 9999, min: 1}}
                            },
                        ],
                    },
                    {
                        type: 'width',
                        width: 90,
                        title: 'Operation',

                        fixed: 'right',

                        slots: {
                            default: ({row}, h) => {
                                return [
                                    h('vxe-button', {
                                        on: {
                                            click: () => this.$refs.xTable.revert(row)
                                        }
                                    }, 'Revert')

                                ]
                            },
                            header: ({column}, h) => {
                                return [
                                    h('span', {

                                    }, 'Operation'),

                                    h('vxe-button', {
                                        on: {
                                            click: () => this.$refs.xTable.revert()
                                        }
                                    }, 'Revert'),

                                ]
                            }
                        }
                    }
                ],
                dataLoading: false,
                tableData: [],

                clickRow:{},
                // dialog相关变量
                dictSelect:'',
                confirmToOpenDictDialogVisible: false,
                dictTableData:[
                ],
                dictParams:{
                    field_domain:'',
                    field_item:'',
                    field_id:'',
                    field_form_df_key:'',
                    field_form_field_key:''
                },
                dictTotalRecord: 0,
                dictPageSize: 10,
                dictCurrentPage: 1,
                queryDictUrl:"d1-core/d1/dict/manage",
                confirmOpenPreviewDialogVisible:false,
                confirmToOpenDefaultDialogVisible:false,

                defaultsConfigurationDO:{
                    field_type: "AUTO",
                    type:"sql",
                    url:"",
                    username:"",
                    password:"",
                    sql:"",
                    field_plugin_conf:"",
                    cron:"",
                    field_manual_conf:""
                }
            }
        },
        computed:{
            fullQueryDictUrl(){
                let url = this.baseUrl + this.queryDictUrl;
                url += (url.indexOf("?") !== -1) ? "&" : "?";
                url += this.dictPageParam ;
                url += this.dictDetailParam;
                return url;
            },
            dictPageParam(){
                let realQueryPage = this.dictCurrentPage - 1;
                let param = 'page=' + realQueryPage + '&size=' + this.dictPageSize;
                return param;
            },
            dictDetailParam(){
                let param = '';
                if(this.dictParams.field_domain){
                    param += '&field_domain=' + this.dictParams.field_domain;
                }
                if(this.dictParams.field_item){
                    param += '&field_item=' + this.dictParams.field_item;
                }
                if(this.dictParams.field_value){
                    param += '&field_value=' + this.dictParams.field_value;
                }

                return param;
            }
        },
        created() {
            this.loadFormTableSettings();
        },


        methods: {
            refreshSetting(){
                this.tableData =[];
                this.refreshFormTableSettings();
            },
            handleEdit() {

            },
            refreshFormTableSettings(){
                let url = this.baseUrl + 'd1-core/d1/datasource/refresh-df-form-table-setting?dfKey=' + this.node.label;
                this.tabScreenLoading = true;
                this.http.post(url).then(resp => {
                    this.tabScreenLoading = false;
                    this.tableData = resp.data;
                }).catch(error =>{
                    this.tabScreenLoading = false;
                })
            },
            loadFormTableSettings() {
                let url = this.baseUrl + 'd1-core/d1/datasource/select-df-form-table-setting?dfKey=' + this.node.label;
                this.tabScreenLoading = true;
                this.http.get(url).then(resp => {
                    this.tabScreenLoading = false;
                    this.tableData = resp.data;
                }).catch(error =>{
                    this.tabScreenLoading = false;
                })

            },
            saveAll() {
                // TODO
            },
            saveOne(row) {
                let saveDataArr = [];
                saveDataArr.push(row);
                this.realSaveFormTable(saveDataArr);
            },
            saveAll() {
              this.realSaveFormTable(this.tableData);

            },

            realSaveFormTable(saveDataArr) {
                let url = this.baseUrl + 'd1-core/d1/datasource/save-df-form-table-setting';

                for(var i in saveDataArr){
                    let rowData = saveDataArr[i];

                    let queryType = rowData.form_field_query_type
                    if(QueryFormType.SINGLE_CHOICE_LIST === queryType || QueryFormType.SINGLE_CHOICE_LIST_W_EMPTY === queryType || QueryFormType.MULTIPLE_CHOICE_LIST === queryType){
                        if(!rowData.form_field_dict_domain_name ){
                            this.$message.warning('Element Type like:SINGLE_CHOICE_LIST,SINGLE_CHOICE_LIST_W_EMPTY,MULTIPLE_CHOICE_LIST ,Optional Values can not be empty');
                            return;
                        }
                    }
                }
                this.tabScreenLoading = true;
                this.http.post(url, saveDataArr).then(resp => {
                    this.tabScreenLoading = false;
                    this.$message.success('Operation Success');
                    this.$refs.xTable.refreshData();


                }).catch(error =>{
                    this.tabScreenLoading = false;
                })
            },
            openDictionaryDialog(obj){
                let column = obj.column;
                let row = obj.row;
                this.clickRow = row;
                let property = column.property;
                if(property && property == 'optional_dic_val'){
                    let dfKey = row.df_key;
                    let fieldName = row.db_field_name;
                    let url = this.baseUrl + "d1-core/d1/form-dict-configuration?field_form_df_key=" + dfKey + "&field_form_field_key=" + fieldName;
                    this.tabScreenLoading = true;
                    this.http.get(url).then(response =>{
                        this.confirmToOpenDictDialogVisible = true;
                        this.dictParams.field_form_df_key = dfKey;
                        this.dictParams.field_form_field_key = fieldName;
                        let data = response.data;
                        this.tabScreenLoading = false;
                        if(data){
                            // 这两个字段没有配的话可能没有，所以要在这里设置值

                            this.dictParams.field_domain = data.field_domain;
                            this.dictParams.field_item = data.field_item;
                            this.dictParams.field_id = data.field_id;
                            this.dictSelect = data.field_domain +'-d1-' + data.field_item;
                        }
                        this.handleDictQuery();
                    }).catch(error =>{
                        this.tabScreenLoading = false;
                    })
                }else if( property && property == 'form_field_def_val_strategy'){
                    this.confirmToOpenDefaultDialogVisible = true;

                }
            },
            dicFormatter(obj){
                return obj.row.form_field_dict_domain_name;
            },
            handleDictQuery(){

                this.http.get(this.fullQueryDictUrl).then(resp =>{
                    let data = resp.data;
                    this.dictTableData = data.content;
                    this.dictTotalRecord = data.total_elements;
                }).catch(error =>{
                    this.tabScreenLoading = false;
                })
            },
            handleSizeChange(val) {
                this.dictPageSize = val;
                this.handleDictQuery();
            },
            handleCurrentChange(val) {
                this.dictCurrentPage = val;
                this.handleDictQuery();
            },
            refresh() {
                this.handleDictQuery();
            },
            closeDictionaryMethod(){
                this.dictSelect ='';
                this.dictTableData = [];
                this.dictParams = {
                    field_domain:'',
                    field_item:'',
                    field_id:'',
                    field_form_df_key:'',
                    field_form_field_key:''
                };
                this.dictTotalRecord = 0;
                this.dictPageSize = 10;
                this.dictCurrentPage = 1;
            },
            clearSelect(){
                this.dictSelect = '';
            },
            saveDictSelect(){
                let url = this.baseUrl + "d1-core/d1/form-dict-configuration";

                let formDictConfiguration = {};
                formDictConfiguration.field_form_df_key = this.dictParams.field_form_df_key;
                formDictConfiguration.field_form_field_key= this.dictParams.field_form_field_key;

                let arr ;
                if(this.dictSelect){
                    arr =  this.dictSelect.split("-d1-");
                }
                if(arr){
                    formDictConfiguration.field_domain = arr[0];
                    formDictConfiguration.field_item = arr[1];
                }
                if(this.dictParams.field_id){
                    formDictConfiguration.field_id = this.dictParams.field_id;
                }

                this.tabScreenLoading = true;
                this.http.post(url,formDictConfiguration).then(resp =>{
                    if(arr){
                        // -d1-是写死的，根据这个来拆分
                        this.clickRow.form_field_dict_domain_name = arr[0];
                        this.clickRow.form_field_dict_item = arr[1];

                        this.clickRow.optional_dic_val = arr[0] +" + " + arr[1];

                    }else{
                        this.clickRow.form_field_dict_domain_name = null;
                        this.clickRow.form_field_dict_item = null;
                        this.clickRow.optional_dic_val = null;
                    }
                    this.confirmToOpenDictDialogVisible = false;
                    this.tabScreenLoading = false;
                }).catch(error =>{
                    this.tabScreenLoading = false;
                })


            },
            openPreviewPage(){
                this.confirmOpenPreviewDialogVisible = false;
                let {href} = this.$router.resolve({
                    name: 'commonView',
                    path: '/common-view',
                    query: {dfKey:this.node.label}
                });
                window.open(href, '_blank')
            },
            openPreviewDialog(){
                this.confirmOpenPreviewDialogVisible = true;
            },
            // TODO
            saveDefaultSelect(){

            },
            // TODO
            closeDefaultMethod(){

            }

        }
    }
</script>

<style scoped>
    .el-table /deep/ thead {
        font-size: 12px;
    }

    .el-table /deep/ th {
        text-align: center;

    }

    .data-source-name {
        text-align: left;
        margin-left: 10px;
    }

    .data-source-name-font {

        font-size: 15px;
        color: black;
        font-weight: 700;
    }

    .data-source-description-font {

    }


    /deep/ .el-input-number--small .el-input__inner {
      padding-left: 10px;
      padding-right: 10px;
    }

    /deep/ .el-input-number--small .el-input-number__decrease, /deep/ .el-input-number--small .el-input-number__increase {
      width: 15px;
      font-size: 13px;
    }


    /deep/ .el-input-number--small,/deep/ .el-input-number{
        width: 100%;
    }

    /deep/ .vxe-table .vxe-cell {
        padding: 0 5px;
    }


    /deep/ .el-input__inner {
        padding: 0 5px;
    }


    .breadcrumb {
        padding: 8px 15px;
        margin-bottom: 20px;
        list-style: none;
        background-color: #f5f5f5;
        border-radius: 4px;
        text-align: left;
        margin-right: 10px;
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

    /deep/ .vxe-table .vxe-body--column, /deep/ .vxe-table .vxe-footer--column,/deep/ .vxe-table .vxe-header--column {
         line-height: 18px;
         text-align: center;
    }

    /deep/ .vxe-table {
        margin: 0px 10px;
    }

    /deep/ .vxe-table.size--small .vxe-body--column, /deep/ .vxe-table.size--small .vxe-footer--column, /deep/ .vxe-table.size--small .vxe-header--column {
        padding: 2px 0;
    }



</style>
