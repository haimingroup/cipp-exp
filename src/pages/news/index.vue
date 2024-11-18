<template>
	<view class="page">
		<!-- 顶部标题栏 -->
		<u-navbar :fixed="true" :bgColor="bgColor" >
			<view class="navTitle" slot="left">
				<text style="margin-left: 10rpx">新闻公告</text>
			</view>
		</u-navbar>
		<view class="header">
			<image style="width: 750rpx; height: 532rpx" :src="imgSrc" mode="aspectFill" />
		</view>
		<view class="content">
			<view class="title">
				<view class="colorBox"  :style="'background:'+ themeColors"> </view>
				<text>新闻公告</text>
			</view>
			<u-tabs :list="list" lineWidth="70rpx" lineHeight="6rpx" :lineColor="themeColors" keyName="cate_name"
				:activeStyle="activeStyle" :inactiveStyle="inactiveStyle" @click="clickTabs" />
			
				<view class="newsList">
					<newsBox v-for="item in newsList" :key="item.news_id" :item="item" />
				</view>
				<u-loadmore marginTop="30" :status="status" fontSize="32" />
			
		</view>
		<u-back-top :scroll-top="scrollTopu" bottom="250"></u-back-top>
		<!-- 底部导航栏 数据读取自pages.json tarbar -->
		<m-tabbar name="new" ref="tabbar" native :beforeChange="onBeforeChange">
			<template v-slot:tabbar_index_2>
				<view class="custom_style">
					<image class="btnImg" src="../../static/tarBar/center.png" mode=""></image>
					<text>{{ cneterTitle }}</text>
				</view>
			</template>                                                                                                                                                             
		</m-tabbar>
	</view>
</template>

<script>
	import newsBox from "../../components/newsbox.vue";
	import {
		newsGetCate,
		newsGetList,
		getExhibitNews
	} from "@/api/list.js";
	
	import config from "@/utils/config.js";

	export default {
		components: {
			newsBox
		},
		data() {
			return {
				themeColors: uni.getStorageSync('color'),
				cneterTitle: config.center,
				imgSrc: uni.getStorageSync("ceilingImg"),
				current_news_cate_id: "",
				status: "loadmore",
				topIconDistance: "",
				titleColor: "rgb(255,255,255)",
				//元素滚动值
				scrollTop: 0,
				scrollTopu:0,
				//顶部标题栏背景色
				bgColor: "rgba(0,0,0,0)",
				list: [],
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
		onReachBottom(){
			this.scrolltolower()
		},
		onPageScroll(event) {
			
			//顶部导航渐变 从无到有
			this.scrollTop = event.scrollTop; // 更新页面滚动高度
			this.scrollTopu = event.scrollTop //返回顶部数据更新
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
			newsGetCate({
				obj_id: config.obj_id
			}).then((res) => {
				this.list = res.data;
				this.list.unshift({
						news_cate_id: 0,
      					cate_name: "本展资讯",
						exhibit_id: uni.getStorageSync("exhibit_id"),
					}) 
				this.current_news_cate_id = this.list[0].news_cate_id;
				getExhibitNews({
							exhibit_id:uni.getStorageSync("exhibit_id"),
							page: this.newsPage,
						}).then((res)=>{
							this.newsList = res.data.data;
							if (res.data.data.length < 15) {
								this.status = "nomore";
							}
						})
			});
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			clickTabs(e) {
				this.current_news_cate_id = e.news_cate_id;
				this.status = "loadmore"
				if (this.newsPage !== 1) {
					this.newsPage = 1;
				}
				if(e.index == 0){
					getExhibitNews({
							exhibit_id:uni.getStorageSync("exhibit_id"),
							page: this.newsPage,
						}).then((res)=>{
							this.newsList = res.data.data;
							if (res.data.data.length < 15) {
								this.status = "nomore";
							}
						})
				}
				else{
					newsGetList({
						news_cate_id: e.news_cate_id,
						page: this.newsPage,
					}).then((res) => {
						this.newsList = res.data.data;
						if (res.data.data.length < 15) {
							this.status = "nomore";
						}
					});
				}
				
			},
			scrolltolower() {
				if (this.status == "nomore") {
					return;
				} else {
					this.newsPage++;
					if(this.current_news_cate_id == 0){
						getExhibitNews({
							exhibit_id:uni.getStorageSync("exhibit_id"),
							page: this.newsPage,
						}).then((res)=>{
							this.newsList = res.data.data;
							if (res.data.data.length < 15) {
								this.status = "nomore";
							}
						})
					}else{
						newsGetList({
							news_cate_id: this.current_news_cate_id,
							page: this.newsPage,
						}).then((res) => {
								res.data.data.map((item) => {
									this.newsList.push(item);
								});
								if (res.data.data.length < 15) {
									this.status = "nomore";
								}
							});
					}
					
				}
			},
				//点击底部自定义导航栏触发事件，
				onBeforeChange(next, index) {
				if (index == 2) {
					if (!uni.getStorageSync("token")) {
						uni.redirectTo({
							url: "/pages/login/index",
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
								if (res.code == 25){
									uni.navigateTo({
										url: "/pages_index/exhibitorTicket/index"
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
		},
	};
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
		display: flex;
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