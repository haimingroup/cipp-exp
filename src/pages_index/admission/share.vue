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
       <view class="content">
           <view class="list">
               
           </view>
       </view>
    </view>
   </template>
   
   <script>
   export default {
    data() {
    return {
         themeColors: uni.getStorageSync('color'),
         imgSrc: uni.getStorageSync("ceilingImg"),
    }
    },
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
       top: -40rpx;
     }
     .content{
       position: relative;
       top: -40rpx;
     }
   </style>
   