<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" :bgColor="bgColor" @leftClick="back" placeholder>
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">订单详情</text>
      </view>
    </u-navbar>
    <view class="content">
      <u-swiper
              :list="info.goods_imgs"
              height="690"
              @change="change"
              :autoplay="false"
              indicatorStyle="right: 20px"
      >
             <view
                    slot="indicator"
                    class="indicator-num"
              >
                <text class="indicator-num__text">{{ currentNum + 1 }}/{{ info.goods_imgs.length }}</text>
            </view>
      </u-swiper>
      <view class="nameBox">
        <view class="title" :style='`color:`+themeColors'>
           订单名称
        </view>
        <view class="name">
          {{ info.goods_name }}
        </view>
        <view class="tagBox">
            <view class="tag" :style='`background:`+themeColors'>{{info.tags_name}}</view>
        </view>
      </view>
      <view class="merchant" @tap="navgator()">
        <u-avatar :src="info.store_one.logo" shape="square" size="128"></u-avatar>
        <view class="companyName">{{ info.store_one.company_name }}</view>
        <u-icon name="arrow-right"></u-icon>
      </view>
      <u-divider text="订单详情" textSize="20rpx"></u-divider>
      <view class="info"> 
          <view class="one">
            <view class="oneContent">{{ info.goods_dec }}</view>
          </view> 
      </view>
    </view>
    <view class="footer">
      <button class="shareBox" open-type="share">
        <u-icon name="share" size="48rpx"></u-icon>
        <text>分享</text>
      </button>
      <view class="collectBtn"
        @tap="collectSub"
       :style="info.collection ==null ?'background:'+ themeColors : 'background:#CCC'"
       >
        <text>{{ info.collection ==null ?'收藏展品':'已收藏' }}</text>
      </view>
      
    </view>
  </view>
</template>

<script>
import {getGoodInfo,goodsCollection} from "@/api/v2.js";

export default {
  data() {
    return {
      currentNum:0,
      themeColors: uni.getStorageSync('color'),
      imgSrc: uni.getStorageSync("ceilingImg"),
      bgColor: uni.getStorageSync('color'),
      info: {},
      clock:false,
    };
  },
  onLoad(option) {
    uni.showLoading({
      title: "加载中",
    });
    getGoodInfo({goods_id:option.id, exhibit_id:uni.getStorageSync('exhibit_id')}).then(res=>{
      this.info = res.data
      this.info.goods_imgs.unshift(this.info.goods_img)
      uni.hideLoading();
    })
  },
  onShareAppMessage(res) {
			if (res.from === "button") {
			// 来自页面内分享按钮
			console.log(res.target);
			}
			return {
			title: this.info.goods_name,
			path:
				"/pages_index/productinfo/index?exhibit_id=" +
				uni.getStorageSync("exhibit_id") +
				"&id=" +
				this.info.id +
				"&share=1",
			};
			
			
		},
		onShareTimeline() {
			(res) => {
			return {
        title: this.info.goods_name,
        path:
          "/pages_index/productinfo/index?exhibit_id=" +
          uni.getStorageSync("exhibit_id") +
          "&id=" +
          this.info.id +
          "&share=1",
          imageUrl: imageUrl,
        };
			};
		},
  methods: {
    getInfo(){
      getGoodInfo({
            goods_id:this.info.id,
            exhibit_id:uni.getStorageSync('exhibit_id')
          }).then(res=>{
            this.info = res.data
          })
          this.clock = false
    },
    collectSub(){
      if(this.clock){
        return
      }else{
        this.clock = true
        if(this.info.collection == null){
         goodsCollection({
          goods_id:this.info.id,
          exhibit_id:uni.getStorageSync('exhibit_id'),
          status:1
         }).then(()=>{
          uni.showToast({
            title: '收藏成功',
            icon: 'none',
          })
          this.getInfo()
         })
      }else{
        goodsCollection({
          goods_id:this.info.id,
          exhibit_id:uni.getStorageSync('exhibit_id'),
          status:0
         }).then(()=>{
          uni.showToast({
            title: '取消收藏',
            icon: 'none',
          })
         this.getInfo()
         })
      }
      }
    },
    
    navgator(){
      uni.navigateTo({
          url: '/pages_index/exhibitorInfo/index?store_id=' + this.info.store_id,
      })
    },
    clickTabs(e) {
      console.log(e);
    },
    change(e){
      this.currentNum = e.current
    },
    back() {
      uni.setStorageSync('current',1)
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 92vh;
  background: rgb(239, 239, 239);
  padding-bottom: 150rpx;
  padding-bottom: calc(150rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
}
.navTitle {
  display: flex;
  color: rgb(255, 255, 255);
  font-size: 36rpx;
  font-weight: 700;
  line-height: 36rpx;
  text-align: left;
}

.content {
  padding: 30rpx;
  padding:24rpx 32rpx;
}
.nameBox{
  padding:24rpx 32rpx;
  border-radius: 20rpx;
  background: #FFF;
  margin:32rpx 0 ;
  position: relative;
  .title{
    color: #ACD41D;
    font-size: 32rpx;
    margin-bottom: 32rpx;
    font-weight: 700;
  }
 
  .name{
    font-size: 28rpx;
  }
  .btn{
    padding: 6rpx 24rpx;
    background: #ACD41D;
    position: absolute;
    right: 32rpx;top: 58rpx;
    display: flex;
    justify-content: center;
    align-content: center;
    color: #FFF;
    border-radius: 80rpx;
  }
}
.tagBox{
  display: flex;
  margin-top: 10rpx;
  .tag{
    padding: 8rpx 10rpx;
    font-size: 20rpx;
    color: #FFF;
    border-radius: 10rpx;
  }
}
.merchant{
  position: relative;
  display: flex;
  align-items: center;
  padding:24rpx 32rpx;
  border-radius: 20rpx;
  background: #FFF;
 
  .companyName{
    font-size: 28rpx;
    margin-left: 32rpx;
    font-weight: 700;
    width: 400rpx;
    margin-right: 30rpx;
    
  }
}
.info{
  padding:40rpx 32rpx;
  border-radius: 20rpx;
  background: #FFF;
  
  .one{
    margin-bottom:40rpx; 
    font-size: 28rpx;
    .oneContent{
      margin-top:20rpx; 
    }
  }
 
}
.footer{
  background: #FFF;
  height: 100rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  
  .shareBox{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    outline: none !important;
		border: none;
		overflow: visible;
		background: #fff;
		margin: 0;
		padding: 0;
		line-height: 32rpx !important;
    text{
      font-size: 24rpx;
    }
  }
  .collectBtn{
    width: 478rpx;
    height: 62rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
    border-radius: 20rpx;
  }
}




.indicator {
        @include flex(row);
        justify-content: center;
    }

.indicator-num {
        padding: 2px 0;
        background-color: rgba(0, 0, 0, 0.35);
        border-radius: 100px;
        width: 35px;
        @include flex;
        justify-content: center;

        &__text {
             color: #FFFFFF;
             font-size: 12px;
         }
  }
  button::after {
    	border: none;
  	}
</style>
