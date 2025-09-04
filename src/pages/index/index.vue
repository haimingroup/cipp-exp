<template>
	<!-- 进入弹出层 -->
	<view class="pages">
		<u-popup :show="showLocation" :closeOnClickOverlay="false" round="10" mode="center" @close="close" @open="open">
			<view class="popBox">
				<u-avatar size="220" :src="require('@/static/tarBar/center.png')"></u-avatar>
				<text class="popText1">当前选择的展会</text>
				<view class="local">
					<text>{{ nowExhibits.name }}</text>
				</view>
				<view class="in" :style="'background:#004098'" @tap="inIndex"> 点击进入 </view>
				<view class="change" @tap="redirectTo('/pages_index/changeCity/index')">
					切换展会
				</view>
			</view>
		</u-popup>

		<!-- 顶部标题栏 -->
		<u-navbar :fixed="true" :bgColor="bgColor">
			<view class="u-nav-slot" slot="left" />
			<view class="navTitle" slot="center" :style="'color:' + titleColor">
				{{ title }}
			</view>
		</u-navbar>
		<!-- 顶部搜索加banner -->
		<view class="header">
			<u-swiper height="860rpx" imgMode="scaleToFill" keyName="img" :list="homeList.slider"
				@click="clickswiper"></u-swiper>
			<view class="search">
				<!-- 搜索 -->
				<view class="left" @tap="redirectTo('/pages_index/changeCity/index')">
					<text>切换展会</text>
					<u-icon name="arrow-down" size="20rpx" color="#FFF"></u-icon>
				</view>
				<view class="right">
					<u-notice-bar bgColor="rgba(0, 0, 0, 0.3);" color="#FFF" fontSize="12px"
						:text="homeList.exhibit.notice"></u-notice-bar>
				</view>
			</view>
		</view>
		<!-- 中心按钮 金刚区 -->
		<view class="content">
			<view class="signUp">
				<view class="left" @tap="navigator('/pages_index/mine/contact/index')">
					<image class="icon" :src="homeList.adv.nav[0].img" mode=""></image>
					<text class="title">参展报名</text>
					<text class="info">展商填报提交资料</text>
				</view>
				<u-line color="rgba(153, 153, 153, 0.5)" length="136px" direction="col" />
				<view class="left" @tap="toTickerInfo">
					<image class="icon" :src="homeList.adv.nav[1].img" mode=""></image>
					<text class="title">参观门票</text>
					<text class="info">观众参观门票领取</text>
				</view>
			</view>
			<view class="box" style="padding: 30rpx">
				<u-grid :col="4">
					<u-grid-item v-for="(item, index) in homeList.pageList" :key="index" @tap="clickGrid(item)">
						<image style="width: 80rpx; height: 80rpx" :src="item.page_icon"></image>
						<view class="grid-text">{{ item.page_title }}</view>
					</u-grid-item>
				</u-grid>
			</view>

			<view class="box"  style="margin-top: 30rpx; height: 228rpx" @tap="toWeb(homeList.adv.adv.url)">
				<image style="width: 100%; height: 228rpx" :src="homeList.adv.adv.img" mode="scaleToFill" />
			</view>
			<!-- <view class="box" style="margin-top: 30rpx; height: 228rpx" @tap="toOther()">
				<image style="width: 100%; height: 228rpx" src="@/static/hotel.jpg" mode="scaleToFill" />
			</view> -->
			<view class="box" style="margin-top: 30rpx; height: 288rpx">
				<image style="width: 690rpx; height: 288rpx" :src="homeList.adv.lab.img" mode="aspectFit" />
			</view>
			<view class="box" style="margin-top: 30rpx;padding: 32rpx;">
				<view class="title">
					<view class="leftTitle">
						<view class="colorBox" :style="'background:'+ themeColors" />
						<text>企业推荐</text>
					</view>
					<view class="rightTitle" :style="'color:'+ themeColors" @tap="toExhibitor">
						更多 >>>
					</view>
				</view>
				<u-grid :border="false" col="3">
					<u-grid-item v-for="(listItem,listIndex) in homeList.topStore" @tap="gridItme('/pages_index/exhibitorInfo/index?id=' +listItem.id +'&store_id=' + listItem.store_id)" :key="listIndex">
						<image class="gridItem"  :src="listItem.store_one.logo" mode="scaleToFill" />
					</u-grid-item>
				</u-grid>
			</view>
		</view>

		<view class="news">
			<u-tabs :list="list" lineWidth="70rpx" keyName="cate_name" lineHeight="3px" :activeStyle="activeStyle"
				:inactiveStyle="inactiveStyle" :lineColor="themeColors" @click="clickTabs"></u-tabs>
			<scroll-view :scroll-y="true" lower-threshold="20" @scrolltolower="scrolltolower" class="listContent">
				<view class="newsContent">
					<newsBox v-for="item in newsList" :key="item.news_id" :item="item" />
				</view>
				<view style="width:100%;text-align: center;margin-top: 40rpx;" @tap="navigator('/pages/news/index');">更多新闻 >></view>
			</scroll-view>
		</view>

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
		getMyTicket
	} from "@/api/register";
	import config from "@/utils/config.js";
	import {
		homeData,
		getExhibitNews,
		newsGetCate,
		newsGetList,
		getInfo,
		getDefault
	} from "@/api/list.js";
	export default {
		components: {
			newsBox,
		},
		data() {
			return {
				columns: [
					['企业', '展品']
				],
				keyword: '',
				themeColors: '',
				title: config.title,
				cneterTitle: config.center,
				current: 0,
				status: "loadmore",
				current_news_cate_id: "",
				showLocation: false,
				showPicker: false,
				showPickerText: '企业',
				topIconDistance: "",
				nowExhibits: {},
				homeList: {
					slider: [],
				},
				exInfo:{},
				titleColor: "rgb(255,255,255)",
				scrollTop: 0, //元素滚动值
				bgColor: "rgba(0,0,0,0)", //顶部标题栏背景色
				list: [], //标签栏列表
				newsPage: 1, //切换时的当前分页值
				newsList: [], //新闻列表
				//搜索按钮控件样式
				actionStyle: {
					color: "#FFF",
					fontSize: "24rpx",
					borderRadius: '8rpx',
					background: ' rgb(165, 205, 24)',
					padding: '8rpx 24rpx',
				},

				inactiveStyle: {
					color: "rgb(185, 185, 185)",
					fontSize: "32rpx",
					lineHeight: "46rpx",
					padding: "20rpx 30rpx",
					borderRadius: "20rpx 20rpx 0 0",
				},
				activeStyle: {
					color: '',
					fontSize: "32rpx",
					lineHeight: "46rpx",
					display: "block",
					background: "#FFF",
					borderRadius: "20rpx 20rpx 0 0",
					padding: "20rpx 30rpx",
				},
				lock: false,
				recList: [],
				loadData: {
					id: 0,
					keyWord: '',
				}
			};
		},
		onShow() {
			if (uni.getStorageSync("exhibit_id")) {
				this.showLocation = false;
				uni.showLoading({
					title: "加载中",
				});
			} else {
				this.showLocation = true;
			}
			getInfo({
				exhibit_id: uni.getStorageSync("exhibit_id"),
			}).then((res) => {
					this.exInfo=res.data
					uni.setStorageSync("ceilingImg", res.data.img);
					uni.setStorageSync('color', res.data.color_main);
					uni.setStorageSync('color_d', res.data.color_deputy);
					this.themeColors = res.data.color_main
					this.activeStyle.color = this.themeColors
					uni.hideLoading();
					
			});
			this.$nextTick(() => {
				this.$refs.tabbar.reload();
			});
		},
		onLoad(options) {
			this.getExhibitorList()
			newsGetCate({
					obj_id: config.obj_id,
				}).then((res) => {
					this.list = res.data;
					this.list.unshift({
						news_cate_id: 0,
      					cate_name: "本展资讯",
						exhibit_id: uni.getStorageSync("exhibit_id"),
					}) 
					getExhibitNews({
							exhibit_id:uni.getStorageSync("exhibit_id"),
							page: this.newsPage,
						}).then((res)=>{
							this.newsList = res.data.data;
						})
			});
			
		},
		created() {
			uni.getSystemInfo({
				success: (res) => {
					// 获取手机顶部状态栏的高度
					const statusBarHeight = res.statusBarHeight || 0;
					// 计算顶部图标距离
					(this.topIconDistance = statusBarHeight + 44)

				},
				fail: (err) => {
					console.error("获取系统信息失败:", err);
				},
			});
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
		methods: {
			//展商推荐
			gridItme(item) {
				uni.navigateTo({
					url: item
				})
			},
			//金刚区点击事件
			clickGrid(item) {
				switch (item.type) {
					case 0:
						this.navigator('/pages_index/jgInfo/index?id=' + item.article_id + '&title=' + item.page_title);
						break;
					case 1:
					uni.switchTab({
							url: '/pages/news/index'
						})
						// this.navigator('/pages/news/index');
						break;
					case 2:
						uni.switchTab({
							url: '/pages/activity/index'
						})
						break;
					case 3:
						uni.setStorageSync('current', 0)
						this.toExhibitor()
						break;
					case 4:
						uni.setStorageSync('current', 1)
						this.toExhibitor()
						break;
					case 5:
						uni.setStorageSync('get_contest', 1)
						this.navigator('/pages_platform/match/rank')
						break;
				}

			},
			
			//智会行小程序跳转
			toOther(){
				// 暂缓未获得			
				uni.navigateToMiniProgram({ 
					appId: 'wx406002cbb98c9b89',
					path: 'pagesB/hotel/hotelListWX',
					extraData: {
						actld: uni.getStorageSync("exhibit_id"),//会议id
	 					actName:this.exInfo.name,//会议名称
						source:'HMCB',//标识
					},
					envVersion: 'release',
					success(res) {
		 				// 打开成功
					}
				})
			},
			//跳转事件
			navigator(url) {
				uni.navigateTo({
					url: url,
				});
			},
			redirectTo(url) {
				uni.reLaunch({
					url: url,
				});
			},
			toExhibitor() {
				uni.switchTab({
					url: '/pages/exhibitor/index'
				})
				
			},
			toWeb(url) {
				if (url) {
					uni.setStorageSync('webviewUrl', url)
					uni.navigateTo({
						url: "/pages_index/webview/index"
					})
				} else {
					return
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
				} else {
					next();
				}
			},
			
			inIndex() {
				this.showLocation = false;
				getInfo({
					exhibit_id: uni.getStorageSync("exhibit_id"),
				}).then((res) => {
					uni.setStorageSync("ceilingImg", res.data.img);
					uni.setStorageSync('color', res.data.color_main);
					uni.setStorageSync('color_d', res.data.color_deputy);
					newsGetCate({
						obj_id: config.obj_id,
					}).then((res) => {
						this.list = res.data;
						this.list.unshift({
							news_cate_id: 0,
							cate_name: "本展资讯",
							exhibit_id: uni.getStorageSync("exhibit_id"),
						}) 
						getExhibitNews({
							exhibit_id:uni.getStorageSync("exhibit_id"),
							page: this.newsPage,
						}).then((res)=>{
							this.newsList = res.data.data;
						})
					});
				});
			},
			//点击门票
			toTickerInfo() {
				if (this.lock) {
					return;
				} else {
					this.lock = true;
					getMyTicket({
						exhibit_id: uni.getStorageSync("exhibit_id"),
					}).then((res) => {
						if (res.code == -1) {
							this.lock = false;
							return;
						}
						if (res.code == 1) {
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
			},
			//切换tab栏触发时间
			clickTabs(e) {
				if(e.index == 0){
					getExhibitNews({
							exhibit_id:uni.getStorageSync("exhibit_id"),
							page: this.newsPage,
						}).then((res)=>{
							this.newsList = res.data.data;
						})
				}
				else{
					newsGetList({
					news_cate_id: e.news_cate_id,
					page: this.newsPage,
				}).then((res) => {
					this.newsList = res.data.data;
				});
				}
			},
			//pop弹窗触发事件，必须有不然报错
			open() {
				console.log(123);
			},
			close() {
				this.showLocation = false;
			},
			//获取展会列表
			getExhibitorList(){
				getDefault({obj_id: config.obj_id,}).then((res) => {
					//只执行一次获取默认项目id 其他处更改此处不在更改
					uni.hideLoading();
					this.nowExhibits = res.data;
					if(!uni.getStorageSync("exhibit_id")){
						uni.setStorageSync("exhibit_id", this.nowExhibits.exhibit_id);	
					}
					//如果后期转换成跟随项目变化在此处增加接口
					//获取主页数据
					homeData({
						exhibit_id: uni.getStorageSync("exhibit_id"),
					}).then((res1) => {
						this.homeList = res1.data;
					});
				});
				}
		},
	};
</script>

<style lang="scss" scoped>
	.pages {
		width: 750rpx;
		overflow-x: hidden !important;
		min-height: 92vh;
		padding-bottom: 50px;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: calc(50px + env(safe-area-inset-bottom));
	}

	.popBox {
		width: 686rpx;
		padding: 64rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.popText1 {
			font-size: 28rpx;
			font-weight: 400;
			line-height: 54rpx;
			margin-top: 34rpx;
		}

		.local {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 50rpx;
			width: 500rpx;

			.icon {
				width: 32rpx;
				height: 42rpx;
				margin-right: 12rpx;
			}

			text {
				font-size: 40rpx;
				font-weight: 700;
				line-height: 54rpx;
			}
		}

		.in {
			margin-top: 70rpx;
			padding: 8rpx 0;
			width: 300rpx;
			text-align: center;
			color: #fff;
			font-size: 32rpx;
			font-weight: 700;
			line-height: 54rpx;
			letter-spacing: 0px;
			border-radius: 100rpx;
		}

		.change {
			margin-top: 40rpx;
			padding: 8rpx 0;
			width: 300rpx;
			text-align: center;
			color: #000;
			font-size: 32rpx;
			font-weight: 700;
			line-height: 54rpx;
			letter-spacing: 0px;
			border: 1px solid rgba(153, 153, 153, 0.8);
			background: #fff;
			border-radius: 100rpx;
		}
	}

	.navTitle {
		font-family: "阿里妈妈数黑体 Bold";
		font-size: 40rpx;
		font-weight: 900;
		letter-spacing: 5rpx;
		line-height: 58rpx;
	}

	.header {
		width: 97%;
		height: 800rpx;
		background-color: #8f8f94;
		display: flex;
		justify-content: center;

		.search {
			display: flex;
			align-items: center;
			position: absolute;
			top: 176rpx;
			padding: 0 30rpx;
			margin: 0 auto;

			.left {
				display: flex;
				color: #fff;
				font-size: 28rpx;
				font-weight: 600;
				text-shadow: 2px 3px 5px rgba(0, 0, 0, 0.25);

				text {
					margin-right: 6rpx;
					width: 170rpx;
					text-align: center;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.right {
				margin-left: 20rpx;
				width: 474rpx;
			}
		}
	}

	.content {
		min-height: 50vh;
		background-color: #efefef;
		padding: 0 30rpx;
		position: relative;

		.signUp {
			background-color: #fff;
			padding: 52rpx 0;
			border-radius: 20rpx;
			position: relative;
			top: -60rpx;
			display: flex;
			align-items: center;
			justify-content: space-evenly;

			.left {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				// margin: 38rpx 0;
				.icon {
					width: 128rpx;
					height: 128rpx;
					margin-bottom: 10rpx;
				}

				.title {
					font-size: 32rpx;
					font-weight: 700;
					line-height: 58rpx;
					font-family: "阿里妈妈数黑体 Bold";
				}

				.info {
					color: rgb(102, 102, 102);
					font-size: 24rpx;
					font-weight: 400;
				}
			}
		}

		.box {
			margin-top: -30rpx;
			background-color: #fff;
			border-radius: 20rpx;
			overflow: hidden;

			.grid-text {
				font-size: 28rpx;
				margin-top: 16rpx;
			}

			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 30rpx;

				.leftTitle {
					display: flex;
					align-items: center;
					color: rgb(3, 3, 3);
					font-size: 32rpx;
					font-weight: 500;
					line-height: 58rpx;
					letter-spacing: 0px;

					.colorBox {
						width: 12rpx;
						height: 40rpx;
						margin-right: 20rpx;
					}
				}

				.rightTitle {
					font-size: 24rpx;
				}

			}
		}
	}

	//展商推荐
	.gridItem {
		width: 192rpx;
		height: 148rpx;
		border: 2rpx solid #CCC;
		margin-bottom: 20rpx;
	}

	.news {
		padding-top: 30rpx;
		background-color: none;
		background-color: #efefef;

		.newsContent {
			background: #fff;
			min-height: 20vh;
			padding-top: 40rpx;
		}
	}

	::v-deep .u-notice-bar {
		border-radius: 50rpx;
	}

	::v-deep .u-tabs__wrapper__nav__item {
		padding: 0 !important;
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

	::v-deep .u-swiper {
		width: 750rpx;
		overflow: hidden;
		margin-left: 3%;
		height: 700rpx;
	}

	::v-deep .u-icon__icon {
		font-size: 19px !important;
	}

	::v-deep .u-search__content__icon {
		display: none !important;
	}
	::v-deep .u-grid-item{
		margin-bottom: 16rpx;
	}
	.listContent {
		background: #fff;
	}
</style>