<template>
  <div  >

    <div v-loading.fullscreen.lock="fullScreenLoading"
         element-loading-text="Loading, please wait..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
    </div>



    <el-dialog
            title="About D1"
            :visible.sync="openCopyrightDialogVisible"
            :close-on-click-modal="false"
            :center="true"
            width="30%"
            size="small">

      <div class="dialog">
        <div> v0.1 alpha</div>
        <div> A fast data visualization toolkit</div>
        <div> &copy;2019 g740 team</div>

      </div>
    </el-dialog>

    <el-dialog
      @closed="resetDbConfig"
      title="Add Data Source"
      :visible.sync="addDataSourceDialogVisible"
      :close-on-click-modal="false"
      :center="true"
      width="60%"
      size="small">



      <div class="dialog-content-bottom">
        <el-form>
        <el-row :gutter="12">
          <el-col :span="6">
            <div class="text-right text-dialog"><span class="red">*</span> DB Server Type:</div>
          </el-col>
          <el-col :span="16">
            <el-form-item label="">
              <el-select v-model="dbConfig.db_basic_config_dto.db_type">
                <el-option label = "MYSQL" value ="MYSQL"></el-option>
<!--                <el-option label = "ORACLE" value ="ORACLE"></el-option>-->
<!--                <el-option label = "SQLSERVER" value ="SQLSERVER"></el-option>-->
<!--                <el-option label = "POSTGRESQL" value ="POSTGRESQL"></el-option>-->
<!--                <el-option label = "DB2" value ="DB2"></el-option>-->
<!--                <el-option label = "SQLITE" value ="SQLITE"></el-option>-->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

      <el-row :gutter="12">
          <el-col :span="6">
            <div class="text-right text-dialog"><span class="red">*</span> Data Source Name:</div>
          </el-col>
          <el-col :span="15">
              <el-input v-model="dbConfig.db_basic_config_dto.db_name"></el-input>
          </el-col>
      </el-row>
        </el-form>

      </div>

      <el-tabs class="el-tabs" type="border-card" @tab-click="handleTabClick" v-model="activeTabName">
        <el-tab-pane label="General" name="general">


          <el-form
            :model="editBasicInfo"
            ref="editBasicInfo"
            label-position="left"
          >

            <el-row :gutter="12">
              <el-col :span="4">
                <div class="text-right text-dialog"><span class="red">*</span> Host:</div>
              </el-col>
              <el-col :span="14">
                <el-form-item label="">
                  <el-input v-model="dbConfig.db_basic_config_dto.db_host"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <div class="text-right text-dialog"><span class="red">*</span> Port:</div>
              </el-col>
              <el-col :span="4">
                <el-form-item label="">
                  <el-input v-model="dbConfig.db_basic_config_dto.db_port"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <div class="text-right text-dialog"><span class="red">*</span> User:</div>
              </el-col>
              <el-col :span="20">
                <el-form-item label="">
                  <el-input v-model="dbConfig.db_basic_config_dto.db_user"></el-input>
                </el-form-item>
              </el-col>





              <el-col :span="4">
                <div class="text-right text-dialog"><span class="red">*</span> Password:</div>
              </el-col>
              <el-col :span="20">
                <el-form-item label="">
                  <el-input v-model="dbConfig.db_basic_config_dto.db_password" type="password"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="SSH/SSL" name="ssh_or_ssl">
          <el-form
            :model="editBasicInfo"
            ref="editBasicInfo"
            label-position="left"
          >
          <el-row :gutter="12">
            <el-col :span="24">
              <el-form-item label="">
              <el-checkbox true-label="true" label="Use SSH tunnel" v-model="dbConfig.db_security_config_dto.use_ssh_tunnel"></el-checkbox>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <div class="text-right text-dialog">Proxy Host:</div>
            </el-col>
            <el-col :span="14">
              <el-form-item label="">
              <el-input :disabled="useSSHTunnel" v-model="dbConfig.db_security_config_dto.ssh_proxy_host"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div class="text-right text-dialog">Port:</div>
            </el-col>
            <el-col :span="4">
              <el-form-item label="">
              <el-input v-model="dbConfig.db_security_config_dto.ssh_proxy_port"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div class="text-right text-dialog">Proxy User:</div>
            </el-col>
            <el-col :span="20">
              <el-form-item label="">
              <el-input v-model="dbConfig.db_security_config_dto.ssh_proxy_user"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div class="text-right text-dialog">Auth type:</div>
            </el-col>
            <el-col :span="20">
              <el-form-item label="">
              <el-select v-model="dbConfig.db_security_config_dto.ssh_auth_type">
                <el-option label="password" value="Password"></el-option>
                <el-option label="Key pair (OpenSSH or PuTTY)" value="openSSHOrPuTTY"></el-option>
                <!--<el-option label="OpenSSH config and authentication agent" value="OpenSSHConfig"></el-option>-->
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="dbConfig.db_security_config_dto.ssh_auth_type === 'Password'">
              <el-col :span="4">
                <div class="text-right text-dialog">Proxy Password:</div>
              </el-col>
              <el-col :span="20">
                <el-form-item label="">
                <el-input v-model="dbConfig.db_security_config_dto.ssh_proxy_password" type="password"></el-input>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" v-if="dbConfig.db_security_config_dto.ssh_auth_type === 'openSSHOrPuTTY'">
              <el-col :span="4">
                <div class="text-right text-dialog">private key file:</div>
              </el-col>
              <el-col :span="20">
                <el-form-item label="">
                  <el-upload
                          :action="uploadUrl +'?method=add&field=ssh_key_file'"
                          ref="uploadFile"
                          :show-file-list="false"
                          :http-request="uploadFileRequest"
                          :before-upload="handleBeforeUpload"
                          name="file"
                          :auto-upload="true"
                          >

                    <span v-if="dbConfig.db_security_config_dto.file_name !== ''"  style="cursor: pointer;">{{dbConfig.db_security_config_dto.file_name}}</span>
                    <el-button size="small" type="success"><i class="fa fa-upload"></i> Import</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <div class="text-right text-dialog">Passphrase:</div>
              </el-col>
              <el-col :span="20">
                <el-form-item label="">
                  <el-input v-model="dbConfig.db_security_config_dto.ssh_pass_phrase" type="password"></el-input>
                </el-form-item>
              </el-col>
            </el-col>

            <el-col :span="24">
              <el-form-item label="">
                <el-checkbox true-label="true" label="Use SSL" v-model="dbConfig.db_security_config_dto.use_ssl"></el-checkbox>
              </el-form-item>
            </el-col>

          </el-row>

          </el-form>
        </el-tab-pane>


      </el-tabs>

      <div style="text-align: left;padding-top: 15px;color: red;font-size: 15px">
        Read Only. D1 only executes queries on Data Source
      </div>

      <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="testConnection">Test Connection</el-button>
              <el-button type="success" @click="saveDataSource">Save</el-button>
              <el-button @click="addDataSourceDialogVisible = false">close</el-button>
      </span>
    </el-dialog>



    <el-dialog
            @closed="resetEditDbConfig"
            title="Edit Data Source"
            :visible.sync="editDataSourceDialogVisible"
            :close-on-click-modal="false"
            :center="true"
            width="60%"
            size="small">


      <div class="dialog-content-bottom">

        <el-form>
          <el-row :gutter="12">
            <el-col :span="6">
              <div class="text-right text-dialog"><span class="red">*</span> DB Server Type:</div>
            </el-col>
            <el-col :span="16">
              <el-form-item label="">
                <el-select v-model="editDbConfig.db_basic_config_dto.db_type">
                  <el-option label = "MYSQL" value ="MYSQL"></el-option>
                  <!--                <el-option label = "ORACLE" value ="ORACLE"></el-option>-->
                  <!--                <el-option label = "SQLSERVER" value ="SQLSERVER"></el-option>-->
                  <!--                <el-option label = "POSTGRESQL" value ="POSTGRESQL"></el-option>-->
                  <!--                <el-option label = "DB2" value ="DB2"></el-option>-->
                  <!--                <el-option label = "SQLITE" value ="SQLITE"></el-option>-->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        <el-row :gutter="12">
          <el-col :span="6">
            <div class="text-right text-dialog"><span class="red">*</span> Data Source Name:</div>
          </el-col>
          <el-col :span="15">
            <el-input v-model="editDbConfig.db_basic_config_dto.db_name"></el-input>
          </el-col>
        </el-row>
        </el-form>

      </div>

      <el-tabs class="el-tabs" type="border-card" @tab-click="handleTabClick" v-model="activeTabName">
        <el-tab-pane label="General" name="general">
          <el-form

                  label-position="left"
          >

            <el-row :gutter="12">
              <el-col :span="4">
                <div class="text-right text-dialog"><span class="red">*</span> Host:</div>
              </el-col>
              <el-col :span="14">
                <el-form-item label="">
                  <el-input v-model="editDbConfig.db_basic_config_dto.db_host"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <div class="text-right text-dialog"><span class="red">*</span> Port:</div>
              </el-col>
              <el-col :span="4">
                <el-form-item label="">
                  <el-input v-model="editDbConfig.db_basic_config_dto.db_port"></el-input>
                </el-form-item>
              </el-col>
              <!--              <el-col :span="3">
                              <div class="text-right text-dialog">Database:</div>
                            </el-col>
                            <el-col :span="21">
                              <el-form-item label=" ">
                                <el-input></el-input>
                              </el-form-item>
                            </el-col>-->

              <el-col :span="4">
                <div class="text-right text-dialog"><span class="red">*</span> User:</div>
              </el-col>
              <el-col :span="20">
                <el-form-item label="">
                  <el-input v-model="editDbConfig.db_basic_config_dto.db_user"></el-input>
                </el-form-item>
              </el-col>





              <el-col :span="4">
                <div class="text-right text-dialog"><span class="red">*</span> Password:</div>
              </el-col>
              <el-col :span="20">
                <el-form-item label="">
                  <el-input v-model="editDbConfig.db_basic_config_dto.db_password" type="password"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="SSH/SSL" name="ssh_or_ssl">
          <el-form
                  label-position="left"
          >
            <el-row :gutter="12">
              <el-col :span="24">
                <el-form-item label="">
                  <el-checkbox true-label="true" label="Use SSH tunnel" v-model="editDbConfig.db_security_config_dto.use_ssh_tunnel"></el-checkbox>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <div class="text-right text-dialog">Proxy Host:</div>
              </el-col>
              <el-col :span="14">
                <el-form-item label="">
                  <el-input :disabled="useSSHTunnel" v-model="editDbConfig.db_security_config_dto.ssh_proxy_host"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <div class="text-right text-dialog">Port:</div>
              </el-col>
              <el-col :span="4">
                <el-form-item label="">
                  <el-input v-model="editDbConfig.db_security_config_dto.ssh_proxy_port"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <div class="text-right text-dialog">Proxy User:</div>
              </el-col>
              <el-col :span="20">
                <el-form-item label="">
                  <el-input v-model="editDbConfig.db_security_config_dto.ssh_proxy_user"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <div class="text-right text-dialog">Auth type:</div>
              </el-col>
              <el-col :span="20">
                <el-form-item label="">
                  <el-select v-model="editDbConfig.db_security_config_dto.ssh_auth_type">
                    <el-option label="password" value="Password"></el-option>
                    <el-option label="Key pair (OpenSSH or PuTTY)" value="openSSHOrPuTTY"></el-option>
                    <!--<el-option label="OpenSSH config and authentication agent" value="OpenSSHConfig"></el-option>-->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="editDbConfig.db_security_config_dto.ssh_auth_type === 'Password'">
                <el-col :span="4">
                  <div class="text-right text-dialog">Proxy Password:</div>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="">
                    <el-input v-model="editDbConfig.db_security_config_dto.ssh_proxy_password" type="password"></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24" v-if="editDbConfig.db_security_config_dto.ssh_auth_type === 'openSSHOrPuTTY'">
                <el-col :span="4">
                  <div class="text-right text-dialog">private key file:</div>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="">
                    <el-upload
                            :action="uploadUrl +'?method=edit&field=ssh_key_file'"
                            ref="uploadFile"
                            :show-file-list="false"
                            :http-request="uploadFileRequest"
                            :before-upload="handleBeforeUpload"
                            name="file"
                            :auto-upload="true"
                    >

                      <span v-if="editDbConfig.db_security_config_dto.file_name !== ''"  style="cursor: pointer;">{{editDbConfig.db_security_config_dto.file_name}}</span>
                      <el-button size="small" type="success"><i class="fa fa-upload"></i> Import</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <div class="text-right text-dialog">Passphrase:</div>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="">
                    <el-input v-model="editDbConfig.db_security_config_dto.ssh_pass_phrase" type="password"></el-input>
                  </el-form-item>
                </el-col>
              </el-col>

              <el-col :span="24">
                <el-form-item label="">
                  <el-checkbox true-label="true" label="Use SSL" v-model="editDbConfig.db_security_config_dto.use_ssl"></el-checkbox>
                </el-form-item>
              </el-col>

            </el-row>

          </el-form>
        </el-tab-pane>


      </el-tabs>

      <div style="text-align: left;padding-top: 15px;color: red;font-size: 15px">
        Read Only. D1 only executes queries on Data Source
      </div>

      <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="testEditConnection">Test Connection</el-button>
              <el-button type="success" @click="saveEditDataSource">Save</el-button>
              <el-button @click="editDataSourceDialogVisible = false">close</el-button>
      </span>
    </el-dialog>

    <el-row :gutter="10">
      <el-col :span="showDataSource ? 5 : 1">
        <div class="area left-data-source" :style="{height: screenHeight +'px'}">
          <div class="tool-container-collapse" v-if="showDataSource === false">
            <div class="text-center cursor" @click="showDataSource = true">
              <el-tooltip content="Show" placement="top" :open-delay="1000">
               <!--<i class="el-icon-right fa-2x tool-icon-right cursor" aria-hidden="true" @click="showDataSource = true"></i>-->
                <div style="height: 40px;line-height: 40px;font-weight: 700">D1</div>
              </el-tooltip>
            </div>
          </div>
          <!-- 工具条 -->
          <div class="tool-container-header" v-else>
            <el-row :gutter="10">
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="5">
                <div class="text-right d1-logo" style="padding-top: 10px;text-align: left">
                  D1
                </div>
              </el-col>

              <el-col :span="12">
                <div class="text-left d1-logo" style="padding-top: 10px;">
                  Data Facet
                </div>
              </el-col>

              <!--<el-col :span="3">-->
                <!--<div class="text-right">-->
                  <!--<el-tooltip content="Search Data Facet Key" placement="top" :open-delay="1000">-->
                    <!--<i class="el-icon-search fa-2x tool-icon-right cursor" aria-hidden="true"></i>-->
                  <!--</el-tooltip>-->
                <!--</div>-->
              <!--</el-col>-->

              <el-col :span="4">
                <div class="text-right">
                <el-tooltip content="Hide" placement="top" :open-delay="1000">
                <i class="el-icon-minus fa-2x cursor"  aria-hidden="true" @click="showDataSource = false"></i>
                </el-tooltip>
                </div>
              </el-col>
            </el-row>

          </div>
          <div class="tool-container" v-if="showDataSource === true">
            <el-row :gutter="10">
              <el-col :span="16">
                <div class="text-right" style="padding-top: 10px;margin-left: 12px;">
                  <el-input v-model="filterText" size="small" placeholder="Search Data Facet Key" title="Search Data Facet Key"></el-input>

                </div>
              </el-col>
              <el-col :span="2">
                <div class="text-left">
            <span @click="addDataSource">
            <el-tooltip content="Add data source" placement="top" :open-delay="1000">
              <i class="el-icon-plus fa-2x tool-icon"></i>
            </el-tooltip>

              </span>
                </div>


                <!--<span>-->
                <!--<el-tooltip content="Scroll from tab" placement="top" :open-delay="1000">-->
                <!--<i class="el-icon-aim fa-2x tool-icon" aria-hidden="true"></i>-->
                <!--</el-tooltip>-->
                <!--</span>-->
                <!--<span>-->
                <!--<el-tooltip content="Collapse All" placement="top" :open-delay="1000">-->
                <!--<i class="el-icon-zoom-out fa-2x tool-icon" aria-hidden="true"></i>-->
                <!--</el-tooltip>-->

                <!--</span>-->



              </el-col>
              <el-col :span="6">
                <div class="text-left">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" menu-trigger="click">
                      <el-submenu index="1">
                        <template slot="title"><i class="el-icon-setting fa-2x tool-icon-right-menu container-background-color cursor" aria-hidden="true"></i></template>
                        <el-menu-item index="2-2"><el-checkbox v-model="showDataFacetOnly">Show Data Facet Only</el-checkbox></el-menu-item>

