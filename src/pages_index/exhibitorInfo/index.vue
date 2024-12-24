<template>
	<view class="page">
		<!-- 顶部标题栏 -->
		<u-navbar :fixed="true" placeholder :bgColor="bgColor" @leftClick="back">
			<view class="navTitle" slot="left">
				<u-icon name="arrow-left" color="#FFF"></u-icon>
				<text style="margin-left: 10rpx">企业详情</text>
			</view>
		</u-navbar>
		<view class="content">
			<view class="info">
				<view class="up">
					<u-avatar :src="info.logo" shape="square" size="170"></u-avatar>
					<view class="title">
						<view class="name">{{ info.name }}</view>
						<view class="type">{{ info.tags_name }}</view>
					</view>
				</view>
				<view class="text"></view>
				<view class="number" :style="`background:`+ themeColors">欢迎现场洽谈咨询 </view>
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
					<!-- <lime-painter  :postInfo="postInfo" /> -->
					<image
						:src="picture2"
						style="width: 620rpx; height:900rpx;"
						mode="scaleToFill"
					/>
					<l-painter css="width: 620rpx; height:900rpx; " 
						custom-style="position: fixed; left: 200%"
						@fail="fail"
						@done="done"
						pathType="url"
						ref="poster"
						performance
					>
						<l-painter-image :src="postInfo.bg_img" css="width: 620rpx; height:900rpx; position:absolute; "/>
						<l-painter-image :src="postInfo.store_one.logo" css="width: 72rpx;  height: 72rpx;position:absolute;top:295.2rpx;left:166rpx; "/>
						<l-painter-view   css="color:#055739;position:absolute;top:388.2rpx; left:140rpx;width:338rpx;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;height:59.2rpx;line-height:59.2rpx;text-align:center">
							<l-painter-text :css="`font-size:${fontSize}rpx`" :text="postInfo.store_one.name"/>
						</l-painter-view>
						<l-painter-text :text="postInfo.booth_no" css="position:absolute;top:476rpx;left:340rpx;color:#055739;font-size:35.2rpx"></l-painter-text>
						<l-painter-image :src="postInfo.qr_code_mini_url" css="width: 124.8rpx;height: 124.8rpx; border-radius:50%;position:absolute;top:678.8rpx;left:80.4rpx; "/>
					</l-painter>
					<view class="save" :style="'background:'+ themeColors" @click="save">保存到相册</view>
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
	import {getInfo} from "@/api/list.js";
	import productBox from "../../components/productBox.vue";
	import config from "@/utils/config"
	export default {
		components: {
			productBox
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
					name: '订单'
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
				fontSize:25.6,
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
				if(!uni.getStorageSync('color')){
					getInfo({exhibit_id:uni.getStorageSync('exhibit_id')}).then((res)=>{
						uni.setStorageSync("ceilingImg", res.data.img);
						uni.setStorageSync('color', res.data.color_main);
						uni.setStorageSync('color_d', res.data.color_deputy);
						this.themeColors = res.data.color_main
					})
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
					let num = this.postInfo.store_one.company_name.length
					if(num > 13){
						this.fontSize = 16.6
						let dValue = num - 13
						if( dValue > 7){
							this.fontSize = 25.6
							this.postInfo.store_one.company_name = this.postInfo.store_one.company_name.substr(0,12)+'...'
						}
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
				this.$refs.poster.canvasToTempFilePathSync({
				fileType: 'jpg',
				quality: 1,
				success: (res) => {
					this.picture2 = res.tempFilePath
				}
			})
			},
			fail(v) {
				console.log(v)
			},
			done(v) {
				console.log('绘制完成:',v)
			},
			save() {
				this.$refs.poster.canvasToTempFilePathSync({
					fileType: 'jpg',
					quality: 1,
					success: (res) => {
						console.log(res.tempFilePath)
						this.picture2 = res.tempFilePath
						this.saveImage()
					},
					fail(e) {
						console.log('???????????',e)
					}
				})
			},
			// 保存图征
			saveImage() {
				uni.saveImageToPhotosAlbum({
					filePath: this.picture2,
					success(res) {
						uni.showToast({
							title: '已保存到相册',
							icon: 'success',
							duration: 2000
						});
					},
				});
				
			},
			open() {
			},
			close() {
			this.showPop = false
			// console.log('close');
			},
			back() {
				uni.setStorageSync('current',0)
				uni.navigateBack();
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
		margin-top: 20rpx;
		padding: 0 30rpx;
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
	.lpBox{
		width: 620rpx;
		height: 900rpx;
		
	}
	.save{
		position: absolute;
		bottom: -110rpx;
		padding: 20rpx 36rpx;
		left: 196rpx;
		color: #FFF;
		border-radius: 10rpx;
	}
	button::after {
    	border: none;
  	}
</style>