<template>
    <view class="page">
      <u-navbar :fixed="true" placeholder :bgColor="themeColors" @leftClick="back">
          <view class="navTitle" slot="left">
              <u-icon name="arrow-left" color="#FFF"></u-icon>
              <text style="margin-left: 20rpx">确认订单</text>
          </view>
      </u-navbar>
      <view class="content">
          <!-- 票务信息 -->
          <view class="title" style="margin:40rpx 0"  v-if="!info.many_tickets">
              <view class="colorBox" :style="`background:`+themeColors"></view>
              <view class="titleStr">票务信息</view>
          </view>
          <view class="ticketInfo" v-if="!info.many_tickets">
              <view style="display: flex;justify-content: space-between" >
                  <p class="test">
                      {{ info.name}}门票  
                  </p>
                  <p class="money">
                       ¥{{info.price}}
                  </p>
              </view>
             
              <view  v-for="checkItem in ticketInfo.activities" :key="checkItem.activity_id" style="display: flex;justify-content: space-between;margin-top: 20rpx;">
              <p class="test">
                  {{ checkItem.title}} 
              </p>
              <p class="money">
                  ¥{{checkItem.price||0}}
              </p>
          </view>
          </view>
         
          <!-- 订单信息 -->
          <view class="title" style="margin:40rpx 0" >
              <view class="colorBox" :style="`background:`+themeColors"></view>
              <view class="titleStr">订单信息</view>
          </view>
          <view class="ticketInfo" > 
              <view class="cell" v-for="(item, index) in showList" :key="index">
                  <text class="cellTitle">{{ item.name }}</text>
                  <text class="cellCon">{{ item.value }}</text>
              </view>
          </view>
          <view  class="checkBtn" :style="`background:`+themeColors" @click="toCenter" > 
              查看门票
          </view>
      </view>
    </view>
  </template>
  
  <script>
  import {getOpenid,getTicketOrderInfo,verifyDisCode} from '@/api/pay.js';
  import {getExhibitTicketInfo,ticketByWxPay} from "@/api/combination"
  import {getMyTicket} from "@/api/register";
  import {getInfo} from "@/api/list.js";
  import config from "@/utils/config";
  export default {
      data() {
              return {
                  themeColors: uni.getStorageSync("color"),
                  timeIcon: require("../../static/time.svg"),
                  showList:[],
                  open_id:'',
                  info:{},
                  showInfo:false,
                  showPop:false,
                  showRule:false,
                  haveDiscount:false,
                  discount_code:'',
                  totalPrices:0,
                  textd_code:'使用优惠码',
                  dmoney :0,
                  orderInfo:'',
                  ticketInfo:{},
                  checkList:[],
                  actprice:0,
                  current:1,
              }
          },
          onShow() {
              getTicketOrderInfo({exhibit_id:uni.getStorageSync("exhibit_id")}).then((res)=>{
                  this.ticketInfo = res.data
                  if(this.ticketInfo.status ==1){
                      this.showList=[
                      {name: '支付状态',value: '已支付'},
                      {name: '实付款',value:'¥'+this.ticketInfo.price},
                      {name: '支付方式',value: '微信支付'},
                      {name: '优惠码',value: this.ticketInfo.discount_code||''},
                      {name: '订单编号',value: this.ticketInfo.out_order_no},
                      {name: '创建时间',value: this.ticketInfo.created_at},
                      {name: '支付时间',value: this.ticketInfo.updated_at},
                      ]
                      this.showInfo = false
                  }else{
                      this.showInfo = true
                  }
                  
              })
          },
          async onLoad(options) {
              uni.showLoading({
                      title: "加载中",
                  });
             await getInfo({
                  exhibit_id: uni.getStorageSync("exhibit_id"),
              }).then((res) => {
                      this.info = res.data
                      this.info.many_tickets = JSON.parse(res.data.many_tickets)
                      console.log(this.info.many_tickets)
                      this.totalPrices = Number(this.actprice) + Number(this.info.price)
                      uni.hideLoading();
              });
          },  
          methods:{
              check(num,money){
                  this.current = num 
                  this.totalPrices = money
              },
              back() {
                  uni.navigateBack();
               },
               //优惠码确认是有有效
               confirm(){
                  this.totalPrices = Number(this.actprice) + Number(this.info.price)
                  verifyDisCode({discount_code:this.discount_code,exhibit_id: uni.getStorageSync("exhibit_id")}).then((res)=>{
                      if(res.code ==1){
                          this.showPop =false
                          this.dmoney  = res.data.discount_price
                          
                          if(Number(this.totalPrices)-Number(this.dmoney)<0){
                              this.dmoney = this.totalPrices
                              this.totalPrices = 0
                          }else{
                              this.totalPrices = this.totalPrices - this.dmoney
                          }
                          this.textd_code = this.discount_code
                          this.haveDiscount = true
                      }else{
                          this.showRule = true
                      }
                  })
               },
               topay() {
                  uni.showLoading({
                      title: "加载中",
                  });
                  let that = this;
                  uni.login({
                  provider: "weixin",
                  scopes: "auth_user",
                  success: (loginRes) => {
                       uni.getUserInfo({
                          provider: "weixin",
                          success: (infoRes) => {
                              //拉取openid
                               getOpenid({
                                  js_code: loginRes.code,
                                  iv: infoRes.iv,
                                  encrypted_data: infoRes.encryptedData,
                                  code: config.project,
                              }).then((res)=>{
                                  let obj = {
                                      exhibit_id:that.info.exhibit_id,
                                      trade_type:1,
                                      openid:res.data.openid,
                                      activity_ids:[],
                                      type:''
                                  }
                                  //判断优惠券 更改pay_type
                                  if(that.haveDiscount){
                                      obj.discount_code = that.discount_code
                                  }
                                  if(that.info.many_tickets && that.current !==1){
                                      obj.people_num = that.current
                                      obj.type = 0
                                  }else if(that.info.many_tickets && that.current ==1){
                                      obj.type = 0
                                  }else if(that.checkList.length){
                                      obj.type = 1
                                      obj.activity_ids.push(that.checkList.map(res=>{
                                          return res.activity_id
                                      }))
                                  }else{
                                      obj.type = 0
                                  }
                                  obj.activity_ids = obj.activity_ids.join()
                                  //支付
                                  ticketByWxPay(obj).then((res)=>{
                                      that.orderInfo = res.data
                                      //优惠券抵扣
                                      if(that.totalPrices == 0 ){
                                          uni.showLoading({
                                              title: "加载中",
                                          });
                                          this.getTicketInfo()
                                          return
                                      }
                                     //微信支付
                                      uni.getProvider({
                                          service:'payment',
                                          success:(loginRes)=>{
                                              uni.requestPayment({
                                                  "provider":loginRes.provider[0],
                                                  appid:that.orderInfo.appId,
                                                  timeStamp:that.orderInfo.timeStamp,
                                                  nonceStr:that.orderInfo.nonceStr,
                                                  package: that.orderInfo.package,
                                                  signType:that.orderInfo.signType,
                                                  paySign:that.orderInfo.paySign,
                                              success:()=>{
                                                  uni.showLoading({
                                                      title: "加载中",
                                                  });
                                                  that.getTicketInfo()
                                              },
                                              fail: function (err) {
                                                  console.log(that)
                                                  uni.hideLoading();
                                                  uni.showToast({
                                                      title: '支付失败',
                                                      icon:"none",
                                                  })
                                              }
                                              })
                                          }
                                      })
                                      
                                  })
                              })
                          }
                          })
                          }
                      })
                  
  
               
               },
               toCenter(){
                  getMyTicket({
                              exhibit_id: uni.getStorageSync("exhibit_id"),
                          }).then((res) => {
                              uni.setStorageSync("tickerInfo", JSON.stringify(res.data));
                              uni.switchTab({
                                  url: "/pages/center/index",
                              });
                          })
               },
               getTicketInfo(){
                  getTicketOrderInfo({exhibit_id:uni.getStorageSync("exhibit_id")}).then((res)=>{
                  this.ticketInfo = res.data
                  this.showList=[
                      {name: '支付状态',value: '已支付'},
                      {name: '实付款',value: this.ticketInfo.price},
                      {name: '支付方式',value: '微信支付'},
                      {name: '优惠码',value: this.ticketInfo.discount_code||''},
                      {name: '订单编号',value: this.ticketInfo.out_order_no},
                      {name: '创建时间',value: this.ticketInfo.created_at},
                      {name: '支付时间',value: this.ticketInfo.updated_at},
                  ]
                  this.showInfo = false
                  uni.hideLoading();
              })
               }
          }
  }
  </script>
  
  <style lang="scss" scoped> 
      .page {
          min-height: 92vh;
          background: rgb(239, 239, 239);
          padding-bottom: 0;
          padding-bottom: constant(safe-area-inset-bottom);
          padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
      }
  
      .navTitle {
          display: flex;
          color: rgb(255, 255, 255);
          font-size: 36rpx;
          line-height: 36rpx;
          text-align: left;
      }
      .content{
          padding:48rpx 32rpx;
          .title{
              display: flex;
              align-items: center;
              margin-bottom: 24rpx;
              .colorBox{
                  width: 12rpx;
                  height: 32rpx;
                  margin-right:24rpx;
              }
              .titleStr{
                  font-size: 32rpx;
              }
          }
          .ticketInfo{
              background: #FFF;
              border: 2rpx solid #FFF;
              border-radius: 20rpx;
              padding: 24rpx 32rpx;
              .money{
                  color: rgba(255, 0, 0, 0.85);
                  font-size: 28rpx;
              }
          
              .time{
                  display: flex;
                  color: rgb(153, 153, 153);
                  font-size: 24rpx;
                  font-weight: 500;
                  margin-left: 10rpx;
                  margin-top:20rpx ;
              }
              .cell {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  border-bottom: 1px solid rgba(210, 210, 210, 0.25);
                  padding: 30rpx 0;
  
                  .cellTitle {
                      font-size: 28rpx;
                      color: #000;
                      width: 260rpx;
                      margin-left: 20rpx;
                  }
  
                  .cellCon {
                      font-size: 24rpx;
                      color: rgba(0, 0, 0, 0.45);
                  }
              }
          }
          .checkBtn{
              width: 246rpx;
              height: 70rpx;
              color: #FFF;
              font-size: 28rpx;
              margin: 96rpx auto;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius:70rpx;
          }
      }
      .footer{
          position: fixed;
          bottom: 0;
          width: 100%;
          box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
          background: rgb(255, 255, 255);
          padding-top: 12rpx;
          padding-bottom: 0;
          padding-bottom: constant(safe-area-inset-bottom);
          padding-bottom: calc(env(safe-area-inset-bottom));
          .discounts{
                  display: flex;
                  align-content: center;
                  border-radius: 20rpx;
                  overflow: hidden;
                  margin: 12rpx 38rpx;
                  .left{
                      padding: 0 20rpx;
                      height: 64rpx;
                      display: flex;
                      align-items: center;
                      .icon{
                          width: 48rpx;
                          height: 48rpx;
                      }
                  }
                  .right{
                      width: 80%;
                      font-size: 24rpx;
                      height: 64rpx;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      padding: 0 40rpx;
                     
                  }
              }
          .down{
              display: flex;
               align-items: center;
               justify-content: space-between;
              .left{
                  margin-left:38rpx ;
              }
              .right{
                  margin-right: 38rpx;
              }
          }
  
      }
      .subBtn{
              padding: 24rpx 44rpx;
              color: #FFF;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 20rpx;
          }
  </style>