<!--                        <el-menu-item index="2-1"><el-checkbox v-model="showDictionryManagement">Dictionary Management</el-checkbox></el-menu-item> -->
                        <el-menu-item index="2-1"><i class="fa fa-book fa-lg" aria-hidden="true"></i> <span style="margin-left: 3px" @click="openDictManagement">Dictionary Management</span></el-menu-item>
                        <el-menu-item index="2-3"><i class="fa fa-copyright" aria-hidden="true"></i> <span style="margin-left: 3px" @click="openCopyRightDialog">About D1</span></el-menu-item>
                      </el-submenu>


                    </el-menu>

                  <!--<el-dropdown>-->
                    <!--<i class="el-icon-setting el-icon&#45;&#45;right cursor tool-icon-right-menu"></i>-->
                    <!--&lt;!&ndash;<i class="el-icon-arrow-down"></i>&ndash;&gt;-->
                    <!--<el-dropdown-menu slot="dropdown">-->
                      <!--<el-dropdown-item>Dictionary Management</el-dropdown-item>-->
                      <!--<el-dropdown-item><el-checkbox v-model="showDataFacetOnly">Show Data Facet Only</el-checkbox></el-dropdown-item>-->
                    <!--</el-dropdown-menu>-->
                  <!--</el-dropdown>-->


                </div>
              </el-col>
            </el-row>
          </div>




          <!-- 数据源列表部分开始 -->
          <data-source-structure ref="structure" v-if="showDataSource" @showDataFacetKey="showDataFacetKey"
                                 @editDataSource="editDataSource"
                                  @refreshTreeComplete="refreshTreeComplete"></data-source-structure>
          <div v-else>
            <span style="  writing-mode: vertical-lr;margin-top: 10px;font-size: 15px;">Data Facets</span>

          </div>
        </div>

      </el-col>
      <el-col :span="showDataSource ? 19 : 23">
        <div class="area right-data-source" :style="{height: screenHeight +'px'}" >

          <template v-if="editableTabs.length == 0 && dictTableTabs.length == 0 ">
            <div style="width: 100%;height: 100%;background-color: gray;text-align: center;display:table;">
               <div style=" display:table-cell;vertical-align:middle;font-size: 30px">Data Facet Configuration Area</div>

            </div>
            </template>


          <el-tabs v-model="editableTabsValue" type="card" closable @edit="handleTabsEdit" >

            <el-tab-pane :key="item.id"
                         v-for="(item, index) in dictTableTabs"
                         :label="item.label"
                         :name="item.id + '' ">
              <dict-mgmt> </dict-mgmt>
            </el-tab-pane>

            <el-tab-pane
              :key="item.id"
              v-for="(item, index) in editableTabs"
              :label="item.label"
              :name="item.id + '' "
            >

              <data-source-setting  :node="item"></data-source-setting>

            </el-tab-pane>
          </el-tabs>

