<template>
  <div v-loading="dataLoading"
       element-loading-text="Loading, please wait..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">

    <el-dialog
      title="Export data"
      :visible.sync="confirmToExportDialogVisible"
      :close-on-click-modal="false"
      :center="true"
      size="tiny">
      <div class="dialog">{{exportDialogTip}}</div>
      <span slot="footer" class="dialog-footer">
               <el-button type="success" @click="handleExportExcel()">Yes</el-button>
              <el-button type="danger" @click="confirmToExportDialogVisible = false">No</el-button>
            </span>
    </el-dialog><!--Export data弹框-->

    <el-dialog
      title="Remove data"
      :visible.sync="confirmToRemoveDialogVisible"
      :close-on-click-modal="false"
      :center="true"
      size="tiny">
      <div class="dialog">Confirm to remove?</div>
      <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirmToRemoveDialogVisible = false">No</el-button>
              <el-button type="danger" @click="confirmToRemove">Yes</el-button>
            </span>
    </el-dialog>

    <el-collapse v-if="showForm" v-model="activeNames"><!--form表单折叠板-->
      <el-collapse-item name="1">
        <template slot="title">
          <span style="text-align: right;width: 100%"> <template v-if="activeNames.includes('1')"> Collapse Filter </template>
             <template v-else> Expand Filter </template>
            &nbsp; </span>
        </template>
        <div class="query-form">
          <el-form ref="queryForm" :model="pageSettingData" label-width="100px" label-position="top">

            <el-row :gutter="20">

              <div v-for="(item, index) in pageSettingData.form"  :key="index">
                <el-col :xs="12" :sm="12" :md="12" :lg="8" v-if=" item.form_field_query_type === formType.DATE_RANGE  || item.form_field_query_type === formType.DATE_TIME_RANGE ">
                  <template>
                    <!-- DATE RANGE -->
                    <el-form-item v-if="item.form_field_query_type === formType.DATE_RANGE"
                                  :label="item.view_field_label">
                      <el-row :gutter="10">
                        <el-col :xs="11" :sm="11" :md="11" :lg="11">
                          <el-date-picker
                                  size="small"
                                  :clearable="false"
                                  :editable="false"
                                  v-model="item.field_value__start__">
                          </el-date-picker>
                        </el-col>
                        <el-col :xs="2" :sm="2" :md="2" :lg="2">
                          <div style="text-align: center">
                            to
                          </div>
                        </el-col>
                        <el-col :xs="11" :sm="11" :md="11" :lg="11">
                          <el-date-picker
                                  size="small"
                                  :clearable="false"
                                  :editable="false"
                                  v-model="item.field_value__end__">
                          </el-date-picker>
                        </el-col>
                      </el-row>
                    </el-form-item>


                    <!-- DATE TIME RANGE -->
                    <el-form-item v-if="item.form_field_query_type === formType.DATE_TIME_RANGE"
                                  :label="item.view_field_label">
                      <el-row :gutter="10">
                        <el-col :xs="11" :sm="11" :md="11" :lg="11">
                          <el-date-picker type="datetime"
                                          size="small"
                                          :clearable="false"
                                          :editable="false"
                                          v-model="item.field_value__start__">
                          </el-date-picker>
                        </el-col>
                        <el-col :xs="2" :sm="2" :md="2" :lg="2">
                          <div style="text-align: center">
                            to
                          </div>
                        </el-col>
                        <el-col :xs="11" :sm="11" :md="11" :lg="11">
                          <el-date-picker type="datetime"
                                          size="small"
                                          :clearable="false"
                                          :editable="false"
                                          v-model="item.field_value__end__">
                          </el-date-picker>
                        </el-col>
                      </el-row>
                    </el-form-item>


                  </template>
                </el-col>

                <el-col :xs="12" :sm="8" :md="6" :lg="4" v-else>
                  <template>

                    <el-form-item v-if="item.form_field_query_type === formType.SINGLE_CHOICE_LIST_R1"
                                  :label="item.view_field_label">
                      <el-select v-model="item.field_value" size="small">
                        <template v-for="(option, optIdx) in item.field_optional_value_list">
                          <el-option :label="option.option_label" :value="option.option_value"></el-option>
                        </template>
                      </el-select>
                    </el-form-item><!--下拉列表单选-->


                    <el-form-item v-if="item.form_field_query_type === formType.SINGLE_CHOICE_LIST"
                                  :label="item.view_field_label">
                      <el-select v-model="item.field_value" size="small" :clearable="true">
                        <template v-for="(option, optIdx) in item.field_optional_value_list">
                          <el-option :label="option.option_label" :value="option.option_value"></el-option>
                        </template>
                      </el-select>
                    </el-form-item>

                    <el-form-item v-if="item.form_field_query_type === formType.MULTIPLE_CHOICE_LIST ||  item.form_field_query_type === formType.NULL_VALUE  || item.form_field_query_type === formType.EMPTY_VALUE"
                                  :label="item.view_field_label">
                      <el-select v-model="item.field_value" size="small"  multiple  :clearable="true"   @change="selectorChange(item.db_field_name, item.field_value)" ><!--多选加个multiple-->
                        <template v-for="(option, optIdx) in item.field_optional_value_list">
                          <el-option :label="option.option_label" :value="option.option_value"></el-option>
                        </template>
                      </el-select>
                    </el-form-item><!--下拉列表多选-->

                    <el-form-item v-if="item.form_field_query_type === formType.RADIOBOX_CHOICE"
                                  :label="item.view_field_label">
                      <el-radio-group v-model="item.field_value" size="small">
                        <el-radio :label="option"></el-radio>
                      </el-radio-group>
                    </el-form-item> <!--RADIOBOX单选-->

                    <el-form-item v-if="item.form_field_query_type === formType.CHECKBOX_CHOICE"
                                  :label="item.view_field_label">
                      <el-checkbox-group v-model="item.field_value" size="small">
                        <template v-for="(option, optIdx) in item.field_optional_value_list">
                          <el-checkbox :label="option" name="type"></el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </el-form-item><!--CHECKBOX多选-->



                    <el-form-item v-if="(item.form_field_query_type === formType.FUZZY_MATCHING_TEXT) || item.form_field_query_type === formType.EXACT_MATCHING_TEXT" :label="item.view_field_label"
                                  prop="field_value"><!--prop校验-->
                      <el-input v-model="item.field_value" size="small"></el-input>
                    </el-form-item>



                    <el-form-item v-if="item.form_field_query_type === formType.SINGLE_DATE"
                                  :label="item.view_field_label">
                      <el-date-picker
                              size="small"
                              :clearable="false"
                              :editable="false"
                              v-model="item.field_value">
                      </el-date-picker>
                    </el-form-item>


                    <el-form-item v-if="item.form_field_query_type === formType.SINGLE_DATETIME"
                                  :label="item.view_field_label">
                      <el-date-picker
                              type="datetime"
                              size="small"
                              :clearable="false"
                              :editable="false"
                              v-model="item.field_value">
                      </el-date-picker>
                    </el-form-item>

                    <!-- DATE TIME RANGE -->
                    <el-form-item v-if="item.form_field_query_type === formType.NUMBER_RANGE"
                                  :label="item.view_field_label">
                      <el-row :gutter="10">
                        <el-col :xs="11" :sm="11" :md="11" :lg="11">
                          <el-input v-model="item.field_value__start__"  size="small" type="number"></el-input>
                        </el-col>
                        <el-col :xs="2" :sm="2" :md="2" :lg="2">
                          <div style="text-align: center">
                            to
                          </div>
                        </el-col>
                        <el-col :xs="11" :sm="11" :md="11" :lg="11">
                          <el-input v-model="item.field_value__end__"  size="small" type="number"></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <!-- 数字输入框 -->
                    <el-form-item v-if="item.form_field_query_type === formType.NUMBER" :label="item.view_field_label"
                                  prop="field_value"><!--prop校验-->
                      <el-input v-model="item.field_value" size="small" type="number"></el-input>
                    </el-form-item>

                  </template>

                </el-col>


              </div>



            </el-row>

            <el-form-item>
              <el-button type="primary" size="mini" @click="handleQuery"><i class="fa fa-search"
                                                                             aria-hidden="true"></i> Search
              </el-button>
              <el-button type="warning" size="mini" @click="handleResetForm()"><i class="fa fa-eraser"
                                                                                   aria-hidden="true"></i> Reset
              </el-button>
            </el-form-item>

          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>


    <div class="data-region">

    <div class="tool-bar">
      <el-row :gutter="10">
        <el-col>
          <div class="adapt-top adapt-bottom" style="text-align: right">
            <el-button v-if="showToolbarButtonList" v-for="(button, index) in toolbarButtonList"
                       size="mini" :type="button.type" @click="handleGeneralButtonClick(button.name)">{{button.label}}
            </el-button>
            <el-button v-if="showDeleteButton" type="danger" size="mini" @click="handleRemove"><i class="fa fa-trash"
                                                                                                   aria-hidden="true"></i>
              Delete
            </el-button>

            <el-button v-if="loadingDownload && showExportButton" type="primary" size="mini" @click="handleExport"
                       :disabled="true" :loading="true"
            > Downloading
            </el-button>
            <el-button v-if="showExportButton && loadingDownload === false" type="primary" size="mini"
                       @click="handleExport">
              <i class="fa fa-download"></i> Export
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div v-if="toolbarPlaceholder.length > 0">
      <h5 v-for="(content, index) in toolbarPlaceholder">{{content}} </h5>

    </div>

    <div class="table" v-loading="tableDataLoading"
         :element-loading-text="loadingPrompt"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table
        ref="basicFormTable"
        :data="tableData"
        border
        :highlight-current-row="showHlightCurrentRow"
        row-class-name="success-row"
        @row-click="tableRowClick"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >

        <template slot="empty">Empty Content</template>
        <template v-if="showTableSelection">
          <el-table-column type="selection" width="46"></el-table-column>
        </template>
        <el-table-column
          label="Operation"
          :width="definitionTableButtonWidth" v-if="showTableOperationButton">
          <template slot-scope="scope">
            <el-button v-for="(buttionItem, index) in tableOperationButtonList" :type="buttionItem.type"
                       @click.stop="handleTableDefinitionButtonClick(scope.row, buttionItem.name)" size="mini"
                       :disabled="scope.row[buttionItem.name] == null ? false : scope.row[buttionItem.name].disabled"
                       :loading="scope.row[buttionItem.name] == null ? false : scope.row[buttionItem.name].loading">
              {{buttionItem.label}}
            </el-button>
          </template>
        </el-table-column>

        <template v-for="(table, childIdx) in pageSettingData.table">


          <el-table-column
            :label="table.view_field_label"
            :min-width="table.table_field_column_width"
            v-if="isIncludetableCellDataLinkField(table.db_field_name)">
            <template slot-scope="scope">
              <a class="cell-value"
                 @click.stop="handleCustomtableCellDataLink(scope.row, table.db_field_name)">{{ scope.row[table.db_field_name] }}</a>
            </template>

          </el-table-column>

          <el-table-column v-else

                           :label="table.view_field_label"
                           :min-width="table.table_field_column_width"
                           :prop="table.db_field_name">

          </el-table-column>
        </template>


      </el-table>
    </div>


    <div class="tool-bar" style="width: 100%;text-align: right">

          <div class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=totalRecord>
            </el-pagination>
          </div>


    </div>

    </div>
  </div>
