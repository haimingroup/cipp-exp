import { index } from '@/api/v3';
<template>
    <view class="page">
       <u-navbar
           :fixed="true"
           placeholder
           :bgColor="themeColors"
           @leftClick="back"
         >
           <view class="navTitle" slot="left">
             <u-icon name="arrow-left" color="#FFF"></u-icon>
             <text style="margin-left: 20rpx">参观领票</text>
           </view>
       </u-navbar>
       <view>
         <image class="headerImg" :src="imgSrc" mode="scaleToFill" />
       </view>
       <view class="hint" :style="`background: linear-gradient(to bottom, #FFF, `+themeColors +`);`">
        <text :style="'color:'+color_d">{{ notice }}</text>
        </view>
       <view class="content">
        <view class="title">
            <view class="colorBox" :style="`background: `+themeColors +`;`"></view>
            <text>{{ info.title }}</text>
        </view>
        <view class="dec">
            <rich-text :nodes="info.content"></rich-text>
        </view>
       </view>
    </view>
   </template>
   
   <script>
   import{getTicketList }from'@/api/register'
   export default {
    data() {
    return {
         themeColors: uni.getStorageSync('color'),
         imgSrc: uni.getStorageSync("ceilingImg"),
         color_d:uni.getStorageSync('color_d'),
         index:0,
         info:{},
         notice:'',
        }
    },
    onLoad(options){
        uni.showLoading({
            title: '加载中',
            mask: true
        })
        this.index = options.index
        getTicketList({exhibit_id:uni.getStorageSync('exhibit_id')}).then(res=>{
            this.notice = res.data.exhibit.notice
           this.info = res.data.tickets[this.index]
           uni.hideLoading();
        })
    },
    methods:{
        back(){
            uni.navigateBack({
              delta: 1
            })
          },
    }
   }
   </script>
   
   <style scoped lang="scss">
     .page {
     min-height: 92vh;
     background: rgb(239, 239, 239);
     padding-bottom: 0;
     padding-bottom: constant(safe-area-inset-bottom);
     padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
     position: relative;
   }
   
     .navTitle {
       display: flex;
       color: rgb(255, 255, 255);
       font-size: 36rpx;
       font-weight: 700;
       line-height: 36rpx;
       text-align: left;
     }
     .headerImg {
       width: 750rpx;
       height: 532rpx;
     }
     .hint{
        width: 686rpx;
        height: 60rpx;
        margin: 0 auto;
        position: relative;
        line-height: 60rpx;
        text-align: center;
        font-size: 28rpx;
        top: -40rpx;
        border-radius: 10rpx;
     }
     .content{
       position: relative;
       margin: 0 44rpx;
       background: #FFF;
       border-radius: 20rpx;
       padding: 32rpx 38rpx ;
        .title{
         display: flex;
         align-items: center;
         font-size:36rpx;
         font-weight: 700;
         margin: 32rpx 0 32rpx 38rpx  ;
         .colorBox{
          width: 6rpx;
          height: 48rpx;
          margin-right: 20rpx;
         }
        }
        // .dec{
        //     margin-left:38rpx ;
        // }
     }
   </style>
   