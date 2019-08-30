<template>

    <div  v-loading="fullTabLoading"
          element-loading-text="Loading, please wait..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)">


        <div  v-loading.fullscreen.lock="fullScreenLoading"
              element-loading-text="Loading, please wait..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)">

        </div>

        <el-dialog
                title="Confirm"
                :visible.sync="confirmToRemoveDialogVisible"
                :close-on-click-modal="false"
                :center="true"
                size="tiny">
            <div class="dialog">{{removeDialogText}}</div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirmToRemoveDialogVisible = false">No</el-button>
              <el-button type="danger" @click="confirmToRemove()">Yes</el-button>
            </span>
        </el-dialog>

        <el-dialog :title = "dictStrategyTitle" :visible.sync="confirmToOpenDictStrategyDialogVisible"
                   :close-on-click-modal="false"
                   @closed ="closeDictStrategyMethod"
                   :center="true"
                   size="tiny"
        >

            <el-form
                    label-position="right"
                    label-width="120px"
            >

                <el-form-item label="Type: "   >
                    <el-select v-model="dictStrategyDO.type"   size="small">
                        <el-option label="SQL" value="SQL"></el-option>
                    </el-select>

                </el-form-item>

                <el-form-item  label="JDBC URL: " >
                    <el-input  v-model="dictStrategyDO.param_jdbc_url"  placeholder="jdbc:mysql://localhost:3306/d1_core?useSSL=false"  size="small"></el-input>
                </el-form-item>

                <el-form-item label="Username: " >
                    <el-input v-model="dictStrategyDO.param_username" size="small"></el-input>
                </el-form-item>

                <el-form-item label="Password: " >
                    <el-input  v-model="dictStrategyDO.param_password"  size="small"></el-input>
                </el-form-item>

                <el-form-item label="SQL: " >
                    <el-input v-model="dictStrategyDO.param_sql" placeholder="select count(*) from queue_message" type="textarea" :disabled="dictStrategyDO.type != 'SQL' "  size="small"></el-input>
                </el-form-item>

                <el-form-item label="Enable: "  >
                   <el-switch v-model="dictStrategyDO.enable"></el-switch>
                </el-form-item>


                <el-form-item label="cron: " >
                    <el-input  v-model="dictStrategyDO.cron" placeholder="Seconds Minutes Hours DayofMonth Month DayofWeek Year " size="small"></el-input>
                </el-form-item>

                <div style="text-align: center;color: red">
                    <el-button type="primary"  @click="getTestResult" size="mini">Test Result</el-button>
                    <span v-if="showTestResult"> &nbsp; Top 5 </span>
                </div>

            </el-form>


            <el-table v-if="showTestResult"
                    :data="dictStrategyTableData"
                    border
                    style="margin-top: 10px;"
                    row-class-name="success-row"
                      size ="mini"
            >

                <el-table-column label="Value" prop="value" ></el-table-column>
                <el-table-column label="Label" prop="label" ></el-table-column>
                <el-table-column label="Sequence" prop="sequence" ></el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary"   @click="saveDictStrategy">Save</el-button>
                <el-button  @click="confirmToOpenDictStrategyDialogVisible = false">Close</el-button>
            </div>
        </el-dialog>




        <el-dialog :title = "dictBaseTitle" :visible.sync="confirmToOpenDictBaseDialogVisible"
                   :close-on-click-modal="false"
                   @closed ="closeDictBaseMethod"
                   :center="true"
                   size="tiny"
        >

            <el-form

                    label-position="right"  :inline="true"
                    label-width="120px"
            >
            <el-row>

                <el-form-item  label="Domain: " required>
                    <el-input  v-model="dictBaseDO.domain"   size="small"></el-input>
                </el-form-item>

                <el-form-item label="Item: " required>
                    <el-input v-model="dictBaseDO.item"   size="small"></el-input>
                </el-form-item>
            </el-row>
            </el-form>
            <div style="padding: 10px"> <b>Value&Label List </b></div>
            <div class="area">
                <el-form

                        label-position="top"  :inline="true"
                >
                <template v-for = "(item, index) in valueLabelList">
                    <el-row>
                    <el-form-item v-if="index === 0" label="Value: " >
                        <el-input  v-model="item.value"   size="small"></el-input>
                    </el-form-item>
                        <el-form-item v-else >
                            <el-input  v-model="item.value"   size="small"></el-input>
                        </el-form-item>

                    <el-form-item v-if="index === 0" label="Label: " >
                        <el-input v-model="item.label"   size="small"></el-input>
                    </el-form-item>
                        <el-form-item v-else>
                            <el-input v-model="item.label"   size="small"></el-input>
                        </el-form-item>

                        <el-form-item >
                   <el-button size="small" @click="addValueLabelList(index)" >+</el-button>
                        </el-form-item>
                        <el-form-item v-if ="index != 0 ">
                        <el-button size="small" @click="deleteValueLabelList(index)" >-</el-button>
                        </el-form-item>
                    </el-row>
                </template></el-form>
            </div>






            <div slot="footer" class="dialog-footer">
                <el-button type="primary"   @click="saveDictBase()">Save</el-button>
                <el-button @click="confirmToOpenDictBaseDialogVisible = false">Close</el-button>
            </div>


        </el-dialog>

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

                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>


        <div style="width: 100%;padding-top: 5px;padding-bottom: 5px">
            <el-row>
                <el-col :span="17">
                    &nbsp;
                </el-col>
                <el-col :span="6" style="text-align: right">
                    <el-button size="mini" type="success" @click="addDictItem()">Add</el-button>

                    <el-button size="mini" type="primary" @click="saveDictItem()">Save</el-button>
                </el-col>


            </el-row>

        </div>

        <div  v-loading="tableLoading"
             element-loading-text="loading,wait please"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
                &nbsp;



        <vxe-table
                border
                resizable
                ref="xTable"
                :tree-config="{children: 'dict_list'}"
                :data.sync="dictTableData"
                :edit-config="{trigger: 'dblclick', mode: 'cell', activeMethod: activeCellMethod,showStatus:true}"
        >


            <vxe-table-column type="index" title="No." tree-node></vxe-table-column>
            <vxe-table-column field="field_domain" title="Domain" :edit-render="{name: 'input'}"   ></vxe-table-column>
            <vxe-table-column field="field_item" title="Item"  :edit-render="{name: 'input'}" ></vxe-table-column>





            <vxe-table-column field="field_value" title="Value" :edit-render="{name: 'input'}" ></vxe-table-column>


            <vxe-table-column field="field_label" title="Label" :edit-render="{name: 'input'}" ></vxe-table-column>

            <vxe-table-column field="field_sequence" title="Sequence"  :edit-render="{name: 'ElInputNumber'}"></vxe-table-column>


            <vxe-table-column field="field_id" title="ID"  ></vxe-table-column>
            <vxe-table-column field="field_parent_id" title="Parent Id"  :edit-render="{name: 'input'}" ></vxe-table-column>
            <vxe-table-column title = "Operation" fixed="right" min-width="150px" >
                <template slot-scope="scope">
                    <div  v-if="scope.row.field_domain" style="color: red">

                        <el-button  @click="handleStrategyEdit(scope)" size="mini" >Strategy</el-button>
                        <el-button  @click="handleDeleteDialog(scope,'domain')" size="mini" >Delete</el-button>
                    </div>

                    <div v-else>

                        <el-button  v-if="scope.row.field_id && scope.data && scope.data[scope.$seq - 1].dict_list.length > 1" @click="handleDeleteDialog(scope,'value')" size="mini" >Delete</el-button>

                    </div>


                </template>
            </vxe-table-column>
        </vxe-table>

        </div>


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


    </div>

