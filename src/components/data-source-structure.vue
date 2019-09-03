<template>
  <div>

     <div v-loading.fullscreen.lock="fullScreenLoading"
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
      <div class="dialog">Confirm to delete this data source?</div>
      <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirmToRemoveDialogVisible = false">No</el-button>
              <el-button type="danger" @click="confirmToRemove">Yes</el-button>
            </span>
    </el-dialog>


    <el-dialog
            title="Confirm"
            :visible.sync="confirmToRemovekeyDialogVisible"
            :close-on-click-modal="false"
            :center="true"
            size="tiny">
      <div class="dialog">Confirm to delete this data facet ? </div>
        <br>
        <div class="dialog" style="font-weight: lighter;font-size: 10px">Deleting data facet won't impact database/schema/table/view</div>
      <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirmToRemovekeyDialogVisible = false">No</el-button>
              <el-button type="danger" @click="confirmToRemoveKey">Yes</el-button>
            </span>
    </el-dialog>

    <el-dialog
      title="Add Data Facet"
      :visible.sync="addDataFacetKeyDialogVisible"
      :close-on-click-modal="false"
      :center="true"
      width="30%"
      size="small">

      <el-form

        label-position="left"
        label-width="120px"

      >

        <el-form-item label="Data Facet Key: "  required>

          <el-input v-model="dfKey" size="small" placeholder ="letters,underline or numbers,length < 50" title=" letters,underline or numbers,length < 50"></el-input>
        </el-form-item>

        <el-form-item label="Description: " >
          <el-input v-model="dsDescription" type="textarea" size="small"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
              <el-button type="success" @click="saveDataFacetKey">Save</el-button>
              <el-button @click="addDataFacetKeyDialogVisible = false">close</el-button>
      </span>
    </el-dialog>


    <!--edit DataFacetKey-->
    <el-dialog
            title="Edit Data Facet"
            :visible.sync="editDataFacetKeyDialogVisible"
            :close-on-click-modal="false"
            :center="true"
            width="30%"
            size="small">

      <el-form
              label-position="left"
              label-width="120px"
      >
        <el-form-item label="Data Facet Key: "  required  placeholder ="letters,underline or numbers,length < 50" title=" letters,underline or numbers,length < 50">
          <el-input v-model="editDfKey.newDfKey" size="small"></el-input>
        </el-form-item>

        <el-form-item label="Description: ">
          <el-input v-model="editDfKey.description" type="textarea" size="small"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
              <el-button type="success" @click="saveEditDataFacetKey">Save</el-button>
              <el-button @click="editDataFacetKeyDialogVisible = false">close</el-button>
      </span>
    </el-dialog>

    <div class="block">
      <el-tree
         ref="tree"
        :data="structure"
        node-key="id"
        highlight-current
        @node-click="nodeClick"
        :filter-node-method="filterNode"
         empty-text="Empty Content"
        :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
           <el-tooltip :content="node.label" placement="top" :open-delay="500">
        <span class="black min-font">

          <i class="fa fa-server" aria-hidden="true" v-if="node.level === 1"></i>
           <i class="fa fa-database" aria-hidden="true" v-else-if="node.level === 2"></i>
           <i class="fa fa-table" aria-hidden="true" v-else-if="node.level === 3"></i>
           <i class="fa fa-puzzle-piece" aria-hidden="true" v-else> </i>

                {{ splitTableName(node.label) }}

        </span>
                </el-tooltip>
        <span>



             <el-button size="mini"
                        type="success"
                        @click="refreshData(node, data)"
                        v-if="node.level === 1 && node.loading === false" ><i class="fa fa-refresh"></i></el-button>

             <el-button size="mini"
                        type="success"
                        v-if="node.level === 1 && node.loading" :loading="true"></el-button>

            <el-button size="mini"
                       type="primary"
                       @click="editDataSource(node)"
                       v-if="node.level === 1"><i class="fa fa-edit"></i></el-button>

            <el-button size="mini"
                       type="danger"
                       @click="removeDataFacetKey(node)"
                       v-if="node.level === 1"><i class="fa fa-remove"></i></el-button>

            <el-button size="mini"
                       type="success"
                       @click="addDataFacetKey(node)"
                       v-if="node.level === 3"><i class="fa fa-plus"></i></el-button>


           <el-button size="mini"
                      type="success"
                      @click="editDataFacetKey(node)"
                      v-if="node.level === 4"><i class="fa fa-edit"></i></el-button>

          <el-button
            type="danger"
            size="mini"
            @click="remove(node, data)"
            v-if="node.level === 4"> <i class="fa fa-remove"></i>
          </el-button>
        </span>
      </span>
      </el-tree>
    </div>

  </div>
</template>

