import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'
import share from '@/utils/share.js'
import './uni.promisify.adaptor'
Vue.use(uView)
Vue.config.productionTip = false
Vue.mixin(share)
App.mpType = 'app'

const app = new Vue({
  ...App, share
})
app.$mount()

// main.js，注意要在use方法之后执行

// 如此配置即可
uni.$u.config.unit = 'rpx'
