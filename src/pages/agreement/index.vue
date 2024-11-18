<template>
	<view class="page">
		<u-navbar :fixed="true" placeholder @leftClick="toHome">
			<view class="navTitle" slot="left">
				<u-icon class="home" name="home"></u-icon>
				<text style="margin-left: 20rpx">承诺书确认</text>
			</view>
		</u-navbar>
		<view class="content">
			<view style="padding: 0 30rpx">
				<view class="title">{{ info.title }}</view>
				<rich-text class="richText"  :nodes="info.content"></rich-text>
			</view>
			<view class="form-item"><text style="margin-right: 20rpx">签署日期:</text>{{ time }}</view>
			<view class="form-item"><text style="margin-right: 20rpx">监护人签名:</text>
				<image v-if="src" class="srcImg" :src="src" @tap="toShouXie" mode="scaleToFill" />
				<text style="color:red;font-size: 28rpx;" @tap="toShouXie" v-else>
					点击添加手动签名
				</text>

			</view>
			<view class="form-item">
				<text style="margin-right: 20rpx;">监护人身份证号<text style="color:red"> *</text>:</text>

				<u--input placeholder="请输入身份证号" border="surround" v-model="cardId" maxlength="18"></u--input>
			</view>
			<view class="saveBtn">
				<u-button type="primary" shape="circle" text="提交" @tap="save"></u-button>
			</view>
			<u-popup :show="showModal" mode="bottom"  @close="close" >
				<view class="popupBox">
					<view style="display:flex;justify-content:center">
						<u-icon name="checkbox-mark" size="150" color="green"></u-icon>
					</view>
					<view>
						<text>{{content}}</text>
					</view>
					<view style="display:flex;align-items: center;justify-content: space-around;margin-top:50rpx">
						<view class="back">
							<u-button  type="success"  @tap="toHome">返回首页</u-button>
						</view>
						<view class="back">
							<u-button  type="info " @tap="close">取消</u-button>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import {
		getExhibitSign,
		saveExhibitSign
	} from '@/api/user.js'
	export default {
		data() {
			return {
				time: '',
				info: {
				},
				cardId: '',
				id: '',
				src: '',
				showModal:false,
				content:'承诺书签署成功，请将此页展示给工作人员确认',
			};
		},
		onLoad(option) {
			const scene = decodeURIComponent(option.scene)
			uni.setStorageSync('scene', '9')
		},
		onShow(){
			this.getSence()
		},
		methods: {
			close(){
				this.showModal = false
			},
			getSence(){
				if(uni.getStorageSync('src')){
					this.src =uni.getStorageSync('src')
				}
				if(!uni.getStorageSync('scene')){
					this.getSence()
				}else{
					uni.showLoading({
						title: "加载中",
					});
					this.id = uni.getStorageSync('scene')
					let data = new Date();
					this.time = data.toLocaleDateString()
					getExhibitSign({
						id: uni.getStorageSync('scene')
					}).then((res) => {
						this.info = res.data
						uni.hideLoading();
					})
				}
				
			},
			confirm(){
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			toHome() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			toShouXie() {
				uni.navigateTo({
					url: '/pages/agreement/shouxie'
				})
			},
			save() {
				if (this.cardId.length != 18) {
					uni.showToast({
						title: "请输入正确身份证号",
						icon: "none",
					});
					return
				} else {
					this.src = "data:image/jpeg;base64," + uni.getFileSystemManager().readFileSync(this.src, "base64");
					saveExhibitSign({
							id: this.id,
							id_card: this.cardId,
							sign_img: this.src,
						}).then((res) => {
							if (res.code == 1) {
								uni.showToast({
									title: "信息提交成功",
									icon: "none",
								});
								uni.removeStorageSync('scene')
								this.showModal = true
								
							} else {
								uni.showToast({
									title: res.msg,
									icon: "none",
								});
								console.log('提交失败', res)
							}

						})
						.catch((err) => {
							uni.showToast({
								title: err,
								icon: "none",
							});
						})
				}

			}
		}
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
		color: #000;
		font-size: 36rpx;
		font-weight: 700;
		line-height: 36rpx;
		text-align: left;
	}

	.content {
		width: 100%;
		background: #FFF;
		padding-bottom: 20rpx;

		.title {
			width: 100%;
			text-align: center;
		}

		.form-item {
			font-size: 24rpx;
			display: flex;
			align-items: center;
			padding: 30rpx;
			
		}
	}
	.popupBox{
		padding: 50rpx 36rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
		.back{
			width: 260rpx;
		}
	}

	.srcImg {
		width: 150rpx;
		height: 100rpx;
		transform: rotate(-90deg)
	}

	.saveBtn {
		margin: 0 30rpx 20rpx 30rpx;
	}

	::v-deep .uicon-home {
		padding: 5rpx;
		border: 2rpx solid #ccc;
		border-radius: 50%;
	}
</style>