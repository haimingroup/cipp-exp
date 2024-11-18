<template>
	<view class="page">
		<!-- 顶部标题栏 -->
		<u-navbar :fixed="true" placeholder :bgColor="themeColors" @leftClick="back">
			<view class="navTitle" slot="left">
			<u-icon name="arrow-left" color="#FFF"></u-icon>
			<text style="margin-left: 10rpx">楣板审核</text>
			</view>
		</u-navbar>
	  	<view class="content">
			<view class="mbBox" v-for="item,index in list" :key="index" @tap="click(item)">
				<view class="name">
					{{ item.store_one.company_name}}
				</view>
				<view class="chinese">
					中文楣板:{{ item.lintel_cn}}
				</view>
				<view v-if="item.lintel_en" class="english">
					英文楣板:{{ item.lintel_en }}
				</view>
				<view class="status">
					<text v-if="item.lintel_status ==0">默认</text>
					<text v-else-if="item.lintel_status ==1" style="color:#E9B85A">待确认</text>
					<text v-else-if="item.lintel_status ==2" style="color:#07C160">已确认</text>
				</view>
			</view>
		</view>
		<u-popup :show="showPop" @close="showPop = false" @open="open">
           <view class="popBox">
				<view class="name">
					{{ info.store_one.company_name}}
				</view>
				<view class="chinese">
					<text style="margin-right: 32rpx;">中文楣板</text>
					<u--input placeholder="请输入内容" border="bottom" v-model="info.lintel_cn"></u--input>
				</view>
				<view  class="english">
					<text style="margin-right: 32rpx;">英文楣板</text>
					<u--input placeholder="请输入内容" border="bottom" v-model="info.lintel_en"></u--input>
				</view>
				<view class="confirmBtn" :style="'background:'+ themeColors"  @tap="confirm">
					确认
				</view>
		   </view>
		</u-popup>
	</view>
	
  </template>
  
  <script>
  import {getLintelList,verifyLintel} from "@/api/host.js";
  export default {
	  data() {
		  return {
			  themeColors: uni.getStorageSync('color'),
			  page:1,
			  list:[],
			  info:{},
			  showPop:false,
		  }
	  },
	  onReachBottom(){
		this.page++;
		uni.showLoading({
				title: '加载中',
				mask: true
			})
		getLintelList({
			exhibit_id: uni.getStorageSync('exhibit_id'),
			page:this.page
		}).then((res)=>{
			res.data.data.map((item) => {
				this.list.push(item)
			})
			uni.hideLoading();
		})
	  },
	  onLoad(){
		this.getlist()
	  },
	  methods:{
		confirm(){
			verifyLintel({
				id:this.info.id,
				lintel_cn:this.info.lintel_cn,
				lintel_en:this.info.lintel_en
			}).then((res)=>{
				if(res.code == 1){
					this.showPop = false
					this.getlist()
				}else{
					uni.showToast({
						title: res.msg,
						icon: 'none',
						mask: true
					})
				}
			})
		},
		getlist(){
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			getLintelList({
				exhibit_id: uni.getStorageSync('exhibit_id'),
				page:this.page
			}).then((res)=>{
				this.list = res.data.data;
				uni.hideLoading();
			})
		},
		click(item){
			this.showPop = true;
			const {lintel_cn,lintel_en,id,store_one} = item
			this.info = {lintel_cn:lintel_cn,lintel_en:lintel_en,id:id,store_one:store_one}
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
        padding: 52rpx 32rpx;
        .mbBox{
            padding:28rpx 24rpx ;
            background: #FFF;
            border-radius: 20rpx;
            margin-bottom: 24rpx;
            font-size: 28rpx;
			position: relative;
			.name{
				margin-bottom: 16rpx;
			}
			.chinese,.english{
				color: #666666;
				margin-bottom: 16rpx;
			}
			.status{
				position: absolute;
				top: 24rpx;
				right: 32rpx;
				font-size: 24rpx;
			}
        }
    }
	.popBox{
			min-height: 526rpx;
			font-size: 28rpx;
			display: flex;
			flex-direction: column;
			font-size: 28rpx;
			padding: 0 32rpx 75rpx;
			.name{
				margin: 56rpx auto;
			}
			.chinese,.english{
				margin-bottom: 32rpx;
				display: flex;
				align-items: center;
			}
			
			.confirmBtn{
				margin: 0 auto;
				color: #fff;
                padding: 10rpx 40rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 20rpx;
				margin-top: 56rpx;
			}
		}
  </style>