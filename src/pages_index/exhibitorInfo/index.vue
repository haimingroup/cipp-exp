<template>
	<view class="page">
		<!-- 顶部标题栏 -->
		<u-navbar :fixed="true" placeholder :bgColor="bgColor" @leftClick="back">
			<view class="navTitle" slot="left">
				<u-icon name="arrow-left" color="#FFF"></u-icon>
				<text style="margin-left: 10rpx">展商详情</text>
			</view>
		</u-navbar>
		<!-- <view class="header">
			<u-swiper
              :list="info.imgs"
              height="422"
              @change="change"
              :autoplay="false"
              indicatorStyle="right: 20px"
			>
					<view
							slot="indicator"
							class="indicator-num"
					>
						<text class="indicator-num__text">{{ currentNum + 1 }}/{{ info.imgs.length }}</text>
					</view>
			</u-swiper>
		</view> -->
		<view class="content">
			<view class="info">
				<view class="up">
					<u-avatar :src="info.logo" shape="square" size="170"></u-avatar>
					<view class="title">
						<view class="name">{{ info.company_name }}</view>
						<view class="type">展商类型:{{ info.tags_name }}</view>
					</view>
				</view>
				<view class="text">诚邀您莅临我司展台</view>
				<view class="number" :style="`background:`+ themeColors">{{ info.store_exhibit.booth_no }}</view>
			</view>
			<view class="briefIntroduction">
				<u-tabs :list="list" :scrollable="false" lineWidth="74rpx" lineHeight="6rpx" :lineColor="themeColors"
					:activeStyle="activeStyle" :inactiveStyle="inactiveStyle" @click="clickTabs" />
				<view class="companyProfile" v-if="showProfile">
					{{ info.dec }}
					<u-divider></u-divider>
				</view>

				<view class="newsList" v-if="!showProfile">
					<productBox v-for="item,index in productList" :key="index" :item="item" />
				</view>

			</view>
		</view>
		<view class="footer">
			<view class="shareBox" @tap="showPop = true">
				<u-icon name="share" size="48rpx"></u-icon>
				<text>分享</text>
			</view>
			<view class="collectBtn"
				@tap="collectSub"
				:style="info.collection ==null ?'background:'+ themeColors : 'background:#CCC'"
			>
				<text>{{ info.collection ==null ?'收藏店铺':'已收藏' }}</text>
			</view>
			<view class="collectBtn" :style="'background:'+ themeColors" @tap="toTickerInfo">
				<text>报名参观</text>
			</view>
    	</view>
		<view>
			<u-popup :show="showPop" safeAreaInsetBottom @close="close" @open="open">
				<view class="popTitle">分享至</view>
				<view class="sharePop">
					<button class='shareOpen' open-type="share">
						<view>
							<img src="../../pages_platform/static/wx.png" class="shareImg" alt="">
						</view>
						<view>微信好友</view>
					</button>
					<button class='shareOpen' @tap="checkShare">
						<view>
							<img src="../../pages_platform/static/friend.png" class="shareImg" alt="">
						</view>
						<view>生成海报</view>
					</button>
				</view>
			</u-popup>
		</view>
		<u-popup :show="showlp" :safeAreaInsetBottom="false" mode="center"  @close="showlp = false">
				<view class="lpBox">
					<defaultBox v-if="postInfo.bg_type === 1" ref='child'/>
					<cw v-else-if="postInfo.bg_type === 3" ref='child1'/>
					
				</view>
			</u-popup>
	</view>
</template>

