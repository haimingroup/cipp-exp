<template>
	<view class="page">
		<!-- 顶部标题栏 -->
		<u-navbar :fixed="true" :bgColor="bgColor">
			<view class="navTitle" slot="left" :style="'color:' + titleColor">
				企业中心
			</view>
		</u-navbar>
		<view class="header">
			<image style="width: 750rpx; height: 532rpx" :src="imgSrc" mode="aspectFill" />
		</view>
		<view class="content">
			<u-tabs 
				ref="tabs"
				:list="list" 
				:scrollable="false" 
				lineWidth="70rpx"
				lineHeight="6rpx"
				:lineColor="themeColors" 
				:activeStyle="activeStyle" 
				:inactiveStyle="inactiveStyle"
				@click="clickTabs" 
				:current="currentNum"
				
			/>
			<view class="search" @tap="toSearch">
				<view class="searchInp"><u-icon name="search"></u-icon><text>输入展品名称/公司名称</text></view>
				<view class="searchBtn" :style="'background:'+themeColors" >搜索</view>
			</view>
			<view class="newsList" v-if="currentNum == 0">
				<exhibitBox  v-for="item,index in newsList" :key="index" :item="item" />
			</view>
			<view class="newsList"  v-if="currentNum == 1">
				<productBox  v-for="item,index in newsList" :key="index" :item="item" />
			</view>
			<u-loadmore marginTop="30" :status="status" fontSize="32" />
		</view>
			<u-back-top :scroll-top="scrollTopu" bottom="250"></u-back-top>
		<m-tabbar name="new" ref="tabbar" native :beforeChange="onBeforeChange">
			<template v-slot:tabbar_index_2>
				<view class="custom_style">
					<image class="btnImg" src="../../static/tarBar/center.png" mode=""></image>
					<text>{{cneterTitle}}</text>
				</view>
			</template>
		</m-tabbar>
	</view>
</template>

