// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import http from './assets/js/http/via-axios.js'


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VXETable)
VXETable.use(VXETablePluginElement)
Vue.prototype.axios = axios;
Vue.prototype.http = http;
Vue.prototype.baseUrl = window.baseConfig.baseUrl;
Vue.prototype.uploadUrl = window.baseConfig.uploadUrl;


// 更改标题
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


VXETable.setup({
  // 默认表格参数
  size: 'small',
  showOverflow: null,
  showHeaderOverflow: null,
  stripe: false,
  border: false,
  resizable: false,
  fit: true,
  showHeader: true,
  validConfig: {
    message: 'default'
  },
  // 行数据的唯一主键字段名
  rowId: '_ID',
  // 版本号（对于某些带 Storage 数据储存的功能有用到，上升版本号可以用于重置 Storage 数据）
  version: 0,
  // 自定义图标配置（如果全部图标都使用自定义，就不需要引入 Icon 模块了，减少体积）
  icon: {
    sortAsc: 'vxe-icon--caret-top',
    sortDesc: 'vxe-icon--caret-bottom',
    filter: 'vxe-icon--funnel',
    edit: 'vxe-icon--edit-outline',
    tree: 'vxe-icon--caret-right',
    jumpPrev: 'vxe-icon--d-arrow-left',
    jumpNext: 'vxe-icon--d-arrow-right',
    prevPage: 'vxe-icon--arrow-left',
    nextPage: 'vxe-icon--arrow-right',
    msgClose: 'vxe-icon--close',
    msgInfo: 'vxe-icon--info',
    msgSuccess: 'vxe-icon--success',
    msgWarning: 'vxe-icon--warning',
    msgError: 'vxe-icon--error',
    msgLoading: 'vxe-icon--refresh roll'
  },
  // 高级表格默认配置
  grid: {
    proxyConfig: {
      autoLoad: true,
      message: true,
      props: {
        list: null,
        result: 'result',
        total: 'page.total'
      }
    }
  },
  // 默认快捷菜单
  menu: {},
  // 默认 tooltip 主题样式
  tooltip: {
    zIndex: 99,
    theme: 'dark'
  },
  // 默认分页参数
  pager: {
    pageSize: 10,
    pagerCount: 7,
    pageSizes: [10, 15, 20, 50, 100],
    layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total'] // 非常灵活的分页布局，支持任意位置随意换
  },
  // 默认工具栏参数
  toolbar: {
    setting: false,
    buttons: []
  },
  // 默认消息提示框参数
  message: {
    zIndex: 999,
    lockView: true,
    lockScroll: true,
    mask: true,
    duration: 3000,
    animat: true
  },
  // 默认优化配置项
  optimization : {
    animat: true,
    // 当表头大于 40 列时自动启用横向 X 滚动渲染
    scrollX: {
      gt: 40,
      oSize: 5,
      rSize: 16
    },
    // 当行数据大于 500 条时自动启用纵向 Y 滚动渲染
    scrollY: {
      gt: 500,
      oSize: 20,
      rSize: 80
    }
  }
})
