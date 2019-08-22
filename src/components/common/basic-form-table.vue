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
      title="报表生成"
      :visible.sync="confirmToAnalyzeDialogVisible"
      :close-on-click-modal="false"
      :center="true"
      size="tiny">
      <div class="dialog">是否触发重新计算？</div>
      <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirmToAnalyzeDialogVisible = false">No</el-button>
                <el-button type="danger" @click="handleAnalyze">Yes</el-button>
            </span>
    </el-dialog><!--报表生成的弹框-->

    <el-dialog class="set-event-dialog"
               title="Detail"
               :visible.sync="importAndExtractVisible">
      <div>{{importAndExtractContent}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importAndExtractVisible = false">Close</el-button>
      </div>

    </el-dialog>


    <el-dialog class="set-event-dialog"
               title="Detail"
               :visible.sync="tableDataCustomerVisible">
      <div>{{tableDataCustomerDetails}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tableDataCustomerVisible = false">Close</el-button>
      </div>

    </el-dialog>

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

    <el-collapse v-if="showQueryForm" v-model="activeNames"><!--form表单折叠板-->
      <el-collapse-item name="1">
        <template slot="title">
          <i class="fa fa-search" aria-hidden="true"></i>
        </template>
        <div class="query-form">
          <el-form ref="queryForm" :model="pageSettingData" label-width="100px" label-position="top">

            <el-row :gutter="10">
              <el-col :xs="12" :sm="8" :md="6" :lg="4"
                      v-for="(item, index) in pageSettingData.form" :key="index">
                <template>

                  <el-form-item v-if="item.form_field_query_type === formType.SINGLE_CHOICE_LIST"
                                :label="item.view_field_label">
                    <el-select v-model="item.field_value" size="small">
                      <template v-for="(option, optIdx) in item.field_optional_value_list">
                        <el-option :label="option.option_value" :value="option.option_id"></el-option>
                      </template>
                    </el-select>
                  </el-form-item><!--下拉列表单选-->


                  <el-form-item v-if="item.form_field_query_type === formType.SINGLE_CHOICE_LIST_W_EMPTY"
                                :label="item.view_field_label">
                    <el-select v-model="item.field_value" size="small" :clearable="true">
                      <template v-for="(option, optIdx) in item.field_optional_value_list">
                        <el-option :label="option.option_value" :value="option.option_id"></el-option>
                      </template>
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="item.form_field_query_type === formType.MULTIPLE_CHOICE_LIST ||  item.form_field_query_type === formType.NULL_VALUE  || item.form_field_query_type === formType.EMPTY_VALUE"
                                :label="item.view_field_label">
                    <el-select v-model="item.field_value" size="small" multiple :clearable="true"><!--多选加个multiple-->
                      <template v-for="(option, optIdx) in item.field_optional_value_list">
                        <el-option :label="option.option_value" :value="option.option_id"></el-option>
                      </template>
                    </el-select>
                  </el-form-item><!--下拉列表多选-->

                  <el-form-item v-if="item.form_field_query_type === formType.RADIOBOX_CHOICE"
                                :label="item.view_field_label">
                    <el-radio-group v-model="item.field_value" size="small">
                      <el-radio :label="option"></el-radio>
                    </el-radio-group>
                  </el-form-item><!--RADIOBOX单选-->

                  <el-form-item v-if="item.form_field_query_type === formType.CHECKBOX_CHOICE"
                                :label="item.view_field_label">
                    <el-checkbox-group v-model="item.field_value" size="small">
                      <template v-for="(option, optIdx) in item.field_optional_value_list">
                        <el-checkbox :label="option" name="type"></el-checkbox>
                      </template>
                    </el-checkbox-group>
                  </el-form-item><!--CHECKBOX多选-->

                  <el-form-item v-if="item.form_field_query_type === formType.TEXT" :label="item.view_field_label"
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
                            size="small"
                            :clearable="false"
                            :editable="false"
                            v-model="item.field_value">
                    </el-date-picker>
                  </el-form-item>

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



                  <!-- DATE TIME RANGE -->
                  <el-form-item v-if="item.form_field_query_type === formType.NUMBER_RANGE"
                                :label="item.view_field_label">
                    <el-row :gutter="10">
                      <el-col :xs="11" :sm="11" :md="11" :lg="11">
                        <el-input v-model="item.field_value__start__"  size="small"></el-input>
                      </el-col>
                      <el-col :xs="2" :sm="2" :md="2" :lg="2">
                        <div style="text-align: center">
                          to
                        </div>
                      </el-col>
                      <el-col :xs="11" :sm="11" :md="11" :lg="11">
                        <el-input v-model="item.field_value__end__"  size="small"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </template>
              </el-col>

            </el-row>

            <el-form-item>
              <el-button type="primary" size="small" @click="handleQuery"><i class="fa fa-search"
                                                                             aria-hidden="true"></i> Search
              </el-button>
              <el-button type="warning" size="small" @click="handleResetForm()"><i class="fa fa-eraser"
                                                                                   aria-hidden="true"></i> Reset
              </el-button>
            </el-form-item>

          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>


    <div class="tool-bar">
      <el-row :gutter="10" >

        <el-col :span="pagingAccounted">
            &nbsp;
        </el-col>

        <el-col v-if="buttonAccounted < 4" :span="buttonAccounted" >
          <div class="adapt-top adapt-bottom" style="text-align: right">
            <el-button v-if="showGeneralDefinitionButton" v-for="(button, index) in generalDefinitionButtonList"
                       size="small" :type="button.type" @click="handleGeneralButtonClick(button.name)">{{button.label}}
            </el-button>
            <el-button v-if="isTransformAndReleaseComponent" size="small" type="success" @click="handleRelease"><i
              class="fa fa-send"></i> Release
            </el-button>
            <el-button v-if="showRefreshButton" size="small" type="success" @click="runQuery"><i
              class="fa fa-refresh"></i> Refresh
            </el-button>
            <el-button v-if="showAnalyzeButton" size="small" type="success"
                       @click="confirmToAnalyzeDialogVisible = true"> Analyze
            </el-button>
            <el-button v-if="showAddButton" size="small" type="success" @click="handleAdd"><i class="fa fa-plus"></i>
              Add
            </el-button>
            <el-button v-if="showDeleteButton" type="danger" size="small" @click="handleRemove"><i class="fa fa-trash"
                                                                                                   aria-hidden="true"></i>
              Delete
            </el-button>

            <el-button v-if="loadingDownload && showExportButton" type="primary" size="small" @click="handleExport"
                       :disabled="true" :loading="true"
            > Downloading
            </el-button>
            <el-button v-if="showExportButton && loadingDownload === false" type="primary" size="small"
                       @click="handleExport">
              <i class="fa fa-download"></i> Export
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="buttonAccounted >= 4" >
        <el-col>
          <div class="adapt-bottom" style="text-align: right">
            <el-button v-if="showGeneralDefinitionButton" v-for="(button, index) in generalDefinitionButtonList"
                       size="small" :type="button.type" @click="handleGeneralButtonClick(button.name)">{{button.label}}
            </el-button>
            <el-button v-if="isTransformAndReleaseComponent" size="small" type="success" @click="handleRelease"><i
              class="fa fa-send"></i> Release
            </el-button>
            <el-button v-if="showRefreshButton" size="small" type="success" @click="runQuery"><i
              class="fa fa-refresh"></i> Refresh
            </el-button>
            <el-button v-if="showAnalyzeButton" size="small" type="success"
                       @click="confirmToAnalyzeDialogVisible = true"> Analyze
            </el-button>
            <el-button v-if="showAddButton" size="small" type="success" @click="handleAdd"><i class="fa fa-plus"></i>
              Add
            </el-button>
            <el-button v-if="showDeleteButton" type="danger" size="small" @click="handleRemove"><i class="fa fa-trash"
                                                                                                   aria-hidden="true"></i>
              Delete
            </el-button>

            <el-button v-if="loadingDownload && showExportButton" type="primary" size="small" @click="handleExport"
                       :disabled="true" :loading="true"
            > Downloading
            </el-button>
            <el-button v-if="showExportButton && loadingDownload === false" type="primary" size="small"
                       @click="handleExport">
              <i class="fa fa-download"></i> Export
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div v-if="tabularDataDescription.length > 0">
      <h5 v-for="(content, index) in tabularDataDescription">{{content}} </h5>

    </div>

    <div class="table" v-loading="tableDataLoading"
         :element-loading-text="tableLoadingText"
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
        stripe
      >
        <template v-if="showDeleteButton">
          <el-table-column type="selection" width="46"></el-table-column>
        </template>

        <el-table-column
          label="Operation"
          :width="definitionTableButtonWidth" v-if="showTableDefinitionButton">
          <template slot-scope="scope">
            <el-button v-for="(buttionItem, index) in tableDefinitionButtonList" :type="buttionItem.type"
                       @click.stop="handleTableDefinitionButtonClick(scope.row, buttionItem.name)" size="small"
                       :disabled="scope.row[buttionItem.name] == null ? false : scope.row[buttionItem.name].disabled"
                       :loading="scope.row[buttionItem.name] == null ? false : scope.row[buttionItem.name].loading">
              {{buttionItem.label}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="Operation"
          width="150" v-if="showEditButton">
          <template slot-scope="scope">
            <el-button  @click.stop="handleEdit(scope.row)" size="small">Edit</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="Operation"
          width="150" v-if="showTooltipInTable">
          <template slot-scope="scope">
            <el-tooltip content="Go to corresponding trend" placement="right-start" effect="light">
              <el-button @click="showTrendChart(scope.row)" type="primary" size="small"><i class="fa fa-bar-chart" aria-hidden="true"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          label="Operation"
          width="180" v-if="isImportAndExtractComponent">
          <template slot-scope="scope">
            <el-button  @click.stop="handleDownload(scope.row)" size="small" v-if="scope.row.import_status === 'Successful'">Download</el-button>
            <el-button type="danger"  @click.stop="handleDelete(scope.row)" size="small">Delete</el-button>

          </template>
        </el-table-column>


        <template v-for="(table, childIdx) in pageSettingData.table">
          <el-table-column
            :label="table.view_field_label"
            :width="table.table_field_column_width"
            v-if="isImportAndExtractComponent && table.db_field_name === 'import_details'">
            <template slot-scope="scope">
              <a style="cursor: pointer" v-if="scope.row.import_details !== ''"
                 @click.stop="showImportAndExtractDetail(scope.row.import_details)"> Details</a>
            </template>

          </el-table-column>


          <el-table-column
            :label="table.view_field_label"
            :width="table.table_field_column_width"
            v-else-if="isImportAndExtractComponent && table.db_field_name === 'extract_details'">
            <template slot-scope="scope">
              <a style="cursor: pointer" v-if="scope.row.extract_details !== ''"
                 @click.stop="showImportAndExtractDetail(scope.row.extract_details)"> Details</a>
            </template>

          </el-table-column>

          <el-table-column
            :label="table.view_field_label"
            :width="table.table_field_column_width"
            v-else-if="isTransformAndReleaseComponent && table.db_field_name === 'transform_details'">
            <template slot-scope="scope">
              <a style="cursor: pointer" v-if="scope.row.transform_details !== ''"
                 @click.stop="showImportAndExtractDetail(scope.row.transform_details)"> Details</a>
            </template>

          </el-table-column>

          <el-table-column
            :label="table.view_field_label"
            :width="table.table_field_column_width"
            v-else-if="isIncludeTableDataLinkField(table.db_field_name)">
            <template slot-scope="scope">
              <a style="cursor: pointer"
                 @click.stop="handleCustomTableDataLink(scope.row, table.db_field_name)">{{ scope.row[table.db_field_name] }}</a>
            </template>

          </el-table-column>





          <el-table-column v-else
                           :label="table.view_field_label"
                           :width="table.table_field_column_width"
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
            &nbsp; &nbsp; &nbsp; &nbsp;

          </div>


    </div>
  </div>
</template>

<script>
  import QueryFormType from '@/assets/js/constant/query-form-type'
  // import cascadeUtil from '@/util/cascade.js'
  import util from '@/util/util.js'
  // import FileServiceSignatureUrl from '@/assets/js/constant/file-service-signature-url'
  import router from '@/router/index.js'

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
        queryUrl: '',
        componentName:'',
        importUrl: '',
        analyzeUrl: '',
        exportUrl: '',
        deleteUrl: '',
        modifyUrl: '',
        formTableUrl: 'd1-core/d1/query-suite/form-table-setting',
        formType: QueryFormType,
        showImportButton: false,
        showExportButton: false,
        showDeleteButton: false,
        showEditButton: false,
        showAddButton: false,
        showAnalyzeButton: false,
        showQueryForm: false,
        showTableDefinitionButton: false,
        showGeneralDefinitionButton: false,
        tableDefinitionButtonList: [
          {
            label: '', //按钮显示的名称
            type: '',  //按钮的类型,默认空,支持  primary，success，info，warning，danger
            name: '', // 用户点击时返回的组件
            disabled: false,
            loading: false
          }
        ],
        generalDefinitionButtonList: [
          {
            label: '', //按钮显示的名称
            type: '',  //按钮的类型,默认空,支持  primary，success，info，warning，danger
            name: '', // 用户点击时返回的组件
            elColWidth: 2, //按钮的占位
          }
        ],
        showTooltipInTable:false, //是否显示tooltip
        loadJdCategoryBrandCascade: false,
        formValueAdjustment: {},
        isLoadGeneralFormTable: false,
        isImportAndExtractComponent: false,
        isTransformAndReleaseComponent: false,
        isLoadTableDataAfterLoadFormTableAtOnce:false,
        isOpenform:false,
        showRefreshButton: false,
        showDownloadButton: false,
        dataFacetKey: '',
        importAndExtractContent: '',
        importAndExtractVisible: false,
        tabularDataDescription: [],
        isAsynExport: false,
        ruleForm: [],
        start: "",
        end: "",
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
        uploadErrorData: {},
       // uploadUrl: this.baseSSO.upload_file_url,
        formData: {},
        pageSettingDataFormClone: {},
        showHlightCurrentRow: false,
        parentSpecialParam: {},
        confirmToAnalyzeDialogVisible: false,
        needTableDataFormatter: false,
        fieldCompositionOptionalValueGroup: {},
        tableDataLoading:false,
        tableLoadingText:'',
        tableDataLink:{}, //表格数据定义的点击事件,详细格式参照tableDataLinksDemo
        tableDataLinksDemo: {
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
        isShowExportNumbers:true
      }
    },
    computed: {
      fullQueryUrl() {
        let url = this.baseUrl + this.queryUrl;
        url += (url.indexOf("?") !== -1) ? "&" : "?";

        url += this.pageParam;

        if (this.specialParamDetails) {  //url
          url += this.specialParamDetails;
        }

        if (this.detailParam !== '') {
          url += (url.indexOf("?") !== -1) ? "&" : "?";
          url += this.detailParam;
        }


        return url;
      },
      fullFormTableUrl() {
        let url = this.baseUrl + this.formTableUrl;
        url += '?data_facet_key=' + this.dataFacetKey;
        return url;
      },
      pageParam() {
        let realQueryPage = this.currentPage - 1;
        let param = 'page=' + realQueryPage + '&size=' + this.pageSize;
        return param;
      },
      fullDeleteUrl() {
        let url = this.baseUrl + this.deleteUrl;
        return url;
      },

      fullModifyUrl() {
        return this.baseUrl + this.modifyUrl;
      },
      detailParam: {
        get() {
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
              else if (item.form_field_query_type === QueryFormType.DATE) {  //判断form表字段中的类型
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

              } else if (typeof item.field_value === 'object') {  //输入类型为object
                let specialparamValues = [];
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
          if (JSON.stringify(this.parentSpecialParam) !== '{}') {
            let specialParamKeys = Object.keys(this.parentSpecialParam);
            for (let i = 0; i < specialParamKeys.length; i++) {
              let itemKey = specialParamKeys[i];
              if (param === '') {
                param = itemKey + '=' + encodeURIComponent(this.parentSpecialParam[itemKey]);
                this.specialParam[itemKey] = this.parentSpecialParam[itemKey];
              } else {
                param = '&' + itemKey + '=' + encodeURIComponent(this.parentSpecialParam[itemKey]);
                this.specialParam[itemKey] = this.parentSpecialParam[itemKey];
              }
            }
          }
          return param;
        },
        set(parentSpecialParam) {
          this.parentSpecialParam = parentSpecialParam;
        }
      },
      specialParamDetails() {
        let param = '';
        if (JSON.stringify(this.parentSpecialParam) !== '{}') {
          let specialParamKeys = Object.keys(this.parentSpecialParam);
          for (let i = 0; i < specialParamKeys.length; i++) {
            let itemKey = specialParamKeys[i];
            if (param === '') {
              param = itemKey + '=' + encodeURIComponent(this.parentSpecialParam[itemKey]);
              this.specialParam[itemKey] = this.parentSpecialParam[itemKey];
            } else {
              param = '&' + itemKey + '=' + encodeURIComponent(this.parentSpecialParam[itemKey]);
              this.specialParam[itemKey] = this.parentSpecialParam[itemKey];
            }
          }
        }
        return param;
      },
      // fullFileServiceUrlForImport() {
      //   return this.uploadUrl;
      // },
      fullUrlForImport() {
        return this.baseUrl + this.importUrl;
      },
      exportDialogTip() {
        let tip = ''

        if (this.totalRecord === 1) {
          tip = 'Confirm to export 1 record?';
        } else {
          if(this.isShowExportNumbers){
            tip = 'Confirm to export ' + this.totalRecord + ' records?';
          }else{
            tip = 'Confirm to export?';
          }

        }

        return tip;
      },
      fullUrlForExport() {
        let url = this.baseUrl + this.exportUrl;

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
        if (this.showImportButton) {
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
        if (this.isTransformAndReleaseComponent) {
          span -= 2;
        }
        if (this.showGeneralDefinitionButton && this.generalDefinitionButtonList.length > 0) {
          for (let i = 0; i < this.generalDefinitionButtonList.length; i++) {
            span -= this.generalDefinitionButtonList[i].elColWidth;
          }
        }
        return span;
      },
      definitionTableButtonWidth(){
        let width = 0;
        if(this.tableDefinitionButtonList && this.tableDefinitionButtonList.length > 0){
          for(let i = 0; i < this.tableDefinitionButtonList.length; i ++){
            let tableOperationWidth = this.tableDefinitionButtonList[i].width;
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

      // this.formData = util.getUploadSignatureFormData(null);
      // console.info(this.formData);
      // let that = this;
      // setInterval(function(){
      //   that.formData = util.getUploadSignatureFormData(null);
      //   console.info("刷新签名");
      //   console.info(that.formData);
      // }, 60000);

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
          if(this.needTableDataFormatter && tableData && tableData.length > 0){
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
        //console.log('error in handleError(): ', err);
        //暂时没有很好的处理方法，简单处理先截取字符
        let error = err.message;
        if (error != null && util.startWith(error, "400 ")) {
          let errorIndex = error.indexOf("400 ");
          if (errorIndex !== -1) {
            let errorData = error.substring(4);
            this.errorTableData = JSON.parse(errorData);
            this.exportDataErrorDialogVisible = true;
          }
        }
        // this.dataLoading = false;
        //   this.$message.error('upload is failed');
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
            if (this.isAsynExport) {
              this.loadingDownload = true;
              this.loadExportSummary(resp.data);
            } else {
              window.location.href = util.getFileSignature(this.loadingDownload, resp.data.fileId);
            }
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
      routeCategoryList() {
        router.push('/ts-category-brand/list');
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
        this.analyzeUrl = options.analyzeUrl != null ? options.analyzeUrl : this.analyzeUrl; //导入文件的url
        this.exportUrl = options.exportUrl != null ? options.exportUrl : this.exportUrl; //导出文件的url
        this.deleteUrl = options.deleteUrl != null ? options.deleteUrl : this.deleteUrl; //删除功能
        this.modifyUrl = options.modifyUrl != null ? options.modifyUrl : this.modifyUrl; //修改功能
        this.tableData = options.tableData != null ? options.tableData : this.tableData; //表格数据填充
        this.tableDefinitionButtonList = options.tableDefinitionButtonList != null ? options.tableDefinitionButtonList : this.tableDefinitionButtonList; //表格内按钮组
        this.dataFacetKey = options.dataFacetKey != null ? options.dataFacetKey : this.dataFacetKey; //data source key
        if (options.pageSize) {
          this.pageSize = options.pageSize;//可以修改默认的每页数量 默认 10
        }
        if (options.isLoadGeneralFormTable) {
          this.isLoadGeneralFormTable = options.isLoadGeneralFormTable; //可以选择是否让组件加载通用的form table， 默认false
        }
        this.pageSettingData = options.pageSettingData != null ? options.pageSettingData : this.pageSettingData;
        this.showImportButton = options.showImportButton != null ? options.showImportButton : this.showImportButton;
        this.showAnalyzeButton = options.showAnalyzeButton != null ? options.showAnalyzeButton : this.showAnalyzeButton;
        this.showExportButton = options.showExportButton != null ? options.showExportButton : this.showExportButton;
        this.showDeleteButton = options.showDeleteButton != null ? options.showDeleteButton : this.showDeleteButton;
        this.showQueryForm = options.showQueryForm != null ? options.showQueryForm : this.showQueryForm;
        this.showAddButton = options.showAddButton != null ? options.showAddButton : this.showAddButton;
        this.showRefreshButton = options.showRefreshButton != null ? options.showRefreshButton : this.showRefreshButton;
        this.showEditButton = options.showEditButton != null ? options.showEditButton : this.showEditButton;
        this.showDownloadButton = options.showDownloadButton != null ? options.showDownloadButton : this.showDownloadButton;
        this.showTableDefinitionButton = options.showTableDefinitionButton != null ? options.showTableDefinitionButton : this.showTableDefinitionButton;
        this.showGeneralDefinitionButton = options.showGeneralDefinitionButton != null ? options.showGeneralDefinitionButton : this.showGeneralDefinitionButton;
        this.needTableDataFormatter = options.needTableDataFormatter != null ? options.needTableDataFormatter : this.needTableDataFormatter;
        this.componentName = options.componentName != null ? options.componentName : this.componentName;
        this.generalDefinitionButtonList = options.generalDefinitionButtonList != null ? options.generalDefinitionButtonList : this.generalDefinitionButtonList;
        this.showTooltipInTable = options.showTooltipInTable != null ? options.showTooltipInTable : this.showTooltipInTable;
        this.tabularDataDescription = options.tabularDataDescription != null ? options.tabularDataDescription : this.tabularDataDescription;
        this.tableLoadingText = options.tableLoadingText != null ? options.tableLoadingText : this.tableLoadingText;
        this.tableDataLink = options.tableDataLink != null ? options.tableDataLink : this.tableDataLink;
        //定制服务
        this.isImportAndExtractComponent = options.isImportAndExtractComponent != null ? options.isImportAndExtractComponent : this.isImportAndExtractComponent;
        this.isTransformAndReleaseComponent = options.isTransformAndReleaseComponent != null ? options.isTransformAndReleaseComponent : this.isTransformAndReleaseComponent;
        this.isAsynExport = options.isAsynExport != null ? options.isAsynExport : this.isAsynExport; //是否异步导出
        this.isLoadTableDataAfterLoadFormTableAtOnce = options.isLoadTableDataAfterLoadFormTableAtOnce != null ? options.isLoadTableDataAfterLoadFormTableAtOnce : this.isLoadTableDataAfterLoadFormTableAtOnce; //加载form 后是否立即执行一次查询
        this.isEtlcomponent = options.isEtlcomponent != null ? options.isEtlcomponent : this.isEtlcomponent;//ETL自定义功能
        this.loadJdCategoryBrandCascade = options.loadJdCategoryBrandCascade != null ? options.loadJdCategoryBrandCascade : this.loadJdCategoryBrandCascade;//ETL自定义功能
        this.isOpenform = options.isOpenform != null ? options.isOpenform : this.isOpenform;//ETL自定义功能
        this.isShowExportNumbers =  options.isShowExportNumbers != null ? options.isShowExportNumbers : this.isShowExportNumbers;//导出是否展示条数
        // 拷贝值，给reset使用
        //显示表格的当前行
        this.showHlightCurrentRow = options.showHlightCurrentRow != null ? options.showHlightCurrentRow : this.showHlightCurrentRow;
        if (options.specialParam) {
          this.updateParentSpecialParam(options.specialParam);
        }

        if(this.isOpenform){
          this.activeNames = ["1"];
        }

        if (this.isLoadGeneralFormTable) {
          this.dataLoading = true;
          this.http.get(this.fullFormTableUrl).then(resp => {
            let data = resp.data;
            let form = data.form;
            // if (form != null && form.length > 0) {
            //   for (let i = 0; i < form.length; i++) {
            //     let item = form[i];
            //     if (item.field_optional_value_list != null && item.field_optional_value_list.length > 0) {
            //       let optionList = [];
            //       for (let j = 0; j < item.field_optional_value_list.length; j++) {
            //         let optionsValue = item.field_optional_value_list[j];
            //         let fieldKey = item.db_field_name;
            //         let option = {};
            //         option.id = optionsValue;
            //         option.name = optionsValue;
            //         optionList.push(option);
            //       }
            //       item.field_optional_value_list = optionList;
            //
            //     }
            //   }
            // }

            this.pageSettingData = data;
            // TOFIXED
            // if(this.loadJdCategoryBrandCascade){
            //   cascadeUtil.loadJdCategoryBrandCascade(this);
            // }

            this.pageSettingDataFormClone = util.deepClone(this.pageSettingData.form);
            // TOFIXED
            // this.$emit("completeLoadForm", this.pageSettingData);

            //加载完form后立即执行查询
            if(this.isLoadTableDataAfterLoadFormTableAtOnce){
              this.runQuery();
            }
            // this.runQuery();
            this.dataLoading = false;
          }).catch(error => {
            console.error(error);
            this.dataLoading = false;
          });

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

        var dd = new Date(od).format(("yyyy-MM-dd HH:mm:ss"));
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
      showImportAndExtractDetail(content) {
        this.importAndExtractContent = content;
        this.importAndExtractVisible = true;
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

          let summaryUrl = 'inventory-dsis/dsis/summary?export_id=' + exportId;

          let intervalId = setInterval(function () {
            that.http.get(summaryUrl).then(resp => {
              let data = resp.data;
              if (data == null || data.failed_at) {
                that.$message.warning(data.failure_reason);
                that.loadingDownload = false;
                window.clearInterval(intervalId);
              } else if (data.s3_url) {
                that.loadingDownload = false;
                window.clearInterval(intervalId);
                window.location.href = util.getFileSignature(this.loadingDownload, resp.data.file_id);
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
        this.$emit("handleTableDefinitionButtonClick", row, name);
      },
      handleConfigureForAll() {
        this.$emit("handleTableDefinitionButtonClick");
      },
      handleGeneralButtonClick(name) {
        this.$emit("handleGeneralButtonClick", name);
      },
      setTableData(tableData){
        this.tableData = tableData;
      },
      clearTableData(){
        this.tableData = [{}];
        this.totalRecord = 0;
      },
      handleChangeCascadeOptions(fieldOptionsGroup) {
        this.fieldCompositionOptionalValueGroup.fk_brand_name = fieldOptionsGroup;
        //同时给级联下拉框的父级填入可选值
        let categoryList = Object.keys(fieldOptionsGroup);
        let form = this.pageSettingData.form;
        if (form && form.length > 0) {
          for (let i = 0; i < form.length; i++) {
            let formItem = form[i];
            if (formItem.form_field_query_type === this.formType.MULTIPLE_CHOICE_LIST && formItem.db_field_name === 'fk_category_name') {
              formItem.field_optional_value_list = [];
              for (let j = 0; j < categoryList.length; j++) {
                let optionsValue = categoryList[j];
                let option = {};
                option.id = optionsValue;
                option.name = optionsValue;
                formItem.field_optional_value_list.push(option);
              }
            }
          }
        }
      },
      handleChangeMultipleSelect(downstreamFieldKey, itemValue){
        if(this.loadJdCategoryBrandCascade === false){
          return;
        }
        let itemOptions = this.fieldCompositionOptionalValueGroup[downstreamFieldKey];
        if(downstreamFieldKey != null || itemOptions !== null || itemOptions.length > 0){
          for (var i = 0; i < this.pageSettingData.form.length; i++) {
            let item =   this.pageSettingData.form[i];
            if(item.db_field_name === downstreamFieldKey){
              item.field_optional_value_list = [];

              for (var j = 0; j < itemValue.length; j++) {
                for(let k =0; k < itemOptions[itemValue[j]].length ; k++){
                  if(itemOptions[itemValue[j]][k] !== null){
                    let optionsValue = itemOptions[itemValue[j]][k];
                    let option = {};
                    option.id = optionsValue;
                    option.name = optionsValue;
                    item.field_optional_value_list.push(option);
                  }
                }
              }
              let selectOtion = item.field_value;
              if(item.field_value != null && item.field_value.length >0){
                item.field_value = [];
                for (var j = 0; j < selectOtion.length; j++) {
                  if(this.inArray(item.field_optional_value_list, selectOtion[j])){
                    item.field_value.push(selectOtion[j]);
                  }
                }
              }
            }
          }

        }


      },
      inArray(arr, str) {
        let i = arr.length;
        while (i--) {
          if (arr[i].id === str) {
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
      isIncludeTableDataLinkField(fieldKey){
        let fieldList = this.tableDataLink.fieldProperty;
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
      handleCustomTableDataLink(row,fieldKey){
        let fieldList = this.tableDataLink.fieldProperty;
        if(this.tableDataLink.needCustomProcess){
          this.$emit("handleTableValueClick", row, fieldKey);

        }else{

          if(fieldList && fieldList.length){
            let i = fieldList.length;
            while (i--) {
              if (fieldList[i].db_field_name === fieldKey) {
                this.tableDataCustomerDetails = row[fieldList[i].dialogDisplaysValueFromFields];
                this.tableDataCustomerVisible = true;
              }
            }
          }
        }

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
    margin-top: 20px;

  }

  .adapt-bottom {
    margin-bottom: 20px;
  }

  .pagination {
    display: inline-block;
    padding-left: 0;
    margin: 20px 0;
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
    background: deepskyblue !important;
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
    width: auto;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: auto;
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

  .el-input--small /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-select-small /deep/ .el-input--small /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-range-editor--small .el-range__close-icon, /deep/ .el-range-editor--small .el-range__icon {
    line-height: 20px;
  }

  .el-date-editor /deep/ .el-range-separator {
    line-height: 20px;
    width: 5%;
    color: #303133;
    font-size: 12px;
  }

  .el-table /deep/ .cell {
    line-height: 13px;
  }
  .query-form /deep/ .el-row{
    margin-bottom: 4px;

  }
  .el-collapse-item /deep/ .el-collapse-item__header{
    height:24px;
  }
  .el-collapse-item  /deep/ .el-collapse-item__content{
    padding-bottom: 0px;

  }
  .tool-bar .el-col{
    /* margin-top: -20px;*/
  }
  .el-table /deep/  td{
    padding: 9px 0;
    background: gainsboro;
  }




</style>