<script>
	import exhibitBox from "../../components/exhibitorBox.vue";
	import productBox from "../../components/productBox.vue";
	import {
		getMyTicket
	} from "@/api/register";
	import config from "@/utils/config.js";
	import {
		getStoreList,
		getGoodList
	} from '@/api/v2.js'
	export default {
		components: {
			exhibitBox,productBox
		},
		data() {
			return {
				themeColors: uni.getStorageSync('color'),
				cneterTitle: config.center,
				imgSrc: uni.getStorageSync("ceilingImg"),
				currentNum: 0,
				keyword: '',
				status: "loadmore",
				titleColor: "rgb(255,255,255)",
				//元素滚动值
				scrollTop: 0,
				scrollTopu:0,
				pid: uni.getStorageSync("pid"),
				//顶部标题栏背景色
				bgColor: "rgba(0,0,0,0)",
				list: [{
					name: '企业名录'
				}, {
					name: '采购订单'
				}],
				newsList: [],
				newsPage: 1,
				lock: false,
				inactiveStyle: {
					color: "rgb(185, 185, 185)",
					fontSize: "32rpx",
					lineHeight: "46rpx",
					paddingRight: "10rpx",
				},
				activeStyle: {
					color: uni.getStorageSync('color'),
					fontSize: "32rpx",
					lineHeight: "46rpx",
					paddingRight: "10rpx",
				},
			};
		},
		onShow() {
			this.newsList=[]
			let num = uni.getStorageSync('current') 
			//判断是否存在默认tabs值 如果不存在请求展商，如果存在请求默认
			if (num != undefined) {
				this.currentNum = Number(num)
				this.keyword = uni.getStorageSync('keyword')
				if (this.currentNum == 0) {
					getStoreList({
						exhibit_id:uni.getStorageSync('exhibit_id'),
						page:1,
						search: this.keyword
					}).then((res)=>{
						this.newsList = res.data.data
						if (res.data.data.length < 15) {
					 		this.status = "nomore";
						}
					})
					
				} else if (this.currentNum == 1) {
					getGoodList({
						exhibit_id:uni.getStorageSync('exhibit_id'),
						page:1,
						search: this.keyword
					}).then((res) => {
						this.newsList = res.data.data
						if (res.data.data.length < 15) {
					 		this.status = "nomore";
						}
					})
				}
			} else {
				this.currentNum = 0
				getStoreList({
						exhibit_id:uni.getStorageSync('exhibit_id'),
						page:1,
						search: this.keyword
					}).then((res)=>{
						this.newsList = res.data.data
						if (res.data.data.length < 15) {
					 		this.status = "nomore";
						}
					})
			}

			this.$nextTick(() => {
				this.$refs.tabbar.reload();
			});
		},
		onPageScroll(event) {
			//顶部导航渐变 从无到有
			this.scrollTop = event.scrollTop; // 更新页面滚动高度
			this.scrollTopu =event.scrollTop;
			if (this.scrollTop * 0.0082 > 1) {
				this.scrollTop = 1 / 0.0082;
			}
			if (this.scrollTop * 0.0082 > 0.3) {
				this.titleColor = "rgb(0,0,0)";
			} else {
				this.titleColor = "rgb(255,255,255)";
			}
			this.bgColor = "rgba(255,255,255," + this.scrollTop * 0.0082 + ")";
		},
		onHide() {
			uni.removeStorageSync('current')
			uni.removeStorageSync('keyword')
			this.status = "loadmore"
		},
		onReachBottom(){
			this.scrolltolower()
		},
		methods: {
			toSearch() {
				uni.removeStorageSync('current')
				uni.removeStorageSync('keyword')
				uni.navigateTo({
					url: '/pages_index/search/index'
				})
			},
			onBeforeChange(next, index) {
				//点击底部自定义导航栏触发事件，
				if (index == 2) {
					if (!uni.getStorageSync("token")) {
						uni.redirectTo({
							url: "/pages/login/index"
						});
						return;
					}
					if (this.lock) {
						return;
					} else {
						this.lock = true;
						if(uni.getStorageSync("exhibit_id") ==4){
							uni.setStorageSync('webviewUrl', 'https://c.zzhaiming.com/web-reg-server/mobile/vistor-register-m.html?EID=E0000000528&target=1&orgnum=1250&pid=1393&version=1&cid=4326&ctid=86')
							uni.navigateTo({
								url: "/pages_index/webview/index"
							})
							this.lock = false;
						}else{
							getMyTicket({
								exhibit_id: uni.getStorageSync("exhibit_id"),
							}).then((res) => {
								if (res.code == -1) {
									this.lock = false;
									return;
								}
								if (res.code == 1) {
									uni.setStorageSync("tickerInfo", JSON.stringify(res.data));
									this.lock = false;
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
								this.lock = false;
							});
						}
					}
				} else {
					next();
				}
			},
			clickTabs(e) {
				this.currentNum =e.index
				this.status = "loadmore";
				if (this.newsPage !== 1) {
					this.newsPage = 1;
				}
				if (e.index == 0) {
					this.newsList = []
					getStoreList({
						exhibit_id:uni.getStorageSync('exhibit_id'),
						page:1,
						search: this.keyword
					}).then((res)=>{
						this.newsList = res.data.data
						if (res.data.data.length < 15) {
					 		this.status = "nomore";
						}
					})
				} else if (e.index == 1) {
					this.newsList = []
					getGoodList({
						exhibit_id:uni.getStorageSync('exhibit_id'),
						page:1,
						search: this.keyword
					}).then((res) => {
						this.newsList = res.data.data
						if (res.data.data.length < 15) {
							this.status = "nomore";
						}
					})
					
				}
			},
			scrolltolower() {
				if (this.status == "nomore") {
					return;
				} else {
					this.newsPage++;
					//此处判断是否存在关键字搜索
					let obj = {}
					if (this.keyword == '') {
						 obj = {
							exhibit_id:uni.getStorageSync('exhibit_id'),
							page:this.newsPage,
						}
					}else{
						 obj = {
							exhibit_id:uni.getStorageSync('exhibit_id'),
							page:this.newsPage,
							search:this.keyword
						}
					}
						if (this.currentNum == 0) {
							getStoreList(obj).then((res)=>{
						
								res.data.data.map((item) => {
									this.newsList.push(item)
								})
								if (res.data.data.length < 15) {
									this.status = "nomore";
								}
							})
						} else if (this.currentNum == 1) {
							getGoodList(obj).then((res) => {
								res.data.data.map((item) => {
									this.newsList.push(item)
								})
								if (res.data.data.length < 15) {
									this.status = "nomore";
								}
							})
						}
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 92vh;
		background: rgb(239, 239, 239);
		padding-bottom: 0px;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: calc(60px + env(safe-area-inset-bottom));
	}

	.navTitle {
		color: rgb(255, 255, 255);
		font-size: 36rpx;
		font-weight: 700;
		line-height: 36rpx;
		text-align: left;
	}

	.header {
		width: 750rpx;
		display: flex;
		height: 532rpx;
		background-color: #999999;
	}

	.content {
		padding: 30rpx;

		.title {
			display: flex;
			align-items: center;
			color: rgb(3, 3, 3);
			font-size: 40rpx;
			font-weight: 500;
			line-height: 58rpx;
			letter-spacing: 0px;
			margin-bottom: 30rpx;

			.colorBox {
				width: 12rpx;
				height: 40rpx;
				margin-right: 20rpx;
			}
		}

		.search {
			margin: 20rpx 0 0 0;
			height: 56rpx;
			display: flex;
			align-items: center;

			.searchInp {
				padding-left: 20rpx;
				display: flex;
				align-items: center;
				color: rgba(0, 0, 0, 0.6);
				height: 56rpx;
				width: 550rpx;
				background: #fff;
				border-radius: 10rpx;
				border: 1px solid rgb(191, 195, 204);
				margin-right: 20rpx;

				text {
					margin-left: 20rpx;
					font-size: 24rpx;
				}
			}

			.searchBtn {
				display: flex;
				align-items: center;
				height: 48rpx;
				color: #fff;
				border-radius: 10rpx;
				padding: 8rpx 20rpx;
				font-size: 28rpx;
			}
		}

		.newsList {
			margin-top: 40rpx;
			background: #fff;
			border-radius: 20rpx;
		}
	}

	//中间按钮
	.custom_style {
		margin-top: -92rpx;
		font-size: 24rpx;
		text-align: center;
		color: #999999;

		.btnImg {
			border: 14rpx solid #fff;
			border-radius: 50%;
			width: 112rpx;
			height: 112rpx;
		}
	}
</style>