</template>

<script>
  import QueryFormType from '@/assets/js/constant/query-form-type'
  import util from '@/util/util.js'

  export default {
    props: {
      options: {
        type: Object,
        required: true,
        default: () => {
        }
      },
    },
    components: {},
    data() {
      return {
        activeNames: [],
        queryUrl: '', //查询url
        exportUrl: '', //导出url
        deleteUrl: '',  //删除url
        uploadUrl: '', //上传url
        formTableUrl: 'd1-core/d1/query-suite/form-table-setting',
        formType: {
            /** 日期范围选择 */
            DATE_RANGE: 'DATE_RANGE',
            SINGLE_DATE: 'SINGLE_DATE',
            DATE_TIME_RANGE :"DATE_TIME_RANGE",
            /** 下拉列表单选 */
            SINGLE_CHOICE_LIST_R1: 'SINGLE_CHOICE_LIST_R1',
            /** 下拉列表多选 */
            MULTIPLE_CHOICE_LIST: 'MULTIPLE_CHOICE_LIST',
            /** RADIOBOX单选 */
            RADIOBOX_CHOICE: 'RADIOBOX_CHOICE',
            /** CHECKBOX多选 */
            CHECKBOX_CHOICE: 'CHECKBOX_CHOICE',
            /**数字控制*/
            NUMBER: 'NUMBER',
            /** 字符串输入 */
            TEXT: 'TEXT',
            SWITCH: 'SWITCH',
            NUMBER_RANGE:'NUMBER_RANGE',
            NULL_VALUE:'NULL_VALUE',
            EMPTY_VALUE:'EMPTY_VALUE',
            SEGMENTATION_TEXT:'SEGMENTATION_TEXT',
            AUTO_COMPLETE: 'AUTO_COMPLETE',
            SINGLE_CHOICE_LIST:'SINGLE_CHOICE_LIST',
            SINGLE_DATETIME:'SINGLE_DATETIME',
            EXACT_MATCHING_TEXT:'EXACT_MATCHING_TEXT',
            FUZZY_MATCHING_TEXT:'FUZZY_MATCHING_TEXT'
        },
        showUploadButton: false, //显示上传按钮
        showExportButton: false, //显示导出按钮
        showDeleteButton: false, //显示删除按钮
        showForm: true, //显示form
        showTableSelection: false, //显示表格checkbox
        showTableOperationButton: false, //显示表格操作列按钮
        showToolbarButtonList: false, //显示工具栏按钮
        loadTableDataAfterLoadFormTableAtOnce: true,
        tableOperationButtonList: [
          {
            label: '', //按钮显示的名称
            type: '',  //按钮的类型,默认空,支持  primary，success，info，warning，danger
            name: '', // 用户点击时返回的组件
            disabled: false,
            loading: false
          }
        ],
        toolbarButtonList: [
          {
            label: '', //按钮显示的名称
            type: '',  //按钮的类型,默认空,支持  primary，success，info，warning，danger
            name: '', // 用户点击时返回的组件
            elColWidth: 2, //按钮的占位
          }
        ],
        loadFormTableOnCreate: true, //是否初始化完成以后立即加载form
        openform:false, //是否展开form区域
        showDownloadButton: false,
        dataFacetKey: '', // data face key
        toolbarPlaceholder: [], //界面显示描述
        asyncExport: false, //是否异步导出
        dataLoading: false,
        confirmToRemoveDialogVisible: false,
        confirmToExportDialogVisible: false,
        editDialogVisible: false,
        totalRecord: 0,
        pageSize: 10,
        selection: [],
        currentPage: 1,
        tableData: [{}],
        pageSettingData: {
          form: [{}],
          table: [{}]
        },
        loadingDownload: false,
        specialParam: {},
       // uploadUrl: this.baseSSO.upload_file_url,
        formData: {},
        pageSettingDataFormClone: {},
        showHlightCurrentRow: false,
        confirmToAnalyzeDialogVisible: false,
        tableDataFormatter: false,
        tableDataLoading:false,
        loadingPrompt:'',
        tableCellDataLink:{}, //表格数据定义的点击事件,详细格式参照tableCellDataLinksDemo
        tableCellDataLinksDemo: {
          needCustomProcess: false,  //如果设置为ture,请监听handleTableValueClick函数
          fieldProperty: [{
            db_field_name: '', //需要增加a标签的字段名
            field_value: [""], //a标签显示的限制值
            dialogDisplaysValueFromFields: '' // 对话框的说明来源于字段
          },
          ]
        },
        tableDataCustomerVisible: false,
        tableDataCustomerDetails:'',
        sortArr:[],
        basicCascadeInform:{},
        fieldNameCascade:{},
        specialFormTypeChoiceNullOrEmpty: {
            optionalValue: '__SPECIAL_FORM_TYPE_CHOICE_NULL_OR_EMPTY__',
            optionalLabel: 'Null Or Empty'
        },
      }
    },
    computed: {
      fullQueryUrl() {
        let url = this.queryUrl ;
        url += (url.indexOf("?") !== -1) ? "&" : "?";
        url += "data_facet_key=" + this.dataFacetKey;
        url += "&" + this.pageParam;

        if (this.detailParam !== '') {
          url += (url.indexOf("?") !== -1) ? "&" : "?";
          url += this.detailParam;
        }


        // url += this.sortParam;


        return url;
      },
      fullFormTableUrl() {
        let url = this.formTableUrl;
        url += '?data_facet_key=' + this.dataFacetKey;
        return url;
      },
      pageParam() {
        let realQueryPage = this.currentPage - 1;
        let param = 'page=' + realQueryPage + '&size=' + this.pageSize;
        return param;
      },
      fullDeleteUrl() {
        let url = this.deleteUrl;
        return url;
      },

      fullModifyUrl() {
        return this.modifyUrl;
      },
      // sortParam(){
      //   let sortUrlParam = "";
      //   if(this.sortArr){
      //     for(var i in this.sortArr){
      //       if(this.sortArr[i].order){
      //         if(this.sortArr[i].order === 'ascending'){
      //           sortUrlParam += '&sort=' +this.sortArr[i].prop + ",asc";
      //         }else if(this.sortArr[i].order === 'descending'){
      //           sortUrlParam += '&sort=' +this.sortArr[i].prop + ",desc";
      //         }
      //       }
      //
      //     }
      //   }
      //   return sortUrlParam;
      // },
      detailParam() {
          this.specialParam = {};
          let param = '';

          if (JSON.stringify(this.pageSettingData) !== '{}') {

            for (let i = 0; i < this.pageSettingData.form.length; i++) {

              let item = this.pageSettingData.form[i];//每一个参数
              // 几个Range的判断
              if(item.form_field_query_type === QueryFormType.DATE_RANGE){
                if(item.field_value__start__){
                  let value = this.timeFormatConvert(item.field_value__start__);//返回日期类型格式的值 输入的值 2019-06-14
                  let parameterName = item.db_field_name + '__start__';
                  if (param === '') {
                    param = parameterName + '=' + encodeURIComponent(value); //db_field_name: inventory_report_date value=2019-06-14
                    this.specialParam[parameterName] = value;   //赋值，对象key 为inventory_report_date    value=2019-06-14
                  } else {
                    param = param + '&' + parameterName + '=' + encodeURIComponent(value);
                    this.specialParam[parameterName] = value;
                  }
                }
                if(item.field_value__end__){
                  let value = this.timeFormatConvert(item.field_value__end__);//返回日期类型格式的值 输入的值 2019-06-14
                  let parameterName = item.db_field_name + '__end__';
                  if (param === '') {
                    param = parameterName + '=' + encodeURIComponent(value); //db_field_name: inventory_report_date value=2019-06-14
                    this.specialParam[parameterName] = value;   //赋值，对象key 为inventory_report_date    value=2019-06-14
                  } else {
                    param = param + '&' + parameterName + '=' + encodeURIComponent(value);
                    this.specialParam[parameterName] = value;
                  }
                }
              }else if(item.form_field_query_type === QueryFormType.DATE_TIME_RANGE){
                if(item.field_value__start__){
                  let value = this.dateTimeFormatConvert2(item.field_value__start__);//返回日期类型格式的值 输入的值 2019-06-14
                  let parameterName = item.db_field_name + '__start__';
                  if (param === '') {
                    param = parameterName + '=' + encodeURIComponent(value); //db_field_name: inventory_report_date value=2019-06-14
                    this.specialParam[parameterName] = value;   //赋值，对象key 为inventory_report_date    value=2019-06-14
                  } else {
                    param = param + '&' + parameterName + '=' + encodeURIComponent(value);
                    this.specialParam[parameterName] = value;
                  }
                }
                if(item.field_value__end__){
                  let value = this.dateTimeFormatConvert2(item.field_value__end__);//返回日期类型格式的值 输入的值 2019-06-14
                  let parameterName = item.db_field_name + '__end__';
                  if (param === '') {
                    param = parameterName + '=' + encodeURIComponent(value); //db_field_name: inventory_report_date value=2019-06-14
                    this.specialParam[parameterName] = value;   //赋值，对象key 为inventory_report_date    value=2019-06-14
                  } else {
                    param = param + '&' + parameterName + '=' + encodeURIComponent(value);
                    this.specialParam[parameterName] = value;
                  }
                }
              }else if(item.form_field_query_type === QueryFormType.NUMBER_RANGE){

                if(item.field_value__start__){
                  let value = item.field_value__start__;//返回日期类型格式的值 输入的值 2019-06-14
                  let parameterName = item.db_field_name + '__start__';
                  if (param === '') {
                    param = parameterName + '=' + encodeURIComponent(value); //db_field_name: inventory_report_date value=2019-06-14
                    this.specialParam[parameterName] = value;   //赋值，对象key 为inventory_report_date    value=2019-06-14
                  } else {
                    param = param + '&' + parameterName + '=' + encodeURIComponent(value);
                    this.specialParam[parameterName] = value;
                  }
                }
                if(item.field_value__end__){
                  let value = item.field_value__end__;//返回日期类型格式的值 输入的值 2019-06-14
                  let parameterName = item.db_field_name + '__end__';
                  if (param === '') {
                    param = parameterName + '=' + encodeURIComponent(value); //db_field_name: inventory_report_date value=2019-06-14
                    this.specialParam[parameterName] = value;   //赋值，对象key 为inventory_report_date    value=2019-06-14
                  } else {
                    param = param + '&' + parameterName + '=' + encodeURIComponent(value);
                    this.specialParam[parameterName] = value;
                  }
                }
              }
              //单个时间插件
              else if (item.form_field_query_type === QueryFormType.SINGLE_DATE) {  //判断form表字段中的类型
                //处理report date
                if (item.field_value) {
                  let value = this.timeFormatConvert(item.field_value);//返回日期类型格式的值 输入的值 2019-06-14

                  if (param === '') {
                    param = item.db_field_name + '=' + encodeURIComponent(value); //db_field_name: inventory_report_date value=2019-06-14
                    this.specialParam[item.db_field_name] = value;   //赋值，对象key 为inventory_report_date    value=2019-06-14
                  } else {
                    param = param + '&' + item.db_field_name + '=' + encodeURIComponent(value);
                    this.specialParam[item.db_field_name] = value;
                  }
                }

              } else if(item.form_field_query_type === QueryFormType.SINGLE_DATETIME){
                if (item.field_value) {
                  let value = this.dateTimeFormatConvert2(item.field_value);//返回日期类型格式的值 输入的值 2019-06-14

                  if (param === '') {
                    param = item.db_field_name + '=' + encodeURIComponent(value); //db_field_name: inventory_report_date value=2019-06-14
                    this.specialParam[item.db_field_name] = value;   //赋值，对象key 为inventory_report_date    value=2019-06-14
                  } else {
                    param = param + '&' + item.db_field_name + '=' + encodeURIComponent(value);
                    this.specialParam[item.db_field_name] = value;
                  }
                }
              }
              else if (typeof item.field_value === 'object') {  //输入类型为object
                let specialparamValues = [];
                if(item.field_value){
                    this.specialParam[item.db_field_name] = specialparamValues;  //放入数组
                    for (let j = 0; j < item.field_value.length; j++) {

                        let value = item.field_value[j];  //输入的值

                        if (value != null) {
                            // if (item.form_field_query_type === QueryFormType.DATE_RANGE) {  //输入的是双时间
                            //   value = this.timeFormatConvert(value);
                            // }

                            if (param === '') {
                                param = item.db_field_name + '=' + encodeURIComponent(value);
                            } else {
                                param = param + '&' + item.db_field_name + '=' + encodeURIComponent(value);
                            }
                            if(this.specialParam[item.db_field_name] == null){
                                this.specialParam[item.db_field_name] = value;
                            }
                            specialparamValues.push(value);

                        }
                    }
                }

              } else if (typeof item.field_value === 'string') {
                if (item.field_value !== '') {

                  if (param === '') {
                    param = item.db_field_name + '=' + encodeURIComponent(item.field_value);
                    this.specialParam[item.db_field_name] = item.field_value;
                  } else {
                    param = param + '&' + item.db_field_name + '=' + encodeURIComponent(item.field_value);
                    this.specialParam[item.db_field_name] = item.field_value;
                  }
                }
              }
            }
          }
          return param;
      },
      // fullFileServiceUrlForImport() {
      //   return this.uploadUrl;
      // },
      fullUrlForImport() {
        return this.uploadUrl;
      },
      exportDialogTip() {
        let tip = ''

        if (this.totalRecord === 1) {
          tip = 'Confirm to export 1 record?';
        } else {
          tip = 'Confirm to export ' + this.totalRecord + ' records?';
        }

        return tip;
      },
      fullUrlForExport() {
        let url = this.exportUrl;
        url += (url.indexOf("?") !== -1) ? "&" : "?";
        url += "data_facet_key=" + this.dataFacetKey;

        let param = '';

        if (param !== '') {
          url += (url.indexOf("?") !== -1) ? "&" : "?";
          url = url + param;
        }
        if (this.detailParam !== '') {
          url += (url.indexOf("?") !== -1) ? "&" : "?";
          url += this.detailParam;
        }
        return url;
      },
      pagingAccounted() {
        let span = 24;
        if (this.showUploadButton) {
          span -= 2;
        }
        if (this.showExportButton) {
          span -= 2;
        }
        if (this.showAnalyzeButton) {
          span -= 2;
        }
        if (this.showDeleteButton) {
          span -= 2;
        }
        if (this.showAddButton) {
          span -= 2;
        }
        if (this.showRefreshButton) {
          span -= 2;
        }
        if (this.showToolbarButtonList && this.toolbarButtonList.length > 0) {
          for (let i = 0; i < this.toolbarButtonList.length; i++) {
            span -= this.toolbarButtonList[i].elColWidth;
          }
        }
        return span;
      },
      definitionTableButtonWidth(){
        let width = 0;
        if(this.tableOperationButtonList && this.tableOperationButtonList.length > 0){
          for(let i = 0; i < this.tableOperationButtonList.length; i ++){
            let tableOperationWidth = this.tableOperationButtonList[i].width;
              if(tableOperationWidth){
                width += tableOperationWidth;
              }else{
                //默认一个按钮150
                width += 150;
              }
          }
        }
        return width;
      },
      buttonAccounted() {
        return 24 - this.pagingAccounted;
      },
      defultSelectRows() {
        if (this.tableData == null || this.tableData.length === 0) {
          return {};
        }
        return this.tableData[0];

      }
    },

    created() {
      this.initOptions(this.options);

    },
    methods: {
      runQuery() {
        this.dataLoading = true;
        this.http.get(this.fullQueryUrl).then(resp => {
          let data = resp.data;
          let tableData = data.content;
          this.totalRecord = data.total_elements;
          if (tableData != null && tableData.length) {  //有数据
            for (let i = 0; i < tableData.length; i++) {
              let item = tableData[i];

              //如果值是true  or  false 会无法显示,需要处理一下
              let itemKeys = Object.keys(item); // 转成对象
              for (let j = 0; j < itemKeys.length; j++) {
                item[itemKeys[j]] = item[itemKeys[j]] == null ? '' : (item[itemKeys[j]] + '');
              }
            }
          }
          if(this.tableDataFormatter && tableData && tableData.length > 0){
             this.$emit("handleTableDataFormatter", tableData, this.componentName);
          }else{
            this.tableData = tableData;
          }

          if (this.showHlightCurrentRow) {
             this.$refs.basicFormTable.setCurrentRow(this.defultSelectRows);
            //this.$refs.basicFormTable.setCurrentRow(this.tableData[0]);
            this.$emit("handleTableRowClick", this.defultSelectRows);
          }
          this.dataLoading = false;
        }).catch(error => {
          this.dataLoading = false;
          console.error(error);
        })
      },
      handleQuery() {
        this.currentPage = 1;
        this.runQuery();
      },
      handleResetForm() {
        let pageSettingDataFormCloneInit = util.deepClone(this.pageSettingDataFormClone);
        this.pageSettingData.form = pageSettingDataFormCloneInit;

        this.currentPage = 1;
        this.runQuery();
      },
      handleSuccess(response, file, fileList) {
        let url = this.fullUrlForImport + '?fileId=' + response.fileId;
        url += '&isPublic=false';
        url += '&fileName=' + file.name;

        this.http.post(url).then(resp => {
          this.dataLoading = false;
          this.uploadErrorData = resp.data;
          let errorUnitList = this.uploadErrorData.error_unit_list;
          if (errorUnitList == null || errorUnitList.length === 0) {
            this.$message.success('upload is successful,total rows:' + this.uploadErrorData.total_rows);
            this.runQuery();
          } else {
            this.exportDataErrorDialogVisible = true;

          }

        }).catch(error => {
          this.dataLoading = false;
          this.editDialogVisible = false;
        });
      },
      handleError(err, file, fileList) {
        this.dataLoading = false;

      },
      handleBeforeUpload(file) {
        if (file.size > 50 * 1024 * 1024) {
          this.$message.warning('file exceeds size limit');
          return false;
        }
        this.dataLoading = true;
        // return true;
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.runQuery();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.runQuery();
      },
      refresh() {
        this.runQuery();
      },
      handleRemove() {
        if (this.isSelectionValid()) {
          this.confirmToRemoveDialogVisible = true;
        }
      },
      confirmToRemove() {
        let payload = {};
        let ids = [];
        this.dataLoading = true;

        for (var i = 0; i < this.selection.length; i++) {
          ids.push(this.selection[i].id);
        }

        payload.ids = ids;

        this.http.delete(this.fullDeleteUrl, payload).then(resp => {
          let data = resp.data;
          this.dataLoading = false;
          this.confirmToRemoveDialogVisible = false;
          this.$message.success('Successful operation');
          this.currentPage = 1;
          this.runQuery();
        }).catch(error => {
          this.dataLoading = false;
          this.confirmToRemoveDialogVisible = false;
        })
      },
      handleExport() {
        if (this.totalRecord === 0) {
          this.$message.warning('No record to export');
        } else {
          this.confirmToExportDialogVisible = true;
        }
      },
      handleSelect(selection, row) {
        this.selection = selection;
      },
      handleSelectAll(selection) {
        this.selection = selection;
      },
      isSelectionValid() {
        if (this.selection.length === 0) {
          this.$message.warning('Select record please');
          return false;
        } else {
          return true;
        }
      },
      handleExportExcel() {
        this.loadingDownload = true;
        this.confirmToExportDialogVisible = false;
        this.http.get(this.fullUrlForExport).then(resp => {
          this.loadingDownload = false;
          if (resp.data == null || resp.data === '') {
            this.$message.warning('No record to export');
          } else {
            //判断是否是异步导出
            if (this.asyncExport) {
              this.loadingDownload = true;
              this.loadExportSummary(resp.data);
            }
            // else {
            //   window.location.href = util.getFileSignature(this.loadingDownload, resp.data.fileId);
            // }
          }
        }).catch(error => {
          this.$message.warning('Export failed.');
          this.loadingDownload = false;
        });
      },
      continueUpload() {
        this.dataLoading = true;
        let url = 'inventory-tsis/tsis/daily-sku/upload/save-template?user_id=' + this.$store.getters.getUserId + "&batch_id=" + this.uploadErrorData.batch_id;
        this.http.post(url).then(resp => {
          this.$message.success('Successful operation');
          this.dataLoading = false;
          this.exportDataErrorDialogVisible = true;
          this.runQuery();
        }).catch(error => {
          this.dataLoading = false;
        })
      },
      downloadTemplate() {

        this.http.download("../static/daily_sku_list_template.xlsx", "daily_sku_list_template.xlsx").then(resp => {

        });
      },
      updateQueryUrl(url, specialParam) {
        this.updateParentSpecialParam(specialParam);
        if (url != null && url !== '') {
          this.queryUrl = url;
        } else {
          console.error("Query url cannot be empty");
        }
      },
      updateParentSpecialParam(specialParam) {
        this.parentSpecialParam = {};
        if (specialParam && JSON.stringify(specialParam) !== '{}') {
          let specialParamKeys = Object.keys(specialParam);
          for (let i = 0; i < specialParamKeys.length; i++) {
            console.info(3);
            let itemKey = specialParamKeys[i];
            this.parentSpecialParam[itemKey] = specialParam[itemKey];
          }
        }
      },
      updateExportUrl(url) {
        this.exportUrl = url;
      },
      updateQueryFormSetting(pageSettingData) {
        this.pageSettingData = pageSettingData;
      },
      calPercentage(row) {
        if (row.total_succeed_count == null) {
          return 0;
        }
        if (row.total_succeed_count == null) {
          return 0;
        }
        if (row.total_rows == null) {
          return 0;
        }
        let percentage = ((row.total_succeed_count + row.total_succeed_count) / row.total_rows).toFixed(2) * 100;

        return percentage > 100 ? 100 : percentage;
      },
      initOptions(options) {
        //初始化组件
        this.queryUrl = options.queryUrl != null ? options.queryUrl : this.queryUrl;   //表格的查询url
        this.importUrl = options.importUrl != null ? options.importUrl : this.importUrl; //导入文件的url
        this.exportUrl = options.exportUrl != null ? options.exportUrl : this.exportUrl; //导出文件的url
        this.uploadUrl = options.uploadUrl != null ? options.uploadUrl : this.uploadUrl; //导出文件的url
        this.deleteUrl = options.deleteUrl != null ? options.deleteUrl : this.deleteUrl; //删除功能
        this.tableOperationButtonList = options.tableOperationButtonList != null ? options.tableOperationButtonList : this.tableOperationButtonList; //表格内按钮组
        this.dataFacetKey = options.dataFacetKey != null ? options.dataFacetKey : this.dataFacetKey; //data source key
        if (options.pageSize) {
          this.pageSize = options.pageSize;//可以修改默认的每页数量 默认 10
        }

          this.loadFormTableOnCreate = options.loadFormTableOnCreate != null ? options.loadFormTableOnCreate : this.loadFormTableOnCreate;

          this.pageSettingData = options.pageSettingData != null ? options.pageSettingData : this.pageSettingData;
        this.showUploadButton = options.showUploadButton != null ? options.showUploadButton : this.showUploadButton;
        this.showTableSelection = options.showTableSelection != null ? options.showTableSelection : this.showTableSelection;
        this.showTableOperationButton = options.showTableOperationButton != null ? options.showTableOperationButton : this.showTableOperationButton;

        this.showExportButton = options.showExportButton != null ? options.showExportButton : this.showExportButton;
        this.showForm = options.showForm != null ? options.showForm : this.showForm;
        this.showToolbarButtonList = options.showToolbarButtonList != null ? options.showToolbarButtonList : this.showToolbarButtonList;
        this.tableDataFormatter = options.tableDataFormatter != null ? options.tableDataFormatter : this.tableDataFormatter;
        this.toolbarButtonList = options.toolbarButtonList != null ? options.toolbarButtonList : this.toolbarButtonList;
        this.toolbarPlaceholder = options.toolbarPlaceholder != null ? options.toolbarPlaceholder : this.toolbarPlaceholder;
        this.loadingPrompt = options.loadingPrompt != null ? options.loadingPrompt : this.loadingPrompt;
        this.tableCellDataLink = options.tableCellDataLink != null ? options.tableCellDataLink : this.tableCellDataLink;
        //定制服务
        this.asyncExport = options.asyncExport != null ? options.asyncExport : this.asyncExport; //是否异步导出
        this.loadTableDataAfterLoadFormTableAtOnce = options.loadTableDataAfterLoadFormTableAtOnce != null ? options.loadTableDataAfterLoadFormTableAtOnce : this.loadTableDataAfterLoadFormTableAtOnce; //加载form 后是否立即执行一次查询
        this.openform = options.openform != null ? options.openform : this.openform;//ETL自定义功能
        // 拷贝值，给reset使用
        //显示表格的当前行
        this.showHlightCurrentRow = options.showHlightCurrentRow != null ? options.showHlightCurrentRow : this.showHlightCurrentRow;

        if(this.openform){
          this.activeNames = ["1"];
        }

        if (this.loadFormTableOnCreate) {

          this.loadFormTableSetting();
        } else {
          this.pageSettingDataFormClone = util.deepClone(this.pageSettingData.form);
        }
      },
      handleAdd() {
        this.$emit("handleAdd");
      },
      handleEdit(row) {
        this.$emit("handleEdit", row);
      },
      tableRowClassName(row, rowIndex) {
        if (rowIndex === 1) {
          return 'success-row';
        }
        return '';
      },
      tableRowClick(row) {
        if (this.showHlightCurrentRow) {
          this.$emit("handleTableRowClick", row)
        }
      },
      timeFormatConvert(od) {
        Date.prototype.format = function (fmt) {
          var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
        }

        var dd = new Date(od).format(("yyyy-MM-dd"));
        return dd.toString();
      },
      dateTimeFormatConvert2(od) {
        Date.prototype.format = function (fmt) {
          var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
        }

        var dd = new Date(od).format(("yyyy-MM-dd hh:mm:ss"));
        return dd.toString();
      },

      handleDownload(row) {
        let downloadUrl = 'inventory-dsis/dsis/data-sources/view/ds-file-import/file-id?import_id=' + row.import_id;
        this.http.get(downloadUrl).then(resp => {
          if (resp.data) {
            // util.downloadPublicOrPrivateFileByUrlOrFileId(resp.data);
            window.location.href = util.getFileSignature(this.dataLoading, resp.data);
          }
        }).catch(error => {
          this.dataLoading = false;
          console.error(error);
        });

      },
      handleRelease() {
        if (this.isSelectionValid()) {
          this.$emit("handleRelease", this.selection);
        }
      },
      handleAnalyze() {
        this.dataLoading = true;
        this.confirmToAnalyzeDialogVisible = false;
        this.http.post(this.analyzeUrl).then(resp => {
          this.dataLoading = false;
          this.$message.success('创建分析任务成功，请稍等2分钟后查看结果');
        }).catch(error => {
          this.dataLoading = false;
          this.$message.warning('无法创建分析任务，请联系管理员');
        });
      },
      loadExportSummary(exportId) {
        let that = this;
        if (exportId <= -1) {
          that.loadingDownload = false;
          that.$message.warning('Service is busy,please try again later');
          return;
        } else {

          let summaryUrl = 'd1-core/d1/export/task-status?taskId=' + exportId;

          let intervalId = setInterval(function () {
            that.http.get(summaryUrl).then(resp => {
              let data = resp.data;
              if (data == null || data.failed_at) {
                that.$message.warning(data.details);
                that.loadingDownload = false;
                window.clearInterval(intervalId);
              } else if (data.end_at) {
                that.loadingDownload = false;
                window.clearInterval(intervalId);

                // TODO ,先写死，这导出完全是一整套流程；这里url先写死； 要不要写个baseUrl

                window.location.href =    that.baseUrl + "d1-core/d1/export/download?taskId=" +exportId;
              }
            }).catch(error => {
              that.$message.warning('Export failed.');
              that.loadingDownload = false;
            });
          }, 1000);


        }
      },
      handleTableDefinitionButtonClick(row, name) {
        //直接返回调用者组件处理
        this.$emit("onTableOperationButtonClick", row, name);
      },
      handleGeneralButtonClick(name) {
        this.$emit("onToolbarButtonClick", name);
      },
      setTableData(tableData){
        this.tableData = tableData;
      },
      clearTableData(){
        this.tableData = [{}];
        this.totalRecord = 0;
      },
      inArray(arr, str) {
        let i = arr.length;
        while (i--) {
          if (arr[i] === str) {
            return true;
          }
        }
        return false;
      },
      setPageSettingData(pageSettingData){
        this.pageSettingData = pageSettingData;
        this.pageSettingDataFormClone = util.deepClone(this.pageSettingData.form);

      },
      setDataLoading(status){
        this.dataLoading = status;
      },
      showTrendChart(row){
        this.$emit("showTrendChart", row);
      },
      handleDelete(row){
        this.$emit("handleDelete", row);
      },
      setTableDataLoading(status){
        this.tableDataLoading = status;
      },
      isIncludetableCellDataLinkField(fieldKey){
        let fieldList = this.tableCellDataLink;
        if(fieldList && fieldList.length){
          let i = fieldList.length;
          while (i--) {
            if (fieldList[i].db_field_name === fieldKey) {
              return true;
            }
          }
        }
        return false;

      },
      handleCustomtableCellDataLink(row,fieldKey){
        let fieldList = this.tableCellDataLink;
          this.$emit("handleTableValueClick", row, fieldKey);
      },
      setDataFacetKey(dataFacetKey){
          this.dataFacetKey = dataFacetKey;

      },
        loadFormTableSetting(){
            this.dataLoading = true;
            this.http.get(this.fullFormTableUrl).then(resp => {
                let data = resp.data;
                let form = data.form;
                this.pageSettingData = data;
                //null or empty初始化
                this.pageSettingData.form = this.handleNullOrEmpty(form);

                //级联初始化
                this.pageSettingData.form = this.handleCascade(form);
                this.pageSettingDataFormClone = util.deepClone(this.pageSettingData.form);
                // TOFIXED
                 this.$emit("completeLoadForm", this.pageSettingData);

                //加载完form后立即执行查询
                if(this.loadTableDataAfterLoadFormTableAtOnce){
                    this.runQuery();
                }
                // this.runQuery();
                this.dataLoading = false;
            }).catch(error => {
                console.info(error);
                this.dataLoading = false;
            });
        },
        handleCascade(form){
            //1.提取全部的级联关系
            //2。提取默认全部选中
            //3。构建真正的级联关系
            this.basicCascadeInform = {};
            this.fieldNameCascade = {};
            let childFieldNameList = [];
            //第一轮遍历，填充默认下拉框的值，并复制基础级联结构
            for(let i=0; i< form.length; i++){
                let formItem = form[i];
                if(formItem.field_cascade_optional_value_list){
                    formItem.field_optional_value_list = [];
                    //add null or empty
                    formItem.field_optional_value_list.push({option_label: this.specialFormTypeChoiceNullOrEmpty.optionalLabel, option_value: this.specialFormTypeChoiceNullOrEmpty.optionalValue});
                    this.fieldNameCascade[formItem.db_field_name] = formItem.field_cascade_child_field_name;
                    childFieldNameList.push(formItem.field_cascade_child_field_name);
                    this.basicCascadeInform[formItem.db_field_name] = formItem.field_cascade_optional_value_list;
                    for(let j=0; j< formItem.field_cascade_optional_value_list.length; j++){
                        let fieldOptionValue = {};
                        formItem.field_optional_value_list.push(fieldOptionValue);
                        fieldOptionValue.option_label = formItem.field_cascade_optional_value_list[j].option_label;
                        fieldOptionValue.option_value = formItem.field_cascade_optional_value_list[j].option_value;
                    }
                }
            }
            //第二轮遍历， 取消级联关系中所有下级的数据
            for(let i=0; i< form.length; i++) {
                let formItem = form[i];
                if(this.inArray(childFieldNameList, formItem.db_field_name)){
                    formItem.field_optional_value_list = [];
                    formItem.field_optional_value_list.push({option_label: this.specialFormTypeChoiceNullOrEmpty.optionalLabel, option_value: this.specialFormTypeChoiceNullOrEmpty.optionalValue});

                }
            }
          return form;

        },
        selectorChange(dbFieldName, chooseValueList) {
          //只考虑级联的下一级
            let childFieldName = this.fieldNameCascade[dbFieldName];
            let form = this.pageSettingData.form;
            //只有存在级联关系时才需要往下继续
            if (this.basicCascadeInform[dbFieldName]) {
                for (let i = 0; i < form.length; i++) {
                    let formItem = form[i];
                    //仅控制这一级
                  if(childFieldName === formItem.db_field_name){
                      //为这一级赋值
                      formItem = this.fullChildFieldSelector(dbFieldName, chooseValueList, formItem.field_value, formItem);

                      //还存在下级，继续往下迭代
                      if(formItem.field_cascade_child_field_name){
                          this.selectorChange(formItem.db_field_name, formItem.field_value);
                      }

                  }

                }
            }
        },
        fullChildFieldSelector(parentFieldName, parentChooseValueList, childChooseValueList , formItem){
            let cascadeOptionsList = this.basicCascadeInform[parentFieldName];
            //1.加载全部可选项
            formItem.field_optional_value_list = [];
            formItem.field_optional_value_list.push({option_label: this.specialFormTypeChoiceNullOrEmpty.optionalLabel, option_value: this.specialFormTypeChoiceNullOrEmpty.optionalValue});

            for (let i = 0; i < cascadeOptionsList.length; i++) {
               let parentOptional = cascadeOptionsList[i];
                if(this.inArray(parentChooseValueList, parentOptional.option_value)){
                    if(parentOptional.children){
                        for (let j = 0; j < parentOptional.children.length; j++) {
                            formItem.field_optional_value_list.push(parentOptional.children[j]);
                        }
                    }
                }
            }
            //2。遍历可选项,取出可选项value list
            let optionalValueList = [];
            for (let i = 0; i < formItem.field_optional_value_list.length; i++) {
                let optionalValue = formItem.field_optional_value_list[i].option_value;
                optionalValueList.push(optionalValue);
            }
            //3. 两个数组取交集
            formItem.field_value = optionalValueList.filter(v => childChooseValueList.includes(v));
            return formItem;
        },
        handleNullOrEmpty(form){
            for(let i=0; i< form.length; i++) {
                let formItem = form[i];
                if(formItem.form_field_query_type === this.formType.MULTIPLE_CHOICE_LIST
                  || formItem.form_field_query_type === this.formType.SINGLE_CHOICE_LIST
                  || formItem.form_field_query_type === this.formType.SINGLE_CHOICE_LIST_R1){
                    if(formItem.field_optional_value_list){
                        formItem.field_optional_value_list.splice(0,0,{option_label: this.specialFormTypeChoiceNullOrEmpty.optionalLabel, option_value: this.specialFormTypeChoiceNullOrEmpty.optionalValue});
                    }else{
                        formItem.field_optional_value_list = [];
                        formItem.field_optional_value_list.push({option_label: this.specialFormTypeChoiceNullOrEmpty.optionalLabel, option_value: this.specialFormTypeChoiceNullOrEmpty.optionalValue});
                    }

                }
            }
            return form;
        }
    }
  }