<script>	
	import {
		getStoreInfo,
		getStoreGoods,
		storeCollection,
		getStorePost
	} from "@/api/v2.js";
	import {
		getMyTicket
	} from "@/api/register";
	import productBox from "../../components/productBox.vue";
	import defaultBox from "../lpainter/default.vue";
	import cw from "../lpainter/cw2.vue";
	import config from "@/utils/config"
	export default {
		components: {
			productBox,defaultBox,cw
		},
		data() {
			return {
				themeColors: uni.getStorageSync('color'),
				imgSrc: uni.getStorageSync("ceilingImg"),
				bgColor: uni.getStorageSync('color'),
				showProfile: true,
				showPop:false,
				showlp:false,
				list: [{
					name: '简介'
				}, {
					name: '产品'
				}],
				productList: [],
				activeStyle: {
					color: uni.getStorageSync('color'),
					fontSize: "32rpx",
					lineHeight: "46rpx",
				},
				inactiveStyle: {
					color: uni.getStorageSync('color'),
					fontSize: "32rpx",
					lineHeight: "46rpx",
				},
				currentNum:0,
				postInfo:{},
				info: {},
				lock:false,
				picture: '',
				picture2: '',
			};
		},
		
		onLoad(option) {
			if(option.scene){
				//展商店铺规则："s,exhibit_id,store_id,team_id", 例子："s,4,2,53"
				const scene = decodeURIComponent(option.scene)
				let arr = scene.split(',')
				if(arr[0]=='s'){
					uni.setStorageSync('exhibit_id',arr[1])
					uni.setStorageSync('store_id',arr[2])
					uni.setStorageSync('team_id',arr[3])
					uni.setStorageSync('toexinfo',1)
				}
			}
			uni.showLoading({
				title: "加载中",
			});
			getStoreInfo({
				exhibit_id: uni.getStorageSync('exhibit_id'),
				store_id: option.store_id ||  uni.getStorageSync('store_id')
			}).then((res) => {
				this.info = res.data
				getStoreGoods({
					exhibit_id: uni.getStorageSync('exhibit_id'),
					store_id: this.info.id,
					page:1,
				}).then((res) => {
					this.productList = res.data.data
					uni.hideLoading();
				});
				getStorePost({exhibit_id: uni.getStorageSync('exhibit_id'),
						store_id: this.info.id,
						type:1,
						code:config.project,
						page:'pages_index/exhibitorInfo/index'
				}).then((res)=>{
					this.postInfo = res.data
					let num = this.postInfo.store_one.name.length
					if(num > 13){
						this.fontSize = 16.6
						let dValue = num - 13
						if( dValue > 7){
							this.fontSize = 25.6
							this.postInfo.store_one.name = this.postInfo.store_one.name.substr(0,12)+'...'
						}
					}
				
					if(this.postInfo.bg_type === 1){
						this.$nextTick(()=>{
							this.$refs.child.postInfo  = this.postInfo
						})
					}else if(this.postInfo.bg_type === 3){
						this.$nextTick(()=>{
							this.$refs.child1.postInfo  = this.postInfo
						})
					}
				})
			})
			
		},
		onShareAppMessage(res) {
			console.log(res)
			if (res.from === "button") {
			// 来自页面内分享按钮
			console.log(res.target);
			}
			return {
			title: "报名参观!",
			path:`/pages_index/exhibitorInfo/index?scene=s,${uni.getStorageSync("exhibit_id")},${this.postInfo.store_id},+${this.postInfo.enroll_team_id}`,
			};

		},
		onShareTimeline() {
			(res) => {
			return {
				title: "报名参观!",
				path:`/pages_index/exhibitorInfo/index?scene=s,${uni.getStorageSync("exhibit_id")},${this.postInfo.store_id},+${this.postInfo.enroll_team_id}`,
				imageUrl: imageUrl,
			};
			};
		},
		methods: {
			change(e){
				this.currentNum = e.current
			},
			getInfo(){
				getStoreInfo({
					exhibit_id:uni.getStorageSync('exhibit_id'),
					store_id:this.info.id
				}).then(res=>{
					this.info = res.data
				})
				this.lock = false
			},
			toTickerInfo(){
				getMyTicket({
					exhibit_id: uni.getStorageSync("exhibit_id"),
				}).then((res) => {
					if (res.code == 1) {
						uni.setStorageSync("tickerInfo", JSON.stringify(res.data));
						uni.switchTab({
							url: "/pages/center/index",
						});
					}
					if(res.code == 23){
						uni.setStorageSync('webviewUrl', res.data.url)
						uni.navigateTo({
							url: "/pages_index/webview/index"
						})
					}
					if(res.code == 24){
						uni.navigateTo({
							url: "/pages_index/pay/index"
						})
					}
					
				});
			},
			collectSub(){
				if(this.lock){
					return
				}else{
					this.lock = true
					if(this.info.collection == null){
					storeCollection({
						store_id:this.info.id,
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
					storeCollection({
						store_id:this.info.id,
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
			clickTabs(e) {
				if (e.index == 0) {
					this.showProfile = true
				} else if (e.index == 1) {
					this.showProfile = false
				}
			},
			checkShare(){
				this.close()
				this.showlp = true
				console.log()
			},
			open() {
			},
			close() {
			this.showPop = false
			// console.log('close');
			},
			back() {
				uni.setStorageSync('current',0)
				uni.navigateBack(
					{
						fail:()=>{
							uni.switchTab('/pages/exhibitor/index')
						}
					}
				);
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
		height: 422rpx;
		background-color: #999999;
	}

	.content {
		padding: 30rpx;
		position: relative;
	}

	.info {

		padding: 32rpx;
		border-radius: 20rpx;
		background: #FFF;

		.up {
			display: flex;
			align-items: center;

			.title {
				margin-left: 56rpx;

				.name {
					margin-bottom: 42rpx;
					font-size: 28rpx;
					font-weight: 700;
				}

				.type {
					color: rgba(0, 0, 0, 0.6);
					font-size: 24rpx;
				}
			}
		}

		.text {
			text-align: center;
			font-size: 28rpx;
			margin: 40rpx 0 24rpx 0;
		}

		.number {
			width: 550rpx;
			height: 70rpx;
			color: #FFF;
			font-size: 28rpx;
			line-height: 70rpx;
			text-align: center;
			font-size: 700;
			margin: 0 auto;
			border-radius: 10rpx;
		}

	}

	.briefIntroduction {
		padding: 32rpx;
		border-radius: 20rpx;
		background: #FFF;
		margin-top: 32rpx;

		.companyProfile {
			font-size: 28rpx;
			color: #333333;
			line-height: 40rpx;
			margin-top: 32rpx;
		}

		.newsList {
			margin-top: 32rpx;
			background: #fff;
			border-radius: 20rpx;
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
			text{
			font-size: 24rpx;
			}
		}
		.collectBtn{
			width: 220rpx;
			height: 62rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #FFF;
			border-radius: 20rpx;
		}
	}
	.popTitle{
		margin: 48rpx;
		font-weight: 600;
	}
	.sharePop{
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		padding-bottom: 30rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
		.shareImg{
			width:112rpx ;
			height: 112rpx;
			margin-bottom: 24rpx;

		}
	}
	.shareOpen{
		outline: none !important;
		border: none;
		overflow: visible;
		background: #fff;
		margin: 0;
		padding: 0;
		line-height: 32rpx !important;
	}

	button::after {
    	border: none;
  	}
</style>