<template>
    <div>

        <el-dialog title="Dictionary"  :visible.sync="confirmToOpenDictDialogVisible"
                   :close-on-click-modal="false"
                   @closed ="closeDictionaryMethod"
                   :center="true"
                   size="tiny">

            <el-collapse  v-model="activeNames" ><!--form表单折叠板-->
                <el-collapse-item name="1">
                    <template slot="title">
          <span style="text-align: right;width: 100%"> <template v-if="activeNames.includes('1')"> Collapse Filter </template>
             <template v-else> Expand Filter </template>
            &nbsp; </span>
                    </template>
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

                        <el-button type="primary" size="small" @click="handleDictReset"><i class="fa fa-eraser"
                                                                                           aria-hidden="true"></i> Reset
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



        <el-dialog title="Default Val Strategy"  :visible.sync="confirmToOpenDefaultDialogVisible"
                   :close-on-click-modal="false"
                   @closed ="closeDefaultMethod"
                   :center="true"
                   size="tiny">
           <el-row style="padding-bottom: 10px">
               <el-col :span="2" style="text-align: right;padding-top: 5px">DF Key:&nbsp;&nbsp</el-col>
               <el-col :span="5"> <el-input  :disabled="true"  v-model="defaultsConfigurationDO.form_df_key"></el-input> </el-col>

               <el-col :span="3" style="text-align: right;padding-top: 5px">Field Key:&nbsp;&nbsp;</el-col>
               <el-col :span="5"> <el-input  :disabled="true"  v-model="defaultsConfigurationDO.form_field_key"></el-input> </el-col>

               <el-col :span="3" style="text-align: right;padding-top: 5px">Element Type:&nbsp;&nbsp;</el-col>
               <el-col :span="6"> <el-input  :disabled="true"  v-model="defaultsConfigurationDO.element_type"></el-input> </el-col>

           </el-row>


            <el-form
                    label-position="right"
                    label-width="120px"
            >



                <el-radio v-model="defaultsConfigurationDO.field_type" label="MANUAL">Manual</el-radio>
                <div style="padding-bottom: 10px"></div>

                <el-form-item label="Value: " >
                    <el-input  v-model="defaultsConfigurationDO.manual_conf" :disabled="defaultsConfigurationDO.field_type != 'MANUAL'" size="small"  :placeholder = "manualPlaceHolder"></el-input>
                </el-form-item>

                <div style="padding-bottom: 10px"></div>
                <el-radio v-model="defaultsConfigurationDO.field_type" label="AUTO">Auto</el-radio>
                <div style="padding-bottom: 10px"></div>

                <el-form-item label="Type: "   >
                    <el-select v-model="defaultsConfigurationDO.plugin_type" :disabled="defaultsConfigurationDO.field_type != 'AUTO' "  size="small">
                        <el-option label="SQL" value="SQL"></el-option>
                    </el-select>

                </el-form-item>

                <el-form-item  label="JDBC URL: " >
                    <el-input  v-model="defaultsConfigurationDO.plugin_jdbc_url" placeholder="jdbc:mysql://localhost:3306/d1_core?useSSL=false" :disabled="defaultsConfigurationDO.field_type != 'AUTO'"  size="small"></el-input>
                </el-form-item>

                <el-form-item label="Username: " >
                    <el-input v-model="defaultsConfigurationDO.plugin_username"  :disabled="defaultsConfigurationDO.field_type != 'AUTO'" size="small"></el-input>
                </el-form-item>

                <el-form-item label="Password: " >
                    <el-input  v-model="defaultsConfigurationDO.plugin_password" :disabled="defaultsConfigurationDO.field_type != 'AUTO'" size="small"></el-input>
                </el-form-item>

                <el-form-item label="SQL: " >
                    <el-input v-model="defaultsConfigurationDO.plugin_sql" placeholder="select count(*) from queue_message" type="textarea" :disabled="defaultsConfigurationDO.field_type != 'AUTO' || defaultsConfigurationDO.plugin_type != 'SQL' "  size="small"></el-input>
                </el-form-item>

                <el-form-item label="cron: " >
                    <el-input  v-model="defaultsConfigurationDO.plugin_cron" placeholder="Seconds Minutes Hours DayofMonth Month DayofWeek Year " :disabled="defaultsConfigurationDO.field_type != 'AUTO'"  size="small"></el-input>
                </el-form-item>


                <el-form-item label="Enabled: " >
                    <el-switch v-model="defaultsConfigurationDO.plugin_enabled" :disabled="defaultsConfigurationDO.field_type != 'AUTO'"  size="small" active-color="green"  inactive-color="gray"  active-value="true" ></el-switch>

                </el-form-item>
                <div style="text-align: center;color: red">
                    <el-button type="primary"  @click="getTestResult" :disabled="defaultsConfigurationDO.field_type != 'AUTO'"  size="mini">Test Result</el-button>
                </div>
                <div style="padding-bottom: 10px"></div>



              <div v-if="showTestResult" style="text-align: center;">
                  {{testResult}}
              </div>






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
                    </el-button>
                </el-col>

            </el-row>



        </div>
        <br/>
        <div class="table">
            <vxe-table border
                      ref="xTable"
                      resizable
                      stripe
                      show-overflow
                      highlight-current-row
                      highlight-hover-row
                      highlight-hover-column
                      highlight-current-column
                      row-id="id"
                      :edit-config="editConfig"
                      :data.sync="tableData"
                      @cell-dblclick="dbClickCustomOperation"
                      :cell-class-name ='colorClassChange'
            >

                <vxe-table-column type ="index" width ="40" title="No." fixed ="left"></vxe-table-column>

                <vxe-table-column field='db_field_name' minWidth ="120" title="Field Name" fixed ="left"></vxe-table-column>
                <vxe-table-column field='db_field_type' minWidth ="110" title="Field Type" fixed ="left"></vxe-table-column>
                <vxe-table-column field='db_field_comment' minWidth ="120" title="Field Description" ></vxe-table-column>
                <vxe-table-column field='view_field_label' minWidth ="120" title="Field Label" :editRender ="{name: 'input'}"></vxe-table-column>

                <vxe-table-column title="Form" >
                    <vxe-table-column field='form_field_visible' minWidth ="60" title="Show ?" :editRender ="elSwitchConfig"> </vxe-table-column>
                    <vxe-table-column field='form_field_sequence' minWidth ="90" title="Sequence" :editRender ="elInputNumberConfig"></vxe-table-column>
                    <vxe-table-column field='form_field_query_type' minWidth ="200" title="Element Type" :editRender ="elementTypeCofig"></vxe-table-column>
                    <vxe-table-column field='form_field_child_field_name' minWidth ="100" title="Child Field Name" :editRender ="childFieldConfig"></vxe-table-column>
                    <vxe-table-column field='optional_dic_val' minWidth ="100" title="Optional Values" :editRender ="{name: 'input'}" :formatter="dictValFormatter" ></vxe-table-column>
                    <vxe-table-column field='form_field_use_default_val' minWidth ="100" title="Use Default Value?" :editRender ="elSwitchConfig"></vxe-table-column>
                    <vxe-table-column field='form_field_def_val_strategy' minWidth ="100" title="Default Value Strategy" :editRender ="{name: 'input'}"></vxe-table-column>
                    <vxe-table-column field='form_field_default_val' minWidth ="100" title="Default Value" ></vxe-table-column>
                </vxe-table-column>

                <vxe-table-column title="List / Table" >
                    <vxe-table-column field='table_field_visible' minWidth ="60" title="Show ?" :editRender ="elSwitchConfig"> </vxe-table-column>
                    <vxe-table-column field='table_field_sequence' minWidth ="90" title="Sequence" :editRender ="elInputNumberConfig"></vxe-table-column>
                    <vxe-table-column field='table_field_order_by' minWidth ="110" title="Default Order By" :editRender ="{name: 'ElSelect',props: {clearable: false},options: [
                       {label: 'NONE',value: 'NONE'}, {label: 'DESC',value: 'DESC'},{label: 'ASC',value: 'ASC'}]}"></vxe-table-column>

                    <vxe-table-column field='table_field_column_width' minWidth ="70" title="Width" :editRender ="elInputNumberConfig"></vxe-table-column>
                    <vxe-table-column field='table_parent_label' minWidth ="80" title="Parent Label" :editRender ="{name: 'input'}" ></vxe-table-column>
                </vxe-table-column>

                <vxe-table-column title="Export" >
                    <vxe-table-column field='export_field_visible' minWidth ="60" title="Show ?" :editRender ="elSwitchConfig"> </vxe-table-column>
                    <vxe-table-column field='export_field_sequence' minWidth ="90" title="Sequence" :editRender ="elInputNumberConfig"></vxe-table-column>
                </vxe-table-column>
                    <vxe-table-column type ="width" width ="90"  title='Operation'  fixed ="right"   >
                        <template slot = "default" slot-scope="scope">
                            <vxe-button @click="revertRow(scope)">Revert</vxe-button>
                        </template>

                        <template slot = "header" slot-scope="scope">
                            Operation
                            <vxe-button @click="revertTable">Revert</vxe-button>
                        </template>
                    </vxe-table-column>

            </vxe-table>



        </div>
    </div>