</script>

<style scoped>

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .text-right {
    text-align: right;
    margin-right: 100px;
  }

  .adapt-top {
    margin-top: 10px;

  }

  .adapt-bottom {
    margin-bottom: 10px;
  }

  .pagination {
    display: inline-block;
    padding-left: 0;
    margin: 12px 0;
    border-radius: 4px;
  }


  .adapt-bottom {
    margin-bottom: 20px;
  }

  .templet {
    color: #FFFFFF
  }

  .e-label {
    font-weight: bold;
  }

  .name {
    font-size: 16px;
    padding: 5px 0;
    float: left;
  }

  .product-name {
    margin-bottom: 20px;
  }

  .width-adapt {
    width: 500px;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .table /deep/ .current-row > td {
    /*background: rgba(0, 158, 250, 0.219) !important;*/
    background: deepskyblue;
  }

  /*.table .success-row {*/
    /*!*background: #f0f9eb;*!*/
    /*background: red;*/

  /*}*/

  .success-row {
    background: #f0f9eb;
  }

  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange
  .el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 100%;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
    /*height: 26px;*/
    /*margin-top: 8px;*/
  }
  .el-form--label-top /deep/ .el-form-item__label {
    float: none;
    display: inline-block;
    text-align: left;
    padding: 0 0 10px;
    line-height: 10px;
    font-size: 12px;
    margin-bottom: -16px;

  }

   /deep/ .el-input--small  .el-input__inner {
    height: 32px ! important ;
    line-height: 32px;
  }
  .el-select-small /deep/ .el-input--small /deep/ .el-input__inner {
    height: 32px ;
    line-height: 32px;
  }

  .el-range-editor--small .el-range__close-icon, /deep/ .el-range-editor--small .el-range__icon {
    line-height: 20px;
  }

  /*.el-date-editor /deep/ .el-range-separator {*/
  /*  line-height: 20px;*/
  /*  width: 5%;*/
  /*  color: #303133;*/
  /*  font-size: 12px;*/
  /*}*/

  .cell-value{
    cursor: pointer;
    color: #1c15ff;
    text-decoration:underline;
  }


  /deep/ .el-table td, /deep/ .el-table th{
    padding: 0px 0;
  }

  /deep/ .el-table{
    font-size: 12px;
  }

  /deep/ .el-table thead{
    color:black;
  }


  /*/deep/ .el-input__prefix .el-input__icon{*/
  /*  width:10px;*/
  /*  line-height: 40px;*/
  /*}*/

  /*/deep/ .el-input--prefix .el-input__inner{*/
  /*  padding-left: 18px;*/
  /*}*/


  /*/deep/ .el-input--suffix .el-input__inner{*/
  /*  padding-right: 5px;*/
  /*}*/


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


  .data-region{
    box-shadow:2px 2px  5px 3px lightgray;
  }

  .tool-bar , /deep/ .el-table {
    padding-left: 5px;
    padding-right: 5px;

  }

  /deep/ .el-table {
    width: auto;
  }

  .el-select{
    width: 100%;
  }

  /deep/ .el-table th {
    background-color: #e5e9ec94;
  }


  /deep/ .el-table__empty-text{
    font-size: 15px;
  }


</style>