</template>



<script>
    import util from '@/util/util.js'

     export default {
        name:'dict-mgmt',
        data(){
            return {
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
                dictStrategyTitle:"Edit Dict Strategy ",
                confirmToOpenDictStrategyDialogVisible:false,
                dictStrategyDO:{
                    id:"",
                    domain:"",
                    item:"",
                    type:"SQL",
                    param_jdbc_url:"",
                    param_username:"",
                    param_password:"",
                    param_sql:"",
                    cron:"",
                    enable:false
                },
                dictBaseTitle:'New Domain Item Config',
                dictBaseDO:{
                    domain:'',
                    item:''
                },
                tableLoading:false,
                confirmToOpenDictBaseDialogVisible:false,
                valueLabelList:[
                    {
                        label:'',
                        value:''
                    }
                ],
                fullTabLoading:false,
                fullScreenLoading:false,
                dictStrategyTableData:[],
                showTestResult:false,
                activeNames: [],
                removeDialogText:'',
                removeType:'',
                deleteScope:null,
                confirmToRemoveDialogVisible:false
            }
        },
        computed: {
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
            this.handleDictQuery();
        },
        methods:{
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
            handleStrategyEdit(scope){
                let row = scope.row;
                this.confirmToOpenDictStrategyDialogVisible = true;
                this.fullScreenLoading  = true;
                let url = this.baseUrl + "d1-core/d1/dict/plugin/domain-item";
                let fieldDomain = row.field_domain;
                let fieldItem = row.field_item;

                this.dictStrategyDO.domain = fieldDomain;
                this.dictStrategyDO.item = fieldItem;

                url += "?domain=" + fieldDomain + "&item=" + fieldItem;
                this.http.get(url).then(resp =>{
                    let data = resp.data;

                    if(data){
                        this.dictStrategyDO.id = data.id;
                        this.dictStrategyDO.sql =  data.param_sql;
                        this.dictStrategyDO.id = data.id;
                        this.dictStrategyDO.enable = data.enable;
                        this.dictStrategyDO.type = data.type;
                        this.dictStrategyDO.param_jdbc_url = data.param_jdbc_url;
                        this.dictStrategyDO.param_username = data.param_username;
                        this.dictStrategyDO.param_password = data.param_password;
                        this.dictStrategyDO.param_sql = data.param_sql;
                        this.dictStrategyDO.cron = data.cron;
                    }
                    this.fullScreenLoading = false;
                }).catch(error =>{
                    this.fullScreenLoading = false;
                })

            },
            handleDomainDelete(scope){

                let row = scope.row;
                let fieldDomain = row.field_domain;
                let fieldItem = row.field_item;

                let paramObj = {};
                paramObj.field_domain = fieldDomain;
                paramObj.field_item = fieldItem;
                let url = this.baseUrl + "d1-core/d1/dict/manage/domain";
                this.fullTabLoading = true;
                this.http.delete(url,paramObj).then(resp =>{

                    this.fullTabLoading = false;
                    this.handleDictQuery();
                }).catch(error => {
                    this.fullTabLoading = false;
                })


            },
            // Expired
            handleValSave(scope){
                console.log(scope);
                let index = scope.$seq -1;
                let parentData = scope.data[index];
                let fieldDomain = parentData.field_domain;
                let fieldItem = parentData.field_item;

                let dataArr = [];
                let row = scope.row;
                let dictDO ={};
                dataArr.push(dictDO);

                let fieldLabel = row.field_label;
                let fieldValue = row.field_value;
                let fieldSequence = row.field_sequence;
                let fieldParentId = row.field_parent_id;
                let fieldId = row.field_id;
                let fieldEnabled = row.field_enable;

                dictDO.field_domain = fieldDomain;
                dictDO.field_item = fieldItem;
                dictDO.field_value = fieldValue;
                dictDO.field_label = fieldLabel;
                dictDO.field_sequence = fieldSequence;
                dictDO.field_parent_id = fieldParentId;

                // TODO 默认给true
                dictDO.field_enable = true;
                if(fieldEnabled != null){
                    dictDO.field_enable = fieldEnabled;
                }


                // 修改
                this.tableLoading = true;
                if(fieldId){
                    let url  = this.baseUrl +"d1-core/d1/dict/manage/value";
                    dictDO.field_id = fieldId;
                    this.http.put(url,dataArr).then(resp => {
                        this.$message.success("Edit Success");
                        this.tableLoading = false;
                    }).catch(error =>{
                        this.tableLoading = false;
                    })
                }else{
                    let url = this.baseUrl +"d1-core/d1/dict/manage/value";
                    this.http.post(url,dataArr).then(resp => {
                        this.$message.success("Add Success");
                        this.tableLoading = false;
                    }).catch(error =>{
                        this.tableLoading = false;
                    })
                }

            },
            handleValDelete(scope){
                console.log(scope);
                let row = scope.row;
                let fieldId = row.field_id;
                let idArr = [];
                idArr.push(fieldId);
                let index = scope.$seq -1;


                let url = this.baseUrl + "d1-core/d1/dict/manage/value";

                this.tableLoading = true;
                this.http.delete(url,idArr).then(resp =>{
                    this.tableLoading = false;
                    this.$message.success("Edit Success");

                    let dictList = this.dictTableData[index].dict_list;
                    for(let i = 0 ;i <dictList.length ; i ++){
                        if(dictList[i].field_id == fieldId){
                            dictList.splice(i, 1);
                            break;
                        }
                    }
                    if(dictList.length == 0){
                        this.handleDictQuery();
                    }


                }).catch(error =>{
                    this.tableLoading = false;
                })

            },

            addDictItem(){
                this.confirmToOpenDictBaseDialogVisible = true;
            },
            //TODO
            closeDictStrategyMethod(){
                this.dictStrategyDO = {
                    id:"",
                    domain:"",
                    item:"",
                    type:"SQL",
                    param_jdbc_url:"",
                    param_username:"",
                    param_password:"",
                    param_sql:"",
                    cron:"",
                    enable:false
                };
                this.dictStrategyTableData =[];
                this.showTestResult = false;
            },
            saveDictBase(){
              // 判断是否存在空值
                if(!this.dictBaseDO.domain ){
                    this.$message.warning("Domain can not be empty");
                    return;
                }

                if(!util.matchWordCase(this.dictBaseDO.domain)){
                    this.$message.warning("Domain  must be a combination of letters,underline or numbers");
                    return;
                }

                if(!this.dictBaseDO.item){
                    this.$message.warning("Item can not be empty");
                    return;
                }

                if(!util.matchWordCase(this.dictBaseDO.item)){
                    this.$message.warning("Item  must be a combination of letters,underline or numbers");
                    return;
                }

                if(!this.valueLabelList){
                    this.$message.warning("Value Label can not be empty");
                    return;
                }

                // 向后台传值
                let parameterList = [];

                // value值得集合；需要用来判断是否出现重复
                let valueList = [];
                for(let i =0 ;i < this.valueLabelList.length; i++){
                    let parameter = {};

                    parameter.field_domain = this.dictBaseDO.domain;
                    parameter.field_item = this.dictBaseDO.item;

                    let valueLabel = this.valueLabelList[i];
                    let value = valueLabel.value;
                    let label = valueLabel.label;
                    if(!value){
                        this.$message.warning("Line " + (i+1) + " Value can not be empty" );
                        return;
                    }
                    if(!label){
                        this.$message.warning("Line " + (i+1) + " Label can not be empty" );
                        return;
                    }

                    valueList.push(value);
                    parameter.field_value = value;
                    parameter.field_label = label;
                    parameterList.push(parameter);
                }

                let repeatVal = this.repeatVal(valueList);
                // Value的重复性判断
                if(repeatVal) {
                    this.$message.warning("Value can not be duplicate, " + repeatVal + " is duplicate " );
                    return;
                }


                // dataLoading 的写法
                this.fullTabLoading = true;
                let url = this.baseUrl + "d1-core/d1/dict/manage/domain";
                this.http.post(url,parameterList).then(resp =>{
                    this.fullTabLoading =false;
                    //请求成功，需要重新loading
                    this.handleDictQuery();
                    this.confirmToOpenDictBaseDialogVisible = false;
                }).catch(error => {
                    //关闭dataLoading
                    this.fullTabLoading =false;
                })




            },
            //TODO 保存配置
            saveDictStrategy(){
                let url = this.baseUrl +"d1-core/d1/dict/plugin";
                this.fullTabLoading = true;
                this.http.post(url,this.dictStrategyDO).then(resp =>{
                    this.fullTabLoading =false;
                    this.confirmToOpenDictStrategyDialogVisible = false;
                }).catch(error =>{
                    this.fullTabLoading = false;
                })

            },
            closeDictBaseMethod(){
               this.dictBaseDO ={
                   domain:'',
                   item:''
               };
               this.valueLabelList = [
                   {
                       label:'',
                       value:''
                   }
               ];
            },


            activeCellMethod (scope) {

                let row = scope.row;
                let columnIndex = scope.$columnIndex;

                if(row.field_domain && (columnIndex == 1 || columnIndex == 2)){
                    return true;
                }
                if(!row.field_domain && (columnIndex == 3 || columnIndex == 4 || columnIndex == 5 || columnIndex == 7)){
                    return true;
                }
                return false;
            },
            addValueLabelList(index){
                let valueLabelDO = {
                    value:'',
                    label:''
                }
                this.valueLabelList.splice(index + 1,0,valueLabelDO);

            },
            deleteValueLabelList(index){
                this.valueLabelList.splice(index ,1);
            },
            //判断字符串数组是否有重复值，并返回重复值
            repeatVal(arr){
                var validateObj = {};
                for(var i in arr) {
                    if(validateObj[arr[i]]) {
                        return arr[i];
                    }
                    // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
                    validateObj[arr[i]] = true;
                }
                return null;
            },
            getTestResult(){
                let url = this.baseUrl +"d1-core/d1/dict/plugin/test-sql";
                this.fullScreenLoading = true;
                this.http.post(url,this.dictStrategyDO).then(resp =>{
                    this.showTestResult = true;
                    this.fullScreenLoading = false;
                    let data = resp.data;

                    this.dictStrategyTableData = data.list;


                }).catch(error =>{
                    this.fullScreenLoading = false;
                })
            },
            saveDictItem(){
                let data = [];
                let tableData = this.dictTableData;
                for(let i = 0 ; i< tableData.length; i++){

                    let domain = null;
                    let item = null;
                    domain = tableData[i].field_domain;
                    item = tableData[i].field_item;

                    let dictList = tableData[i].dict_list;
                    if(dictList){
                        for(let j =0 ;j < dictList.length; j++){
                            let dictDO = {};
                            dictDO.field_domain = domain;
                            dictDO.field_item = item;
                            dictDO.field_label = dictList[j].field_label;
                            dictDO.field_value = dictList[j].field_value;
                            dictDO.field_sequence = dictList[j].field_sequence;
                            dictDO.field_id = dictList[j].field_id;
                            dictDO.field_parent_id = dictList[j].field_parent_id;
                            data.push(dictDO);
                        }
                    }
                }
               let url = this.baseUrl +"d1-core/d1/dict/manage/domain-update";
                this.fullTabLoading = true;
                this.http.post(url,data).then(resp =>{
                    this.$message.success('Operation Success');
                    this.fullTabLoading = false;
                    this.$refs.xTable.refreshData();
                }).catch(error =>{
                    this.fullTabLoading = false;
                })

            },
            handleDeleteDialog(scope,type){
                this.deleteScope = scope;
                this.removeType = type;
                this.confirmToRemoveDialogVisible = true;
                if(type == 'domain'){
                    this.removeDialogText = "Confirm to remove this Domain,Item ?";
                }
                if(type == 'value'){
                    this.removeDialogText = "Confirm to remove this value?";
                }
            },
            confirmToRemove(){
                let scope = this.deleteScope;
                let type = this.removeType;
                if(type == 'domain'){
                    this.handleDomainDelete(scope);

                }
                if(type == 'value'){
                    this.handleValDelete(scope);
                }
                this.confirmToRemoveDialogVisible = false;
            }


        }

    }


</script>


<style scoped>


    /deep/ .el-collapse-item__content{
        padding-bottom: 10px;
    }


    /deep/ .el-form-item {
        margin-bottom: 0px;
    }

    /deep/ .el-collapse-item__header{
        height: 35px;
        line-height: 35px;
    }

    .area {
        padding: 10px;
        border: 1px solid #d1dbe5;
        border-radius: 4px;
        overflow: hidden;
        /*box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);*/
        font-size: 10px;
    }
    .area .el-form-item{
        margin-left: 20px;
    }

    .el-form--inline .el-form-item {
        display: inline-block;
        margin-right: 10px;
        vertical-align: bottom;
    }

    .area /deep/ .el-form-item__label {
        float: none;
        display: inline-block;
        text-align: left;
        padding: 0 0 10px;
        line-height: 10px;
        margin-top: 10px;
    }

</style>
