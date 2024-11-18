<template>
    <view class="page">
      <!-- 顶部标题栏 -->
      <u-navbar :fixed="true" bgColor="#FFFFFF00" @leftClick="back">
        <view class="navTitle" slot="left">
          <u-icon name="arrow-left" color="#FFF"></u-icon>
          <text style="margin-left: 10rpx">积分打卡</text>
        </view>
      </u-navbar>
      <view class="header">
        <image
          style="width: 750rpx; height: 532rpx"
          :src="imgSrc"
          mode="scaleToFill"
        />
      </view>
      <view class="content">
            <view class="info">
                <view class="title">{{ info.title }}</view>
                <view class="num">
                  <text style="font-size:72rpx;margin-right: 16rpx;">{{ info.score }}</text>
                  <text style="font-size: 32rpx;">积分</text>
                </view>
                <view class="creatTime">当前积分过期时间：{{info.expire_time}}</view>
            </view>
            <view class="dec">{{ info.dec }}</view>
            <view class="footerBtn" :style="`background:`+ themeColors" @tap="punch">
                确认打卡
            </view>
      </view>
      
    </view>
  </template>
  
  <script>
  import {getScoreCodeDetail,consumptionScoreCode} from '@/api/v2'
  export default {
    data() {
      return {
        themeColors: uni.getStorageSync('color'),
        imgSrc: uni.getStorageSync("ceilingImg"),
        info:{}
      };
    },
    onLoad(option) {
      uni.showLoading({
				title: "加载中",
			});
        getScoreCodeDetail({exhibit_id:uni.getStorageSync('exhibit_id'),score_id:uni.getStorageSync('score_id')}).then((res)=>{
          this.info = res.data
          uni.hideLoading();
        })
    },
    
    methods: {
      punch(){
        consumptionScoreCode({score_id:this.info.id}).then((res)=>{
          uni.showToast({
            title: res.msg,
            icon: 'none',
            mask: true
          })
          if(res.code !==0){
          setTimeout(()=>{
            this.back()
          },2000)
          }
        })
      },
      back() {
         uni.switchTab({ url: '/pages/index/index' })
      },
    },
  };
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
    font-weight: 700;
    line-height: 36rpx;
    text-align: left;
  }
  .header {
    width: 750rpx;
    height: 532rpx;
    background-color: #999999;
  }
  .content {
    padding: 0 30rpx;
    .info{
      margin: 40rpx 0 36rpx;
      border-radius: 20rpx;
      background: #FFF;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 32rpx 0;
      .title{
        font-weight: 600;
        font-size: 32rpx;
        margin-bottom: 24rpx;
      }
      .num{
        font-weight: 600;
        display: flex;
        align-items: center;
        margin-bottom: 30rpx;
      }
      .creatTime{
        color:rgba(0, 0, 0, 0.4);
        font-size: 24rpx;
      }
      
    }
    .dec{
        margin-top: 56rpx;
        font-size: 20rpx;
        line-height: 36rpx;
      }
      .footerBtn{
        margin: 168rpx auto 0;
       border-radius: 20rpx;
        width: 480rpx;
        height: 60rpx;
        color: #FFF;
        display: flex;
        align-items: center;
        justify-content: center;
      }
  }
  </style>
  