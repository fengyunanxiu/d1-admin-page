import Vue from 'vue'
import Router from 'vue-router'
import Container from '@/components/container'
import CommonView from '@/view/common-view'
import sampleView from '@/view/sample-view'
import Index from '@/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'container',
      component: Container
    },
    {
      path: '/common-view',
      name: 'commonView',
      component: CommonView
    },
    {
      path: '/sample-view',
      name: 'sampleView',
      component: sampleView
    },
      {
          path: '/index',
          name: 'index',
          component: Index,
          meta:{
            title: 'D1 Demo Page'
          }
      }
  ]
})