<!--          </template>-->


        </div>
      </el-col>
    </el-row>

  </div>

</template>

<script>
  import dataSourceStructure from '@/components/data-source-structure'
  import dataSourceSetting from '@/components/data-source-setting.vue'
  import util from '@/util/util.js'
  import dictMgmt from '@/view/dict-mgmt.vue'

  export default {
    name: "container",
    components: {
      dictMgmt,
      dataSourceStructure,
      dataSourceSetting
    },
    created(){
      let screenHeight = window.innerHeight
              || document.documentElement.clientHeight
              || document.body.clientHeight;
      this.screenHeight = screenHeight - 40;
    },
    mounted(){
      let that = this;
      window.onresize = function () {
        let screenHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
        that.screenHeight = screenHeight - 40;
      }

    },

    data() {
      return {
        openCopyrightDialogVisible:false,
        screenHeight:800,
        editableTabsValue: '',
        editableTabs: [],
       // tabIndex: 2,
          activeIndex: '1',
          filterText:'',
        search: '',
        addDataSourceDialogVisible: false,
        useSSHTunnel:false,
        editBasicInfo: {},
        sshAuthType: 'paasword',
        activeTabName: 'general',
        showDataSource:true,
        showDataFacetOnly:false,
        node:{crumbs:{}},
        dbConfig :{
            db_basic_config_dto:{
              db_type :'MYSQL',
              db_port: 3306
            },
            db_security_config_dto:{
                use_ssh_tunnel:false,
                use_ssl: false,
                // ssh file使用
                ssh_auth_type : "Password",
                current_file_name:'',
                file_name:'',
                ssh_proxy_port: 22

            }
        },
        editDbConfig :{
          db_basic_config_dto:{},
          db_security_config_dto:{
            use_ssh_tunnel:false,
            use_ssl: false,
            ssh_auth_type : "Password",
            current_file_name:'',
            file_name:'',
          }
        },
        uploadObj:{},
        uploadObjField:'',
        editDataSourceDialogVisible:false,
        structureList: [{
          id: 1,
          label: 'ipbm-qa',
          level: 1,
          children: [{
            id: 4,
            label: 'ipbm-dsis',
            level: 2,
            children: [{
              id: 9,
              label: 'ds_bs_eretailer',
              level: 3,
              children: [{
                id: 9,
                label: 'Eretailer',
                level: 4,
                description:'this is eretailer business 1'
              }]
            }, {
              id: 10,
              label: 'ds_bs_free_goods',
              level: 3
            }]
          }, {
            id: 2,
            level: 2,
            label: 'ipbm-dms',
            children: [{
              id: 5,
              level: 3,
              label: 'basic_ship_to'
            }, {
              id: 6,
              label: 'basic_std_brand'
            }]
          }, {
            id: 3,
            level: 2,
            label: 'ipbm_fes',
            children: [{
              id: 7,
              level: 3,
              label: 'biz_jd_c_fcst'
            }, {
              id: 8,
              level: 3,
              label: 'biz_jd_c_fcst_by_rpc'
            }]
          }]
        }],
        fullScreenLoading:false,
        dictTableTabs:[],
        openDictManagementTab:false,
        dictMgmtTabId:'dict-mgmt'
      }
    },
      watch: {
          filterText(val) {
              this.$refs.structure.filter(val, this.showDataFacetOnly);
          },
          showDataFacetOnly(showDataFacetOnly){
              // if(showDataFacetOnly){
              //     this.activeIndex = "1";
              // }else{
              //     this.activeIndex = "0";
              // }
              this.$refs.structure.filter(this.filterText, showDataFacetOnly);
          },


        screenHeight (val) {
          // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
          if (!this.timer) {
            // 一旦监听到的screenHeight值改变，就将其重新赋给data里的screenHeight
            this.screenHeight = val
            this.timer = true
            let that = this
            setTimeout(function () {
              // 打印screenWidth变化的值
              console.log(that.screenHeight)
              that.timer = false
            }, 400)
          }
        }
      },
    methods: {
      openDictManagement(){
        if(!this.openDictManagementTab){
          let dictTable = {};
          dictTable.label = "Dict Mgmt";
          dictTable.id =  this.dictMgmtTabId;
          this.dictTableTabs.push(dictTable);
          this.openDictManagementTab = true;
        }
        this.editableTabsValue =  this.dictMgmtTabId;
      },
      handleTabsEdit( targetName,action ,node) {
        if (action === 'add' || action === 'edit') {
          let oldFlag = false;
          for(var i in this.editableTabs){
            if (node.id  == this.editableTabs[i].id){
              oldFlag = true;
              this.editableTabs[i] = node;
              break;
            }
          }
          if(!oldFlag){
            this.editableTabs.push(node);
          }
          if(action === 'add'){
            this.editableTabsValue = node.id  +"" ;
          }

        }
        if (action === 'remove') {
          let activeName = this.editableTabsValue;
          if(targetName == this.dictMgmtTabId){
            this.dictTableTabs = [];
            this.openDictManagementTab = false;

            //如果当前选中的也是dict mgmt
            if(activeName == this.dictMgmtTabId){
              if(this.editableTabs){
                this.editableTabsValue = this.editableTabs[0].id +'';
              }
            }

          }else{
              let tabs = this.editableTabs;
              if(!targetName){
                targetName = node.id +"";
              }
              if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                  if (tab.id+"" === targetName) {
                    let nextTab = tabs[index + 1] || tabs[index - 1];
                    if (nextTab) {
                      activeName = nextTab.id +"";
                    }
                    // 如果不存在，需要考虑跳回dictMgmtTabId
                    else{
                      if(this.dictTableTabs){
                        activeName = this.dictMgmtTabId;
                      }
                    }
                  }
                });
              }


              this.editableTabsValue = activeName;
              let removededitableTabs = [];
              for(var i in this.editableTabs){
                if(this.editableTabs[i].id+"" === targetName){
                }else{
                  removededitableTabs.push(this.editableTabs[i]);
                }
              }
              this.editableTabs = removededitableTabs;
            }
          }


      },
      addDataSource() {
        this.addDataSourceDialogVisible = true;
      },
      saveDataSource() {
          let url = this.baseUrl + 'd1-core/d1/datasource/add';

          if(!this.dbConfig.db_basic_config_dto.db_name){
              this.$message.warning('Please input Data Source Name');
              return;
          }
          if(!this.dbConfig.db_basic_config_dto.db_host){
              this.$message.warning('Please input Host');
              return;
          }
          if(!this.dbConfig.db_basic_config_dto.db_port){
              this.$message.warning('Please input Port');
              return;
          }
          if(!this.dbConfig.db_basic_config_dto.db_user){
              this.$message.warning('Please input User');
              return;
          }
          if(!this.dbConfig.db_basic_config_dto.db_password){
              this.$message.warning('Please input Password');
              return;
          }

          this.fullScreenLoading = true;
          this.http.post(url, this.dbConfig).then(resp => {
              this.addDataSourceDialogVisible = false;
              let data = resp.data;
            this.fullScreenLoading = false;
              if(data){
                this.$message.success('Operation Success');
                this.$refs.structure.addDataSource(data);
              }else{
                this.$message.error('Operation Failed');
                console.error("增加DS返回为空");
              }



          }).catch(error => {
            this.fullScreenLoading = false;
              console.error(error);
          });
      },
      testConnection(){
        let url = this.baseUrl + "d1-core/d1/datasource/test-connection";
          if(!this.dbConfig.db_basic_config_dto.db_name){
              this.$message.warning('Please input Data Source Name');
              return;
          }
          if(!this.dbConfig.db_basic_config_dto.db_host){
              this.$message.warning('Please input Host');
              return;
          }
          if(!this.dbConfig.db_basic_config_dto.db_port){
              this.$message.warning('Please input Port');
              return;
          }
          if(!this.dbConfig.db_basic_config_dto.db_user){
              this.$message.warning('Please input User');
              return;
          }
          if(!this.dbConfig.db_basic_config_dto.db_password){
              this.$message.warning('Please input Password');
              return;
          }

          this.fullScreenLoading = true;
        this.http.post(url, this.dbConfig).then(resp => {
          this.fullScreenLoading = false;
            this.$message.success('Connect Success');


        }).catch(error => {
          this.fullScreenLoading = false;
          console.error(error);
        })
      },
      testEditConnection(){


        let url = this.baseUrl + "d1-core/d1/datasource/test-connection";
          if(!this.editDbConfig.db_basic_config_dto.db_name){
              this.$message.warning('Please input Data Source Name');
              return;
          }
          if(!this.editDbConfig.db_basic_config_dto.db_host){
              this.$message.warning('Please input Host');
              return;
          }
          if(!this.editDbConfig.db_basic_config_dto.db_port){
              this.$message.warning('Please input Port');
              return;
          }
          if(!this.editDbConfig.db_basic_config_dto.db_user){
              this.$message.warning('Please input User');
              return;
          }
          if(!this.editDbConfig.db_basic_config_dto.db_password){
              this.$message.warning('Please input Password');
              return;
          }

        this.fullScreenLoading = true;
        this.http.post(url, this.editDbConfig).then(resp => {

          this.fullScreenLoading = false;

            this.$message.success('Connect Success');

        }).catch(error => {
          this.fullScreenLoading = false;
          console.error(error);
        })

      },
      saveEditDataSource(){
        let url = this.baseUrl + 'd1-core/d1/datasource/edit-property';
          if(!this.editDbConfig.db_basic_config_dto.db_name){
              this.$message.warning('Please input Data Source Name');
              return;
          }
          if(!this.editDbConfig.db_basic_config_dto.db_host){
              this.$message.warning('Please input Host');
              return;
          }
          if(!this.editDbConfig.db_basic_config_dto.db_port){
              this.$message.warning('Please input Port');
              return;
          }
          if(!this.editDbConfig.db_basic_config_dto.db_user){
              this.$message.warning('Please input User');
              return;
          }
          if(!this.editDbConfig.db_basic_config_dto.db_password){
              this.$message.warning('Please input Password');
              return;
          }

        this.fullScreenLoading = true;
        this.http.post(url, this.editDbConfig).then(resp => {
          this.fullScreenLoading = false;
          this.editDataSourceDialogVisible = false;
          this.$refs.structure.saveEditDataSource(this.editDbConfig.db_basic_config_dto);
          this.$message.success('Operation Success');
        }).catch(error => {
          this.fullScreenLoading = false;

        });
      },

      handleTabClick() {

      },
      showDataFacetKey(node,action){
        this.node = node;
        this.handleTabsEdit( "", action,node);
      },
      deleteDataSource(){
          this.$refs.structure.removeDataFacetKey();
      },
      editDataSource(){

        let node = this.$refs.structure.getCurrentNode();
        if(node && node.data.level == 1){

          this.fullScreenLoading = true;
          this.editDataSourceDialogVisible = true;
          let id = node.data.id;
          let url = this.baseUrl + "d1-core/d1/datasource/select-property?dsId=" +id;
          this.http.get(url).then(resp => {
            this.fullScreenLoading = false;
            let dataList = resp.data;
            let data ;
            if(dataList){
              data =dataList[0];
            }

            let copyEditDbConfig = {
              db_basic_config_dto :{},
              db_security_config_dto:{}
            };

            copyEditDbConfig.db_basic_config_dto.id = data.id;
            copyEditDbConfig.db_basic_config_dto.db_type = data.db_type;
            copyEditDbConfig.db_basic_config_dto.db_name = data.db_name;
            copyEditDbConfig.db_basic_config_dto.db_host = data.db_host;
            copyEditDbConfig.db_basic_config_dto.db_port = data.db_port;
            copyEditDbConfig.db_basic_config_dto.db_password = data.db_password;
            copyEditDbConfig.db_basic_config_dto.db_user = data.db_user;
            if(data.use_ssl){
              copyEditDbConfig.db_security_config_dto.use_ssl = true;
            }else{
              copyEditDbConfig.db_security_config_dto.use_ssl = false;
            }
            if(data.use_ssh_tunnel){
              copyEditDbConfig.db_security_config_dto.use_ssh_tunnel = true;
            }else {
              copyEditDbConfig.db_security_config_dto.use_ssh_tunnel = false;
            }

            if(data.ssh_auth_type){
              copyEditDbConfig.db_security_config_dto.ssh_auth_type = data.ssh_auth_type;
            }else{
              copyEditDbConfig.db_security_config_dto.ssh_auth_type = "Password";
            }


            copyEditDbConfig.db_security_config_dto.ssh_local_port = data.ssh_local_port;
            copyEditDbConfig.db_security_config_dto.ssh_proxy_host = data.ssh_proxy_host;
            copyEditDbConfig.db_security_config_dto.ssh_proxy_password = data.ssh_proxy_password;
            copyEditDbConfig.db_security_config_dto.ssh_proxy_port = data.ssh_proxy_port;
            copyEditDbConfig.db_security_config_dto.ssh_proxy_user = data.ssh_proxy_user;

            let sshKeyFile = data.ssh_key_file;
            if(sshKeyFile){
              copyEditDbConfig.db_security_config_dto.ssh_key_file = sshKeyFile;

              let fileName = sshKeyFile;

              // 不同系统的分隔符不同；另外 / \符号不能作为文件或者文件夹名
              let index = fileName.lastIndexOf("/");
              if(index != -1){
                fileName = fileName.substr(index + 1);
              }else{
                index = fileName.lastIndexOf("\\");
                if(index != -1){
                  fileName = fileName.substr(index + 1);
                }
              }
              index = fileName.indexOf("_");
              if(index != -1){
                fileName = fileName.substr(index + 1);
              }
              copyEditDbConfig.db_security_config_dto.file_name = fileName;
            }
            copyEditDbConfig.db_security_config_dto.ssl_ca_file = data.ssl_ca_file;
            copyEditDbConfig.db_security_config_dto.ssl_client_certificate_file = data.ssl_client_certificate_file;
            copyEditDbConfig.db_security_config_dto.ssl_client_key_file = data.ssl_client_key_file;
            this.editDbConfig = util.deepClone(copyEditDbConfig);

            console.log("====================================");
            console.log(data);
          }).catch(error => {
            this.fullScreenLoading = false;
            console.error(error);
          });


        }else{
          this.$message.warning("Please Select Level 1 Node");
          return;
        }
      },
      handlePreview(){
        console.info("handlePreview...........")
      },
      handleSuccess(ProgressEvent){
        console.info(ProgressEvent);
        let response = JSON.parse(ProgressEvent.currentTarget.response);
        let filePath = response.file_path;
        let actionUrl = ProgressEvent.currentTarget.responseURL;
        let parameterObj = util.parseQueryString(actionUrl);
        let method = parameterObj.method;
        let field = parameterObj.field;
        if(method === 'add'){
          if(field === 'ssh_key_file'){
            this.dbConfig.db_security_config_dto.file_name = this.dbConfig.db_security_config_dto.current_file_name;
            this.dbConfig.db_security_config_dto.ssh_key_file = filePath;
          }

        }else if(method === 'edit'){
          if(field === 'ssh_key_file'){
            this.editDbConfig.db_security_config_dto.file_name = this.editDbConfig.db_security_config_dto.current_file_name;
            this.editDbConfig.db_security_config_dto.ssh_key_file = filePath;
          }
        }



        this.$message.success('上传文件成功');

      },
      handleError(resp){
        console.info("handleError...........")
        console.info(resp);
        this.$message.error('upload is failed');
      },
      handleBeforeUpload(file){
        const isLt35M= file.size / 1024 / 1024 <= 35;

        if (!isLt35M) {
          this.$message.warning('上传文件大小不能超过35MB');
        }else{
          this.dataLoading = true;
        }
        return isLt35M;
      },
      uploadFileRequest(request){
        console.log();
        this.dataLoading = true;
        let actionUrl = request.action;
        let parameterObj = util.parseQueryString(actionUrl);
        let method = parameterObj.method;
        let field = parameterObj.field;
        let fileName = request.file.name;

        if(method === 'add'){
          if(field === 'ssh_key_file'){
            this.dbConfig.db_security_config_dto.current_file_name = fileName;
          }
        }else if(method === 'edit'){
          if(field === 'ssh_key_file'){
            this.editDbConfig.db_security_config_dto.current_file_name = fileName;
          }
        }else{
          $.message.warning("wrong http method");
          return;
        }



        let that = this;
        setTimeout(function(){
          util.uploadFileForElementUpload(request,that);
        },500);

      },
      resetEditDbConfig(){
        this.editDbConfig = {
          db_basic_config_dto:{},
          db_security_config_dto:{
            use_ssh_tunnel:false,
            use_ssl: false,
            ssh_auth_type : "Password",
            current_file_name:'',
            file_name:'',
          }
        }
      },
      resetDbConfig(){
       this.dbConfig = {
          db_basic_config_dto:{
            db_type : 'MYSQL'
          },
          db_security_config_dto:{
            use_ssh_tunnel:false,
                    use_ssl: false,
                    // ssh file使用
                    ssh_auth_type : "Password",
                    current_file_name:'',
                    file_name:''


          }
        }
      },
      handleSelect(key, keyPath) {
          console.log(key, keyPath);
      },
        refreshTreeComplete(){
          let that = this;
          setTimeout(function(){that.$refs.structure.filter(that.filterText, that.showDataFacetOnly)}, 1000);
        },
      openCopyRightDialog(){
        console.log("testOpen")
        this.openCopyrightDialogVisible = true;
      }
    }

  }
