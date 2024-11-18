<template>
	<view class="page">
		<!-- 顶部标题栏 -->
		<u-navbar :fixed="true" :bgColor="bgColor" @leftClick="back">
			<view class="navTitle" slot="left">
				<u-icon name="arrow-left" color="#FFF"></u-icon>
				<text style="margin-left: 10rpx">已登记信息</text>
			</view>
		</u-navbar>
		<view>
			<image class="headerImg" :src="imgSrc" mode="scaleToFill" />
		</view>
		<view class="title"> 登记信息 </view>
		<view class="content">
			<view class="cell" v-for="(item, index) in showList" :key="index">
				<text class="cellTitle">{{ item.field_label }}</text>
				<text class="cellCon">{{ item.value }}</text>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		getUserFieldInfo
	} from "@/api/register";
	export default {
		data() {
			return {
				themeColors: uni.getStorageSync('color'),
				imgSrc: uni.getStorageSync("ceilingImg"),
				bgColor: uni.getStorageSync('color'),
				showList: [],
			};
		},
		onLoad(options) {
			getUserFieldInfo().then((res) => {
				this.showList = res.data;
			});
		},
		methods: {
			back() {
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

	.title {
		margin: 32rpx 0;
		text-align: center;
		font-size: 32rpx;
		width: 750rpx;
	}

	.headerImg {
		width: 750rpx;
		height: 532rpx;
	}

	.content {
		margin: 32rpx;
		padding: 32rpx;
		background: #fff;
		border-radius: 20rpx;
	}

	.cell {
		display: flex;
		align-items: center;
		border-bottom: 1px solid rgba(210, 210, 210, 0.25);
		padding: 30rpx 0;

		.cellTitle {
			font-size: 28rpx;
			color: #000;
			width: 260rpx;
			margin-left: 20rpx;
		}

		.cellCon {
			font-size: 24rpx;
			color: rgba(0, 0, 0, 0.45);
		}
	}
</style>