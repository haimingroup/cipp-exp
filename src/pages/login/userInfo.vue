<template>
	<view class="page">
		<button class="userAvaBtn" @chooseavatar="chooseavatar" open-type="chooseAvatar">
			<image class="userAva" style="margin: 0" :src="avasrc ? avasrc : '../../static/mine/Account.svg'"
				mode="aspectFit" />
		</button>
		<text class="hint">点击上方更改头像 <text style="color: red">*</text>
		</text>
		<view class="input">
			<input placeholder="请输入昵称" type="nickname" v-model="nickName" id="text-inp" @input="onInputNickname" />
		</view>
		<button class="btn" style=" background: #004098" @tap="clickBtn">提交</button>
		<button class="btn" v-if="showBack" style="background: #ccc; bottom: 230px" @tap="back">
			返回
		</button>
	</view>
</template>
<script>
	import {
		editInfo
	} from "@/api/user.js";
	export default {
		data() {
			return {
				themeColors: uni.getStorageSync('color'),
				avasrc: "",
				nickName: "",
				showBack: "",
			};
		},
		onLoad(option) {
			console.log(option.info+'"}');

			if (option.info) {
				this.showBack = true;
				let info = JSON.parse(option.info+'"}');
				this.nickName = info.nickname;
				this.avasrc = info.avatar;
			}
			
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
					fail:()=>{
						uni.switchTab('/pages/index/index')
					}
					
				});
			},
			chooseavatar(e) {
				this.avasrc = "data:image/jpeg;base64," + wx.getFileSystemManager().readFileSync(e.detail.avatarUrl, "base64");
			},
			// 输入框输入或选择微信昵称
			onInputNickname(e) {
				if (e.detail.value) {
					const str = e.detail.value;
					this.nickName = str;
				} else if (e.detail.value == "") {
					this.nickName = "";
				} else {
					uni
						.createSelectorQuery()
						.in(this) // 注意这里要加上 in(this)
						.select("#text-inp")
						.fields({
							properties: ["value"],
						})
						.exec((res) => {
							const nickName = res?.[0]?.value;
							this.nickName = nickName;
							console.log("昵称", nickName);
						});
				}
			},
			clickBtn() {
			
				editInfo({
					nickname: this.nickName,
					avatar: this.avasrc,
				}).then((res) => {
					if (res.code == 1) {
						uni.showToast({
							title: "信息提交成功",
							icon: "none",
						});
						setTimeout(() => {
							if (uni.getStorageSync("share")) {
								uni.reLaunch({
									url: "/pages_index/mine/teamInfo/index?team_id=" +
										uni.getStorageSync("team_id"),
								});
							} else if (uni.getStorageSync("scene") != false) {
								uni.navigateTo({
									url: '/pages/agreement/index?scene='+ uni.getStorageSync("scene")
								})
							}else if (uni.getStorageSync("toexinfo") ) {
								uni.navigateTo({
									url: '/pages_index/exhibitorInfo/index?store_id'+uni.getStorageSync("store_id")
								})
							}  
							else {
								uni.reLaunch({
									url: "/pages/mine/index",
								});
							}
						}, 1000);
					}
				});
			},
		},
	};
</script>
<style lang="scss" scoped>
	.page {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.userAvaBtn {
		padding: 0 !important;
		margin-top: 110px;
		border-radius: 50%;
		width: 168rpx;
		height: 168rpx;
	}

	.userAva {
		width: 168rpx;
		height: 168rpx;
		border-radius: 50%;
	}

	.hint {
		font-size: 16px;
		margin-top: 48rpx;
	}

	.input {
		margin-top: 160rpx;
	}

	.btn {
		border-radius: 100px;
		position: fixed;
		padding: 0 180rpx;
		bottom: 300px;
		margin: 0 auto;
		color: #fff;
	}

	//删除登录边框
	button::after {
		border: none;
	}

	#text-inp {
		border-bottom: 1px solid #ccc;
	}
</style>