<template>
	<view class="page">
        <view class="btnBox">
            <button class="btn" @tap="$refs.drawPad.init()" style="position: relative;top:-200rpx">
            清空
        </button>
		<!-- <button class="btn" @tap="$refs.drawPad.clearCache()">清空所有页码的缓存</button> -->
		<button class="btn" @tap="saveImg" style="top:-50rpx;background-color:#2979ff;color: #fff;">保存图片</button>
    </view>
        
		<zwp-draw-pad ref="drawPad" :width="upx_700" :height="height" class="draw-pad" />
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			upx_700: uni.upx2px(700),
            height:0,
			src:'',
		}
	},

    onShow(){
        const systemInfo = uni.getSystemInfoSync();
        this.height = Number(systemInfo.screenHeight)
    },
	methods: {
		changeIndex(index) {
			const { drawPad } = this.$refs
			drawPad.saveCache(this.currIndex)
			drawPad.restoreCache(index)
			this.currIndex = index
		},
		saveImg() {
			this.$refs.drawPad.save().then(res => {
				uni.setStorageSync('src', res.tempFilePath)
				uni.showToast({ title: '已保存', icon: 'none' })
				uni.navigateTo({ url: '/pages/agreement/index' })
			})
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 98vh;
	background-color: #f5f5f5;
	overflow: hidden;
    display: flex;
    margin: 30rpx 0;
}
.draw-pad {
	margin: calc(var(--status-bar-height) + 25rpx) auto 25rpx;
	background-color: #fff;
    height: 92vh;
}
.btnBox{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 30rpx 0;
}
.btn {
   display: flex;
   align-items: center;
   justify-content: center;
    font-size:28rpx ;
    width: 200rpx;
    height:100rpx;
    transform: rotate(90deg);
    position: relative;
}
</style>
