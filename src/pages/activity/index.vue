<template>
	<view class="page">
		<u-navbar :fixed="true"  :bgColor="bgColor">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 活动列表 </view>
		</u-navbar>
		<view class="header">
			<image style="width: 750rpx; height: 532rpx; display: flex" :src="imgSrc" mode="aspectFill" />
		</view>
		<view class="content">
			<view class="title">
				<view class="colorBox" :style="'background:'+ themeColors" />
				<text>活动列表</text>
			</view>
			<view class="activityList">
				<activityBox v-for="item in list" :key="item.activity_id" :item="item"></activityBox>
				<u-loadmore marginTop="30" :status="status" fontSize="32" />
			</view>
			<u-back-top :scroll-top="scrollTop" bottom="250"></u-back-top>
		</view>
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
	import activityBox from "../../components/activityBox.vue";
	import {
		activeList
	} from "@/api/list.js";
	import {
		getMyTicket
	} from "@/api/register";
	import config from "@/utils/config.js";
	export default {
		components: {
			activityBox,
		},
		data() {
			return {
				themeColors: uni.getStorageSync('color'),
				cneterTitle: config.center,
				imgSrc: uni.getStorageSync("ceilingImg"),
				status: "loadmore",
				topIconDistance: "",
				titleColor: "rgb(255,255,255)",
				//元素滚动值
				scrollTop: 0,
				//顶部标题栏背景色
				bgColor: "rgba(0,0,0,0)",
				page: 1,
				list: [],
				lock: false,
			};
		},
		onShow() {
			this.$nextTick(() => {
				this.$refs.tabbar.reload();
			});
		},
		onReachBottom() {
			this.scrolltolower()
		},
		onPageScroll(event) {
			//顶部导航渐变 从无到有
			this.scrollTop = event.scrollTop; // 更新页面滚动高度
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
		onLoad() {
			activeList({
				exhibit_id: uni.getStorageSync("exhibit_id"),
				page: this.page,
			}).then((res) => {
				this.list = res.data.data;
				if (res.data.data.length < 15) {
					this.status = "nomore";
				}
			});
		},
		methods: {
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
			scrolltolower() {
				if (this.status == "nomore") {
					return;
				} else {
					this.page++;
					activeList({
						exhibit_id: uni.getStorageSync("exhibit_id"),
						page: this.page,
					}).then((res) => {
						res.data.data.map((item) => {
							this.list.push(item);
						});
						if (res.data.data.length < 15) {
							this.status = "nomore";
						}
					});
				}
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
		padding-bottom: calc(60rpx + env(safe-area-inset-bottom));
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

		.activityList {
			margin-top: 30rpx;
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