<script>
    import util from '@/util/util.js'
    export default {
        name: "data-source-structure",
      props: {

      },
      data() {
        return {
          addDataFacetKeyDialogVisible: false,
          editBasicInfo:{},
          structure: [],
          dfKey:'',
          dsDescription:'',
          nodeSelect: {},
          currentNode:'',
          showDataFacetOnly:false,
          loadingObject : {},
          confirmToRemoveDialogVisible: false,
          nodeRemoveSelect:{
            node:{},
            data:{}
          },
          confirmToRemovekeyDialogVisible: false,
          editDfKey:{
            dfKey :'',
            newDfKey:'',
            description:''
          },
          editNodeSelect:{},
          editDataFacetKeyDialogVisible:false,
            fullScreenLoading:false
        }
      },
      computed: {
        firstParentNode(){
          return this.currentNode !== '' &&  currentNode.parent == null;
        }
      },
      created(){
        this.loadStructure();
      },
      methods:{
        addDataFacetKey(node){
          this.addDataFacetKeyDialogVisible = true;
          this.nodeSelect = node;
        },
        saveDataFacetKey(){

            if(!this.dfKey || !util.matchWordCase(this.dfKey)   ){
                this.$message.warning("data facet key must be a combination of letters,underline or numbers");
                return;l
            }
            if(this.dfKey.length > 50){
                this.$message.warning("data facet key's length should not exceed 50 ");
                return;
            }
            this.fullScreenLoading = true;


            let url = this.baseUrl + 'd1-core/d1/datasource/add-dfkey';
            let payload = {};
            payload.df_key = this.dfKey;
            payload.description = this.dsDescription;
            payload.fk_db_id = this.nodeSelect.parent.parent.data.id;
            payload.schema_name = this.nodeSelect.parent.data.label;
            payload.table_name = this.nodeSelect.label;
            this.http.post(url, payload).then(resp => {

                let data = resp.data;
                this.fullScreenLoading= false;
                this.addDataFacetKeyDialogVisible = false;
                // 不加载，直接页面操作(不知道怎么进行判断，id没有)

                this.$message.success('Operation Success');
                if(!this.nodeSelect.data.children){
                    this.nodeSelect.data.children = [];
                }
                this.nodeSelect.data.children.push(data);

            }).catch(error => {
                this.fullScreenLoading = false;
            });
        },
        remove(node,data){
          this.nodeRemoveSelect.node = node;
          this.nodeRemoveSelect.data = data;
          this.confirmToRemovekeyDialogVisible = true;
        },
        confirmToRemoveKey(){
          let url = this.baseUrl + 'd1-core/d1/datasource/delete-dfkey?dfKey=' + this.nodeRemoveSelect.data.label;
          this.http.delete(url).then(resp => {
            this.confirmToRemovekeyDialogVisible = false;
            this.$message.success('Operation Success');
            this.removeNode(this.nodeRemoveSelect.node,this.nodeRemoveSelect.data);
            this.showDataFacetKey(this.nodeRemoveSelect.node,"remove");
          }).catch(error => {
            this.confirmToRemovekeyDialogVisible = false;

          });
        },
        // 真正执行删除节点
        removeNode(node, data){
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === data.id);
          children.splice(index, 1);
        },
        removeDataFacetKey(node){
          this.currentNode = node;
            this.confirmToRemoveDialogVisible = true;
        },
        showDataFacetKey(node,action){
            let nodeDocument = node.data;
            //开始补充parent 信息
            let crumbs = {};
            crumbs.tableName = node.parent.data.label;
            crumbs.schemaName = node.parent.parent.data.label;
            crumbs.sourceName = node.parent.parent.parent.data.label;
            nodeDocument.crumbs = crumbs;
            this.$emit("showDataFacetKey", nodeDocument, action);
        },
        nodeClick(data, node, myself){
          //只有第4个级别才是data facet key，才需要触发点击事件
          if(node.level === 4){
            this.showDataFacetKey(node,"add")
          }

          if(node.level == 1){
              //nothing todo
          }

          this.currentNode = node;

        },
          loadStructure(){
            let url = this.baseUrl + 'd1-core/d1/datasource/select';
            this.http.get(url).then(resp => {
                this.structure = resp.data;

            })
        },
          confirmToRemove(){
               let url = this.baseUrl + 'd1-core/d1/datasource/delete?dsId=' + this.currentNode.data.id;
               this.fullScreenLoading = true;

              this.http.delete(url).then(resp => {
                  this.confirmToRemoveDialogVisible = false;

                 this.deleteNode(this.structure, this.currentNode.data.id);
                  this.currentNode = '';
                 this.$message.success('Operation Success');
                  this.fullScreenLoading = false;
              }).catch(error => {
                  this.fullScreenLoading = false;
              });
          },
          deleteNode(nodeList,nodeId){
            if(nodeList != null){
              for(let i = 0; i < nodeList.length; i ++){
                let nodeItem = nodeList[i];
                if(nodeItem.id === nodeId){
                   nodeList.splice(i, i+1);
                    return ;
                }
              }
            }
          },
        getCurrentNode(){
          return this.currentNode;
        },
        editDataFacetKey(node){
          this.editNodeSelect = node;
          if(node && node.data.level == 4){
            this.editDataFacetKeyDialogVisible = true;
            this.fullScreenLoading = true;

            let selectDfKey = node.data.label;
            this.editDfKey.dfKey = selectDfKey;
            this.editDfKey.newDfKey = selectDfKey;
            let url = this.baseUrl + "d1-core/d1/datasource/basic-dfkey-info?dfKey=" + selectDfKey;
            this.http.get(url).then(resp => {

                this.fullScreenLoading = false;
              let data = resp.data;
              if(data){
                this.editDfKey.description = data.description;
              }else{
                this.editDataFacetKeyDialogVisible = false;
                this.$message.error('Operation Failed');
              }

            }).catch(error => {
              this.editDataFacetKeyDialogVisible = false;
                this.fullScreenLoading = false;
            })
          }else{
            this.$message.warning("Please Select Datasource Key Node");
          }

        },
        addDataSource(dataSourceNode){
          if(!this.structure){
              this.structure =[];
          }
          this.structure.push(dataSourceNode);
        },
        saveEditDataSource(editBasicDbConfig){
          let structureData = this.structure;
          let chooseId = editBasicDbConfig.id;
          let label = editBasicDbConfig.db_name;
          for(var i in structureData){
              if(chooseId == structureData[i].id){
                  structureData[i].label = label;
                  return;
              }
          }

        },
        saveEditDataFacetKey(){
            if(!this.editDfKey.newDfKey || !util.matchWordCase(this.editDfKey.newDfKey)){
                this.$message.warning("data facet key must be a combination of letters,underline or numbers");
                return;
            }

            if(this.editDfKey.newDfKey.length > 50){
                this.$message.warning("data facet key's length should not exceed 50 ");
                return;
            }

            this.fullScreenLoading = true;
          let url = this.baseUrl + "d1-core/d1/datasource/update-dfkey?dfKey=" + this.editDfKey.dfKey + "&newDfKey=" + this.editDfKey.newDfKey;

          if(this.editDfKey.description == null || this.editDfKey.description == '' ){
          }else{
            url += "&description=" + this.editDfKey.description;
          }
          this.http.post(url).then(resp => {
           let data = resp.data;
              this.fullScreenLoading = false;

             this.editNodeSelect.data.label = this.editDfKey.newDfKey;

             this.showDataFacetKey(this.editNodeSelect, "edit");
             this.editDataFacetKeyDialogVisible = false;
             this.$message.success('Operation Success');

          }).catch(error => {

              this.fullScreenLoading = false;
            this.editDataFacetKeyDialogVisible = false;
          })

        },
          editDataSource(node){
            this.currentNode = node;
              this.$emit('editDataSource');
          },
          filterNode(value, data) {
            if(this.showDataFacetOnly){
                return data.level === 4 && this.dataIndexOfValue(value, data);
            }else{
               return this.dataIndexOfValue(value, data);
            }
          },
          dataIndexOfValue(value, data){
              if (!value) return true;
              return data.label.indexOf(value) !== -1;
          },
          filter(value, showDataFacetOnly){
            this.showDataFacetOnly = showDataFacetOnly;
              this.$refs.tree.filter(value);
          },
          refreshData(node, data){
              for(let i= 0 ;i < this.structure.length ; i ++){
                  if(data.id === this.structure[i].id){
                      // if(! this.structure.children){
                      //
                      // }
                      node.loading = true;
                      let url = this.baseUrl + 'd1-core/d1/datasource/refresh-datasource?dsId=' + data.id;
                      this.http.get(url).then(resp =>{
                          let data = resp.data;
                          if(data){
                              this.structure[i].children = data.children;
                          }
                          node.loading = false;
                          this.$emit("refreshTreeComplete");
                      }).catch(error => {
                          node.loading = false;
                         // this.$message.error('Loading Failed');

                      })
                  }

              }
          },
          //表名最多只显示12个字符
          splitTableName(tableName){
             if(tableName && tableName.length > 20){
                 return tableName.substring(0,20) + "...";
             }
            return tableName;
          }
      }
    }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .black{
    color: black;
  }

  .el-button--mini, .el-button--mini.is-round {
    padding: 2px 2px;
  }


  /*.el-select {*/
  /*  width: auto !important;*/
  /*}*/

  /*.el-input {*/
  /*  width: auto !important;*/
  /*}*/
  /*.el-textarea{*/
  /*  width: auto !important;*/
  /*}*/

  .el-form-item__label {
    width: 112px;
    text-align: right !important;
  }
  .el-form--label-left /deep/ .el-form-item__label {
    width: 36%;
    text-align: right;
      font-size: 12px;
  }

  /*.el-input /deep/ .el-input__inner{*/
  /*  width: 250px;*/
  /*}*/

  /*.el-textarea /deep/ .el-textarea__inner{*/
  /*  width: 250px;*/
  /*}*/

  .el-tree--highlight-current /deep/ .el-tree-node.is-current > .el-tree-node__content{
    background-color: #d7d6de;
  }
    .min-font{
        font-size: 12px;
    }

    /*/deep/ .el-textarea__inner{*/
    /*    padding: 5px 15px 10px 5px;*/
    /*}*/





</style>