</script>

<style scoped>
  .area {
    margin-top: 10px;
    /*padding: 10px;*/
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    background-color: #f6f8f9;
    overflow: hidden;
    /*box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);*/
    font-size: 10px;
  }

  .left-data-source {
    /*height: 800px;*/
    overflow: auto;
  }

  .right-data-source {
    /*height: 800px;*/
    overflow: auto;
  }

  .tool-container {
    border-bottom: 1px solid #d1dbe5;
    width: 105%;
    margin-right: -10px;
    margin-left: -10px;
    text-align: left;
  }

  .tool-container-collapse{
    border-bottom: 1px solid #d1dbe5;
    /* width: 105%;*/
    /* margin-right: -10px;*/
    margin-left: -10px;
    text-align: left;
    background-color: #409eff;
  }

  .tool-container-header {
    border-bottom: 1px solid #d1dbe5;
    width: 105%;
    margin-right: -10px;
    margin-left: -10px;
    text-align: left;
    background-color: #409eff;
  }
  .container-background-color{
    background-color: #f6f8f9;
  }


  .tool-icon {

    cursor: pointer;
    padding: 10px 0px 10px 5px;
  }

  .tool-icon-right {
    margin-right: 10px;
    padding: 10px;
    margin-top: 5px;
    padding: 10px;
  }
  .tool-icon-hide{
    margin-top: 15px;
  }
  .tool-icon-right-menu {
    margin-right: -2px;
    padding: 10px;

  }
  .cursor {
    cursor: pointer;
  }

  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
    margin-left: 10px;
  }


  .d1-logo{
    border-radius: 30px;
    font-weight: 700;
    color: white;
    line-height: 2px;
  }



  .el-input--small /deep/ .el-input__inner {
    height: 22px;
    line-height: 32px;
    padding: 5px;
  }

  *, ::after, ::before {
    box-sizing: border-box;
  }
  .dialog-content-top{
    margin-top: 10px;
  }
  .dialog-content-bottom{
    margin-bottom: 10px;
  }
  .red{
    color:red;
  }
  .el-submenu /deep/ .el-submenu__title{
    padding: 0 0px;
    height: 0px;
    line-height: 0px;
  }



  /deep/ .el-menu.el-menu--horizontal {
    border-bottom: none;
  }

  /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title {
    height: 30px;
    line-height: 30px;
  }


  /deep/ .el-menu{
    background-color: #f6f8f9;
  }
  /deep/ .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,/deep/ .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
    background-color: #f6f8f9;
  }
</style>
