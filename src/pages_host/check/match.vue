<template>
	<view class="page">
	  <!-- 顶部标题栏 -->
	  <u-navbar :fixed="true" :bgColor="themeColors" placeholder @leftClick="back">
		<view class="navTitle" slot="left">
		  <u-icon name="arrow-left" color="#FFF"></u-icon>
		  <text style="margin-left: 10rpx">参赛信息</text>
		</view>
	  </u-navbar>
	  <view class="content">
        <view class="box" v-for="item,index in goodList" :key="index">
            <view class="boxTitle">{{item.goods_one.goods_name}}</view>
            <view class="boxContent">
                <view class="logo">
                    <image
                    class="logo"
                    :src="item.goods_one.goods_img"
                    mode="scaleToFill"
                />
                </view>
                <view class="intro">{{item.goods_one.goods_dec}}</view>
                <view class="status" v-if="item.status !== 0">
                    <text v-if="item.status ==2" style="color:#E9B85A">拒绝</text>
                    <text v-else-if="item.status ==1" style="color:#07C160">已确认</text>
                </view>
            </view>
            <view class="boxFooter" v-if="item.status == 0">
                <view class="btn" style="background-color: #FA5151;margin-right: 24rpx;" @tap="opGood(2,item.id)">拒绝</view>
                <view class="btn" style="background-color: #07C160" @tap="opGood(1,item.id)">提交参赛</view>
            </view>
        </view>
        <view v-if="goodList.length == 0" style="margin:20rpx auto;color: #7d7d7d;text-align: center;">
            暂无审核数据
        </view>
	  </view>
	</view>
  </template>
  
  <script>
  import{getVerifyStoreContestGoods,VerifyStoreContestGood} from '@/api/host'
  export default {
	  data() {
		  return {
			  themeColors: uni.getStorageSync('color'),
			  goodList:[],
              page:1,
		  }
	  },
      onReachBottom(){
        uni.showLoading({
            title: '加载中',
            mask: true
        })
        this.page++
        getVerifyStoreContestGoods({ exhibit_id: uni.getStorageSync('exhibit_id'),page:this.page,}).then((res)=>{
            res.data.data.map((item) => {
				this.list.push(item)
			})
            uni.hideLoading();
        })
    },
	  onLoad(){
        uni.showLoading({
            title: '加载中',
            mask: true
        })
        getVerifyStoreContestGoods({ exhibit_id: uni.getStorageSync('exhibit_id'),page:this.page,}).then((res)=>{
            this.goodList = res.data.data
            uni.hideLoading();
        })
	  },
	  methods:{
			navigator(url) {
				uni.navigateTo({
					url: url,
				});
			},
            getlist(){
                uni.showLoading({
                    title: '加载中',
                    mask: true
                })
                getVerifyStoreContestGoods({ exhibit_id: uni.getStorageSync('exhibit_id'),page:this.page,}).then((res)=>{
                    this.goodList = res.data.data
                    uni.hideLoading();
                })
            },
            opGood(type,id){
                VerifyStoreContestGood({id:id,status:type,exhibit_id:uni.getStorageSync('exhibit_id')}).then((res)=>{
                    uni.showToast({
                        title: res.msg,
                        icon: 'none',
                        mask: true
                    })
                    this.getlist()
                })
            },
		    back() {
				  uni.navigateBack();
			  },
	  }
  }
  </script>
  
  <style lang="scss" scoped>
	  .page {
		  min-height: 90vh;
		  background: rgb(239, 239, 239);
		  padding-bottom: 0;
		  padding-bottom: constant(safe-area-inset-bottom);
		  padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
	  }
	  .navTitle {
		display: flex;
		align-items: center;
		color: rgb(255, 255, 255);
		font-size: 36rpx;
		font-weight: 700;
		line-height: 36rpx;
		text-align: left;
	}
	.content{
		padding:48rpx 30rpx;
		
	}
    .box{
        background: #FFF;
        border-radius: 20rpx;
        padding:20rpx 32rpx;
        margin-bottom: 20rpx;
        position: relative;
        .status{
                position: absolute;
                font-size: 24rpx;
                top: 24rpx;
                right: 32rpx;
            }
        .boxTitle{
            font-size: 28rpx;
            line-height: 40rpx;
            margin-bottom: 16rpx;
        }
        .boxContent{
            display: flex;
            align-items: center;
           
            .logo{
                width: 168rpx !important;
                height: 168rpx;
                border-radius: 20rpx;
            }
          
           
            .intro{
                font-size: 24rpx;
                margin-left: 48rpx;
            }
        }
        .boxFooter{
            margin-top: 20rpx;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .btn{
                color: #FFF;
                padding: 10rpx 0;
                width: 138rpx;
                text-align: center;
                border-radius: 10rpx;
                font-size: 24rpx;
                
            }
        }
    }
  </style>