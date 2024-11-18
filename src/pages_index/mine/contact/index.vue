<template>
	<view class="page">
		<!-- 顶部标题栏 -->
		<u-navbar :fixed="true" :bgColor="bgColor" @leftClick="back">
			<view class="navTitle" slot="left">
				<u-icon name="arrow-left" color="#FFF"></u-icon>
				<text style="margin-left: 10rpx">联系我们</text>
			</view>
		</u-navbar>
		<view class="banner">
			<image style="width: 750rpx; height: 532rpx" :src="imgSrc" mode="scaleToFill" />
		</view>
		<view class="content">
			<view class="from">
				<view class="title">
					<text>联系我们</text>
				</view>
				<u--form labelPosition="left" :model="from" ref="uForm" labelWidth="160rpx">
					<u-form-item label="您的姓名" prop="name" required ref="item1">
						<u--input v-model="from.name" placeholder="请填写您的真实姓名" border="bottom"></u--input>
					</u-form-item>
					<u-form-item label="公司名称" prop="company_name" required ref="item1">
						<u--input v-model="from.company_name" placeholder="请填写公司/店铺名" border="bottom"></u--input>
					</u-form-item>
					<u-form-item label="联系方式" prop="phone" required ref="item1">
						<u--input v-model="from.phone" placeholder="请填写您的手机号码" disabled border="bottom"></u--input>
					</u-form-item>
				</u--form>
				<text class="hint">提交信息后，我们专属客服将在24小时内致电您，与您确认具体情况，请您注意接听来电。</text>
				<view class="subBtn" :style="'background:'+ themeColors" @tap="submit"> 提交 </view>
			</view>
			<view class="info">
				<view class="title">
					<u-icon name="error-circle" color="#E0084B" size="16px"></u-icon>
					<text>如果您不方便提交信息，可直接与我们取得联系！</text>
				</view>
				<u-line color="rgb(210, 210, 210)" margin="28rpx 0 18rpx 0"></u-line>
				<view class="linkman" v-for="item in info" :key="item.contact_id">
					<view class="left">
						<view>
							<text v-if='item.contact_section'>{{ item.contact_section + "&nbsp;" }}</text>
							{{ item.contact_name }}
						</view>
						<view style="margin-top: 10rpx">电话：{{ item.phone }}</view>
					</view>
					<view class="right" @tap="ringUp(item.phone)">
						<u-icon name="phone" size="24px"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		contact,
		inquiry
	} from "@/api/register";
	export default {
		data() {
			return {
				themeColors: uni.getStorageSync('color'),
				imgSrc: uni.getStorageSync("ceilingImg"),
				bgColor: uni.getStorageSync('color'),
				from: {
					name: "",
					company_name: "",
					phone: "",
					exhibit_id: uni.getStorageSync("exhibit_id"),
				},
				info: {},
			};
		},
		onLoad() {
			contact({
				exhibit_id: uni.getStorageSync("exhibit_id"),
			}).then((res) => {
				this.info = res.data;
				console.log(this.info);
			});
			this.from.phone = uni.getStorageSync("phone");
		},
		methods: {
			submit() {
				inquiry(this.from).then((res) => {
					if (res.code == 0) {
						uni.showToast({
							title: res.msg,
							icon: "none",
						});
					} else {
						uni.showToast({
							title: "提交成功",
							icon: "",
							success: () => {
								setTimeout(() => {
									this.back();
								}, 1000);
							},
						});
					}
				});
			},
			back() {
				uni.navigateBack();
			},
			ringUp(mob) {
				//点击呼叫
				uni.makePhoneCall({
					phoneNumber: mob, //仅为示例
				});
			},
		},
	};
</script>
<style lang="scss" scoped>
	.page {
		min-height: calc(92vh - (50rpx + env(safe-area-inset-bottom)));
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

	.banner {
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
			padding-bottom: 30rpx;
		}

		.from {
			margin: 32rpx auto;
			padding: 32rpx;
			background: #fff;
			border-radius: 20rpx;

			.hint {
				color: rgb(153, 153, 153);
				font-size: 20rpx;
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
		}

		.info {
			margin-top: 60rpx;
			padding: 30rpx;
			background-color: #fff;
			border-radius: 20rpx;

			.title {
				font-size: 25rpx;
				display: flex;

				text {
					margin-left: 20rpx;
				}
			}

			.linkman {
				font-size: 28rpx;
				margin-bottom: 30rpx;
				display: flex;
				align-items: center;

				.left {
					width: 90%;
				}

				.right {
					width: 10%;
					height: 66rpx;
					border-left: 1px solid rgb(210, 210, 210);
					padding-left: 20rpx;
					display: flex;
					align-items: center;
				}
			}
		}
	}
</style>