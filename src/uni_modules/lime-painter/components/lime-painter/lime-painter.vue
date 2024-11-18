<template>
	<view class="page">
		<l-painter css="width: 750rpx; padding-bottom: 100rpx; background: linear-gradient(180deg,#ff971b 0%, #ff5000 100%)" 
				@fail="fail"
				@done="done"
				pathType="url"
				ref="poster"
				performance
				>
				<l-painter-image :src="postInfo.bg_img" css="width: 640rpx;  height: 1386rpx;position:absolute; "/>
				<l-painter-image :src="postInfo.store_one.logo" css="width: 185rpx;  height: 98rpx;position:absolute;top:603rpx;left:218rpx; "/>
				<l-painter-text :text="postInfo.store_one.company_name" css="position:absolute;top:759rpx;left:197.5rpx;color:#055739;font-size:64rpx"></l-painter-text>
				<l-painter-text :text="postInfo.store_one.booth_no" css="position:absolute;top:859rpx;left:197.5rpx;color:#055739;font-size:64rpx"></l-painter-text>
				<l-painter-image :src="postInfo.qr_code_mini_url" css="width: 245rpx;  height: 245rpx;position:absolute;top:1000rpx;left:50rpx; "/>
		</l-painter>
		<button type="default" @click="save">save</button>

	</view>
</template>

<script>
import {getStorePost} from "@/api/v2.js";
	export default {
		props:[postInfo],
		data: () => ({
			postInfo:this.postInfo,
			picture: '',
			picture2: '',
			show: false,
		}),
		mounted() {

			this.$refs.poster.canvasToTempFilePathSync({
				fileType: 'jpg',
				quality: 1,
				success: (res) => {
					console.log(`mounted`, res.tempFilePath)
					this.picture2 = res.tempFilePath
					this.saveImage()
				}
			})
		},
		methods: {
			close() {
				this.show = false
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
				// #ifndef H5
				uni.saveImageToPhotosAlbum({
					filePath: this.picture,
					success(res) {
						uni.showToast({
							title: '已保存到相册',
							icon: 'success',
							duration: 2000
						});
					},
				});
				// #endif
			}
		}
	};
</script>

<style lang="stylus" scoped>

</style>