</template>

<script>


    import QueryFormType from "../assets/js/constant/query-form-type";
    import util from '@/util/util.js'

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
                activeNames: ["1"],
                elSwitchConfig:{
                    name: 'ElSwitch', type: 'visible', props: {
                        activeValue: 1,
                        inactiveValue: 0,
                        activeColor:"green",
                        inactiveColor:"gray"
                    }
                },
                elInputNumberConfig:{
                    name: 'ElInputNumber', props: {max: 9999, min: 1}
                },
                childFieldConfig:{
                    name: 'ElSelect', props: {
                        clearable: true,

                    },
                    options: [],
                    events:{
                        clear:function (obj) {
                            let row = obj.row;
                            row.form_field_child_field_name = null;
                        }
                    }

                },
                elementTypeCofig:{
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
                            label: 'SINGLE_CHOICE_LIST_R1',
                            value: 'SINGLE_CHOICE_LIST_R1'
                        },  {
                            label: 'SINGLE_CHOICE_LIST',
                            value: 'SINGLE_CHOICE_LIST'
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
                    ],
                    events:{
                        change:function (obj,val ) {
                            let row = obj.row;
                            let column = obj.column;
                            let property = column.property;

                            if((val == QueryFormType.MULTIPLE_CHOICE_LIST ||
                                val == QueryFormType.SINGLE_CHOICE_LIST ||
                                val == QueryFormType.SINGLE_CHOICE_LIST_R1)){

                                if(val == QueryFormType.MULTIPLE_CHOICE_LIST){
                                    row.form_field_child_field_name = null;
                                }
                                row.form_field_use_default_val = 0;
                                row.form_field_default_val = null;
                                row.form_field_def_val_strategy = null;

                                if(row.defaults_configuration){
                                    row.defaults_configuration.field_type="MANUAL";
                                    row.defaults_configuration.manual_conf = "";
                                }
                            }else{
                                // dict 相关的字段
                                row.optional_dic_val = null;
                                row.form_field_dict_domain_name = null;
                                row.form_field_dict_item = null;
                                row.form_field_child_field_name = null;

                                if(row.dict_configuration){
                                    row.dict_configuration.field_domain = null;
                                    row.dict_configuration.field_item = null;
                                }
                            }
                        }
                    }
                },
                dictValFormatter: function(obj){
                    let row = obj.row;
                    if(row.form_field_dict_domain_name){
                        return row.form_field_dict_domain_name + " + " + row.form_field_dict_item;
                    }
                    return '';

                },
                editConfig:{
                    trigger: 'dblclick',
                    mode: 'cell',
                    activeMethod : function(obj){
                        let row = obj.row;
                        let column = obj.column;
                        let property = column.property;
                        // 样式， disabeled以及行为
                        if ((row.form_field_query_type == QueryFormType.MULTIPLE_CHOICE_LIST ||
                            row.form_field_query_type == QueryFormType.SINGLE_CHOICE_LIST ||
                            row.form_field_query_type == QueryFormType.SINGLE_CHOICE_LIST_R1)){
                            if(property == 'form_field_default_val' || property == 'form_field_use_default_val' ||  property == 'form_field_def_val_strategy')
                                return false;
                        }else{
                            if(property == 'optional_dic_val'){
                                return false;
                            }
                        }

                        if(property == 'form_field_child_field_name'){
                            if(row.form_field_query_type == QueryFormType.MULTIPLE_CHOICE_LIST){
                                return  true;
                            }else{
                                return  false;
                            }
                        }
                        return true;
                    },
                    showStatus:true
                },
                tabScreenLoading:false ,
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
                queryDictUrl:"d1-core/d1/dict/manage/domain",
                confirmOpenPreviewDialogVisible:false,
                confirmToOpenDefaultDialogVisible:false,

                defaultsConfigurationDO:{
                    id:'',
                    form_field_key:'',
                    form_df_key:'',
                    field_type: "MANUAL",
                    plugin_cron:'',
                    plugin_jdbc_url:'',
                    plugin_username:'',
                    plugin_password:'',
                    plugin_sql:'',
                    plugin_enabled:'false',
                    manual_conf:"",
                    plugin_type:'SQL',
                    element_type:''
                },
                showTestResult:false,
                testResult:null,
                // 更改cell样式，并在这里进行改值
                colorClassChange:function (obj) {
                    //return 'color-gray';
                    let row = obj.row;
                    let column = obj.column;
                    let property = column.property;
                    // 颜色更改
                    if ((row.form_field_query_type == QueryFormType.MULTIPLE_CHOICE_LIST ||
                        row.form_field_query_type == QueryFormType.SINGLE_CHOICE_LIST ||
                        row.form_field_query_type == QueryFormType.SINGLE_CHOICE_LIST_R1)){
                        if(property == 'form_field_default_val' || property == 'form_field_use_default_val' ||  property == 'form_field_def_val_strategy')
                            return 'color-gray';
                    }else{
                        if(property == 'optional_dic_val' ){
                            return 'color-gray';
                        }
                    }

                    if(property == 'form_field_child_field_name'){
                        if( row.form_field_query_type == QueryFormType.MULTIPLE_CHOICE_LIST)   {
                            return '';
                        }else{
                            return 'color-gray';
                        }
                    }
                    return '';
                },
                manualPlaceHolder:"Please inter a json Array"

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

            refreshFormTableSettings(){
                let url = this.baseUrl + 'd1-core/d1/datasource/refresh-df-form-table-setting?dfKey=' + this.node.label;
                this.tabScreenLoading = true;
                this.http.post(url).then(resp => {
                    this.tabScreenLoading = false;
                    this.tableData = resp.data;

                    this.generateTabList(this.tableData);
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

                    this.generateTabList(this.tableData);
                }).catch(error =>{
                    this.tabScreenLoading = false;
                })

            },
            generateTabList(tableData){
                this.childFieldConfig.options = [];
                for(let i = 0; i< tableData.length;i ++ ){
                    let option = {};
                    option.value = tableData[i].db_field_name;
                    option.label = tableData[i].db_field_name;
                    this.childFieldConfig.options.push(option);
                }

            },
            saveAll() {
                let isValidate = this.validateData(this.tableData);
                if(isValidate){
                    this.realSaveFormTable(this.tableData);
                }
            },
            validateData(saveDataArr){
                for(var i in saveDataArr){
                    let rowData = saveDataArr[i];
                    let fieldName = rowData.db_field_name;
                    let queryType = rowData.form_field_query_type;

                    if(QueryFormType.SINGLE_CHOICE_LIST_R1 === queryType || QueryFormType.SINGLE_CHOICE_LIST === queryType
                        || QueryFormType.MULTIPLE_CHOICE_LIST === queryType){
                        if(!rowData.form_field_dict_domain_name ){
                            this.$message.warning(fieldName +'\'s query Type is '+ queryType + ',Optional Values can not be empty;like:' +fieldName);
                            return false;
                        }
                        if(rowData.form_field_use_default_val || rowData.form_field_def_val_strategy || rowData.form_field_default_val){
                            this.$message.warning(fieldName +'\'s query Type is '+ queryType + ', can not use Default Val');
                            return false;
                        }
                    }else{
                        if(rowData.optional_dic_val) {
                            this.$message.warning(fieldName + '\'s query Type is ' + queryType + ', can not use Optional Values');
                            return false;
                        }
                    }

                    if(rowData.form_field_child_field_name){
                        if(rowData.form_field_query_type == QueryFormType.MULTIPLE_CHOICE_LIST){
                        }else{
                            this.$message.warning(fieldName + '\'s query Type is ' + queryType + ', can not use Optional Values');
                            return false;
                        }
                    }

                }
                return true;
            },
            realSaveFormTable(saveDataArr) {
                console.log(saveDataArr);
                let url = this.baseUrl + 'd1-core/d1/datasource/save-df-form-table-setting';
                this.tabScreenLoading = true;
                this.http.post(url, saveDataArr).then(resp => {
                    this.tabScreenLoading = false;

                    this.loadFormTableSettings();
                }).catch(error =>{
                    this.tabScreenLoading = false;
                })
            },
            dbClickCustomOperation(obj){
                let column = obj.column;
                let row = obj.row;

                this.clickRow = row;
                let property = column.property;
                let queryType = row.form_field_query_type;

                if(property && property == 'optional_dic_val'){

                    if(QueryFormType.SINGLE_CHOICE_LIST_R1 === queryType || QueryFormType.SINGLE_CHOICE_LIST === queryType
                        || QueryFormType.MULTIPLE_CHOICE_LIST === queryType){
                        this.loadDicVal();
                    }

                }else if( property && property == 'form_field_def_val_strategy'){
                    if(QueryFormType.SINGLE_CHOICE_LIST_R1 === queryType || QueryFormType.SINGLE_CHOICE_LIST === queryType
                        || QueryFormType.MULTIPLE_CHOICE_LIST === queryType){
                        // do nothing
                    }else{
                        this.loadDefaultStrategyVal();
                    }
                }
            },
            loadDicVal(){
                let row = this.clickRow;
                let dfKey = row.df_key;
                let fieldName = row.db_field_name;


                let dictConfiguration = this.clickRow.dict_configuration;

                if (!dictConfiguration){
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
                }else{
                    this.confirmToOpenDictDialogVisible = true;
                    this.dictParams.field_form_df_key = dfKey;
                    this.dictParams.field_form_field_key = fieldName;
                    this.dictParams.field_domain = dictConfiguration.field_domain;
                    this.dictParams.field_item = dictConfiguration.field_item;
                    this.dictParams.field_id = dictConfiguration.field_id;
                    this.dictSelect = dictConfiguration.field_domain +'-d1-' + dictConfiguration.field_item;
                    this.handleDictQuery();
                }




            },


            loadDefaultStrategyVal(){
                let row = this.clickRow;
                let dfKey = row.df_key;
                let fieldName = row.db_field_name;
                let elementType = row.form_field_query_type;
    
                this.defaultsConfigurationDO.form_field_key = fieldName;
                this.defaultsConfigurationDO.form_df_key = dfKey;
                this.defaultsConfigurationDO.element_type = elementType;

                this.handleManualConfPlaceHolder(elementType);
                
                let currentDefaultsConfigurationDO = row.defaults_configuration;


                this.confirmToOpenDefaultDialogVisible = true;
                // 根据在前端是否save过确定是否去后端查询值
                if(currentDefaultsConfigurationDO){

                    this.defaultsConfigurationDO.field_type = currentDefaultsConfigurationDO.field_type;
                    this.defaultsConfigurationDO.plugin_type = currentDefaultsConfigurationDO.plugin_type;
                    this.defaultsConfigurationDO.plugin_cron = currentDefaultsConfigurationDO.plugin_cron;
                    this.defaultsConfigurationDO.id = currentDefaultsConfigurationDO.id;
                    this.defaultsConfigurationDO.plugin_jdbc_url = currentDefaultsConfigurationDO.plugin_jdbc_url;
                    this.defaultsConfigurationDO.plugin_username = currentDefaultsConfigurationDO.plugin_username;
                    this.defaultsConfigurationDO.plugin_password = currentDefaultsConfigurationDO.plugin_password;

                    this.defaultsConfigurationDO.plugin_sql = currentDefaultsConfigurationDO.plugin_sql;
                    this.defaultsConfigurationDO.plugin_enable = currentDefaultsConfigurationDO.plugin_enable;
                    this.defaultsConfigurationDO.manual_conf = currentDefaultsConfigurationDO.manual_conf;

                }else{
                    this.tabScreenLoading = true;
                    let url = this.baseUrl +"d1-core/d1/defaults-configuration";
                    url += "?field_form_df_key=" + dfKey + "&field_form_field_key=" + fieldName;
                    this.http.get(url).then(resp => {
                        this.tabScreenLoading =false;
                        let data = resp.data;
                        if(data){
                            if(data.field_type){
                                this.defaultsConfigurationDO.field_type = data.field_type;
                            }
                            if(data.plugin_type){
                                this.defaultsConfigurationDO.plugin_type = data.plugin_type;
                            }

                            this.defaultsConfigurationDO.plugin_cron = data.plugin_cron;
                            this.defaultsConfigurationDO.id = data.id;
                            this.defaultsConfigurationDO.plugin_jdbc_url = data.plugin_jdbc_url;
                            this.defaultsConfigurationDO.plugin_username = data.plugin_username;
                            this.defaultsConfigurationDO.plugin_password = data.plugin_password;

                            this.defaultsConfigurationDO.plugin_sql = data.plugin_sql;
                            this.defaultsConfigurationDO.plugin_enable = data.plugin_enable;
                            this.defaultsConfigurationDO.manual_conf = data.manual_conf;
                        }
                    }).catch(error => {
                        this.tabScreenLoading =false;
                    })
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
                this.activeNames = ["1"];
            },
            clearSelect(){
                this.dictSelect = '';
            },
            saveDictSelect(){


                // let url = this.baseUrl + "d1-core/d1/form-dict-configuration";
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




                if(arr){
                    // -d1-是写死的，根据这个来拆分
                    this.clickRow.form_field_dict_domain_name = arr[0];
                    this.clickRow.form_field_dict_item = arr[1];

                    this.clickRow.optional_dic_val = arr[0] + " + " + arr[1];

                }else{
                    this.clickRow.form_field_dict_domain_name = null;
                    this.clickRow.form_field_dict_item = null;
                    this.clickRow.optional_dic_val = '';
                }
                this.clickRow.dict_configuration =  formDictConfiguration;
                this.confirmToOpenDictDialogVisible = false;
                //
                // this.http.post(url,formDictConfiguration).then(resp =>{
                //     if(arr){
                //         // -d1-是写死的，根据这个来拆分
                //         this.clickRow.form_field_dict_domain_name = arr[0];
                //         this.clickRow.form_field_dict_item = arr[1];
                //
                //         this.clickRow.optional_dic_val = arr[0] +" + " + arr[1];
                //
                //     }else{
                //         this.clickRow.form_field_dict_domain_name = null;
                //         this.clickRow.form_field_dict_item = null;
                //         this.clickRow.optional_dic_val = '';
                //     }
                //     this.confirmToOpenDictDialogVisible = false;
                //     this.tabScreenLoading = false;
                // }).catch(error =>{
                //     this.tabScreenLoading = false;
                // })

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
                let updateRecords = this.$refs.xTable.getUpdateRecords();
                if(updateRecords == 0){
                    this.openPreviewPage();
                }else{
                    this.confirmOpenPreviewDialogVisible = true;
                }

            },
            saveDefaultSelect(){
                let url = this.baseUrl + 'd1-core/d1/defaults-configuration';
                // 校验输入的为json数组
                if(this.defaultsConfigurationDO.field_type =='MANUAL'){
                    let manualVal = this.defaultsConfigurationDO.manual_conf;
                    if(manualVal){
                        try{
                            let manualValArr = JSON.parse(manualVal);
                            if( manualValArr instanceof  Array){
                                // Nothing to do
                            }else{
                                this.$message.warning("Manual Method's value must be a json array ")
                                return;
                            }
                        }catch (e) {
                            this.$message.warning("Manual Method's value must be a json array ")
                            return;
                        }
                    }
                }


                // 回填值
                this.clickRow.form_field_def_val_strategy = this.defaultsConfigurationDO.field_type;
                if(this.defaultsConfigurationDO.field_type =='MANUAL'){
                    this.clickRow.form_field_default_val = this.defaultsConfigurationDO.manual_conf;
                }



                let currentDefaultsConfiguration = util.deepClone(this.defaultsConfigurationDO);
                this.clickRow.defaults_configuration = currentDefaultsConfiguration;
                this.confirmToOpenDefaultDialogVisible = false;


                // 不进行实际的保存操作
                // this.tabScreenLoading = true;
                // this.http.post(url, this.defaultsConfigurationDO).then(resp =>{
                //     this.clickRow.form_field_def_val_strategy = this.defaultsConfigurationDO.field_type;
                //
                //     if(this.defaultsConfigurationDO.field_type =='MANUAL'){
                //         this.clickRow.form_field_default_val = this.defaultsConfigurationDO.manual_conf;
                //     }
                //
                //     this.tabScreenLoading =false;
                //     this.confirmToOpenDefaultDialogVisible =false;
                // }).catch(error =>{
                //     this.tabScreenLoading = false;
                // })

            },
            closeDefaultMethod(){
                this.defaultsConfigurationDO = {
                    id:'',
                    form_field_key:'',
                    form_df_key:'',
                    field_type: "MANUAL",
                    plugin_cron:'',
                    plugin_jdbc_url:'',
                    plugin_username:'',
                    plugin_password:'',
                    plugin_sql:'',
                    plugin_enabled:'false',
                    manual_conf:"",
                    plugin_type:'SQL'
                };
                this.showTestResult = false;
                this.testResult = null;
            },
            getTestResult(){
                let url = this.baseUrl +"d1-core/d1/defaults-configuration/test-sql";
                this.tabScreenLoading = true;
                this.http.post(url,this.defaultsConfigurationDO).then(resp =>{
                    this.showTestResult = true;
                    this.tabScreenLoading = false;
                    let data = resp.data;
                    this.testResult = data;
                }).catch(error =>{
                    this.tabScreenLoading = false;
                })
            },
            revertRow(scope){
                this.$refs.xTable.revert(scope.row);
            },
            revertTable(){
                this.$refs.xTable.revert();
            },
            handleDictReset(){
                this.dictCurrentPage = 1;
                this.dictParams.field_domain ='';
                this.dictParams.field_item = '';
                this.dictParams.field_value = '';
                this.handleDictQuery();
            },
            handleManualConfPlaceHolder(elementType){
                if(QueryFormType.MULTIPLE_CHOICE_LIST == elementType){
                    this.manualPlaceHolder = 'for example : ["value1","value2"]';
                }else if(QueryFormType.SINGLE_CHOICE_LIST == elementType || QueryFormType.SINGLE_CHOICE_LIST_R1 == elementType){
                    this.manualPlaceHolder = 'for example : ["value1"]';
                }else if (QueryFormType.SINGLE_DATE == elementType){
                    this.manualPlaceHolder = 'for example : ["1970-01-01"]';
                } else if(QueryFormType.DATE_RANGE == elementType){
                    this.manualPlaceHolder = 'for example : ["1970-01-01","2010-01-09"]';
                }else if (QueryFormType.SINGLE_DATETIME == elementType){
                    this.manualPlaceHolder = 'for example : ["1970-01-01 00:00:00"]';
                }else if (QueryFormType.DATE_TIME_RANGE == elementType){
                    this.manualPlaceHolder = 'for example : ["1970-01-01 00:00:00","1970-01-01 08:00:00"]';
                }else{
                    this.manualPlaceHolder = 'for example : ["inputValue"]';
                }

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

    /deep/ .color-gray{
        background-color: gray;
    }



</style>
