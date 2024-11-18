<template>
	<view class="page">
		<!-- 顶部标题栏 -->
		<u-navbar :fixed="true" bgColor="#FFFFFF00" @leftClick="back">
			<view class="navTitle" slot="left">
				<u-icon name="arrow-left" color="#FFF"></u-icon>
				<text style="margin-left: 10rpx">登记核销</text>
			</view>
		</u-navbar>
		<view>
			<image class="headerImg" :src="info.exhibit_one.img" mode="scaleToFill" />
		</view>
		<view class="userInfo" :style="'color:'+ themeColors">
			<view style="display: flex">
				<u-icon name="checkmark-circle-fill" :color="themeColors" size="32"></u-icon>
				<text style="margin-left: 10rpx">当前登录</text>
				<text style="margin: 0 10rpx">{{ info.nickname || "" }}</text>
				<text>{{ info.phone || "" }}</text>
			</view>
			<view style="display: flex" @tap="switchTab('/pages/mine/index')">
				<text style="margin-right: 5rpx">会员中心</text>
				<u-icon name="arrow-right" :color="themeColors" size="32"></u-icon>
			</view>
		</view>
		<view class="qrcode">
			<view class="time">{{ nowTime }}</view>
			<u-divider></u-divider>
			<view style="font-size: 40rpx;font-weight: 600;margin-bottom: 32rpx;">
				{{ info.store_one.company_name || "" }}
            </view>
            <view style="font-size: 32rpx;margin-bottom: 32rpx;">
				{{ info.dept || "" }}
			</view>
            <view style="font-size: 32rpx;margin-bottom: 32rpx;">
				{{ info.nickname || "" }}
			</view>
            <view style="font-size: 32rpx;margin-bottom: 32rpx;">
				{{ info.id_card.replace(/(.{6}).*(.{4})/, '$1********$2') || "" }}
			</view>
            <view>
                <view class="status" :style="info.exhibit_card.status !== 0 ? 'background:#07C160' : 'background:#FA5151' ">
                    <text v-if="info.exhibit_card.status !== 0">已兑换展商证</text>
                    <text v-else>未兑换展商证</text>
                </view>
            </view>
		</view>
		<view class="regdata" style="padding: 24rpx 32rpx; display: block">
			<text> 您已是展商身份，现场凭此页面由展商通道入场{{ info.exhibit_one.name }}将于{{ info.exhibit_one.start_time.slice(0, 16)}}{{"在" + info.exhibit_one.city_name + info.exhibit_one.lab_name}}举行，欢迎您的到来！</text>
		</view>
	</view>
</template>
<script>
	import {
		getExTicket
	} from "@/api/v2";
	export default {
		data() {
			return {
				themeColors: uni.getStorageSync('color'),
				bgColor: uni.getStorageSync('color'),
				info: {},
				nowTime: "",
				
			};
		},
		//在mounted钩子函数中调用nowTimes函数、在beforeDestroy钩子函数中调用clear函数
		mounted() {
			this.nowTimes();
			setInterval(this.nowTimes, 1000);
		},
		beforeDestroy() {
			this.clear();
		},
		 async onLoad(options) {
			await getExTicket({
				exhibit_id: uni.getStorageSync("exhibit_id"),
			}).then((res)=>{
				this.info = res.data
			})
		},
		methods: {
			//获取当前时间
			timeNow(timeStamp) {
				let hh =
					new Date(timeStamp).getHours() < 10 ?
					"0" + new Date(timeStamp).getHours() :
					new Date(timeStamp).getHours();
				let mm =
					new Date(timeStamp).getMinutes() < 10 ?
					"0" + new Date(timeStamp).getMinutes() :
					new Date(timeStamp).getMinutes();
				let ss =
					new Date(timeStamp).getSeconds() < 10 ?
					"0" + new Date(timeStamp).getSeconds() :
					new Date(timeStamp).getSeconds();
				this.nowTime = hh + ":" + mm + ":" + ss;
			},
			// 实时刷新当前时间，格式化
			nowTimes() {
				this.timeNow(new Date());
			},
			//清除定时器
			clear() {
				clearInterval(this.nowTimes);
				this.nowTimes = null;
			},
			back() {
				uni.switchTab({
					url: "/pages/index/index",
				});
			},
			navigator(url) {
				uni.navigateTo({
					url: url,
				});
			},
			switchTab(url) {
				uni.switchTab({
					url: url,
				});
			},
			clustering() {
				uni.navigateTo({
					url: "/pages_index/mine/myTeam/index",
				});
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

	.headerImg {
		width: 750rpx;
		height: 532rpx;
		background: #000;
		display: flex;
	}

	.userInfo {
		height: 66rpx;
		background: #e2f8ff;
		display: flex;
		align-items: center;
		padding: 0 32rpx;
		font-size: 24rpx;
		justify-content: space-between;
	}

	.qrcode {
		margin: 24rpx 32rpx;
		border-radius: 20rpx;
		background: #fff;
		padding: 32rpx 76rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.time {
			font-weight: 700;
			font-size: 96rpx;
		}
        .status{
            width: 186rpx;
            height: 38rpx;
            color: #FFF;
            font-size:22rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10rpx;
        }
	}

	.regdata {
		font-size: 28rpx;
		margin: 24rpx 32rpx;
		padding: 14rpx 48rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		border-radius: 20rpx;
	}

	.myTeam {
		font-size: 28rpx;
		margin: 32rpx;
		padding: 24rpx 48rpx;
		background: #fff;
		border-radius: 20rpx;
	}

	.myTeamHeader {
		display: flex;
		font-size: 32rpx;
		justify-content: space-between;
		align-items: center;
	}

	.subBtn {
		width: 360rpx;
		text-align: center;
		margin: 40rpx auto;
		padding: 16rpx 0;
		color: rgb(255, 255, 255);
		font-size: 36rpx;
		border-radius: 50px;
	}

	::v-deep .u-divider {
		width: 267px;
		border-bottom-width: 3px;
	}
</style>