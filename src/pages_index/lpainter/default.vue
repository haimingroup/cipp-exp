<template>
	<view class="page">
        <!-- 宽620是错误的,正确应该为宽600,此版不做因已经调整完不做修改，下一版开始修改 -->
        <image
            :src="picture2"
            style="width: 620rpx; height: 1200rpx;"
            mode="scaleToFill"
        />
        <l-painter css="width: 620rpx; height:1200rpx; " 
            custom-style="position: fixed; left: 200%"
            @fail="fail"
            @done="done"
            pathType="url"
            ref="poster"
            performance
        >
            <!-- 底图 -->
            <l-painter-image :src="postInfo.bg_img" css="width: 620rpx; height:1200rpx; position:absolute; "/>
            <!-- 店铺名称 -->
            <l-painter-view  css="position:absolute;top:286.8rpx; left:58rpx;width:500.8rpx;height:59.2rpx;line-height:59.2rpx;text-align:center;">
                <l-painter-text css="color:#004097;font-size:27.6rpx;" :text="postInfo.store_one.company_name" ></l-painter-text>
            </l-painter-view>
            <!-- 展位号 -->
            <l-painter-text :text="postInfo.booth_no" css="position:absolute;top:410.8rpx;left:306rpx;color:#fff;font-size:20rpx"></l-painter-text>
            <!-- 分享二维码 -->
            <l-painter-image :src="postInfo.qr_code_mini_url" css="width: 130rpx;height: 130rpx; position:absolute;top:463.6rpx;left:242.8rpx; "/>
            <!-- 展会名称 -->
            <l-painter-view  css="position:absolute;top:737.2rpx; left:18.2rpx;width:583.5rpx;height:43.2rpx;line-height:43.2rpx;text-align:center;">
                <l-painter-text css="color:#FFF;font-size:25.6rpx;" :text="postInfo.exhibit_one.name" ></l-painter-text>
            </l-painter-view>
            <!-- 展会开始时间 -->
            <l-painter-view  css="position:absolute;top:832.6rpx; left:24rpx;width:338rpx;height:59.2rpx;line-height:59.2rpx;text-align:center;">
                <l-painter-text css="color:#FFF;font-size:25.6rpx;" :text="postInfo.exhibit_one.start_time.slice(0, 11)" ></l-painter-text>
            </l-painter-view>
              <!-- 展会开始时间 -->
            <l-painter-view  css="position:absolute;top:832.6rpx; left:263.2rpx;width:338rpx;height:59.2rpx;line-height:59.2rpx;text-align:center;">
                <l-painter-text css="color:#FFF;font-size:25.6rpx;" :text="postInfo.exhibit_one.end_time.slice(0, 11)" ></l-painter-text>
            </l-painter-view>
            <!-- 展会地点 -->
            <l-painter-view  css="position:absolute;top:923.4rpx; left:121.9rpx;width:376rpx;height:59.2rpx;line-height:59.2rpx;text-align:center;">
                <l-painter-text css="color:#FFF;font-size:27.6rpx;" :text="postInfo.exhibit_one.lab_name" ></l-painter-text>
            </l-painter-view>
        </l-painter>
        <view class="save" :style="'background:'+ themeColors" @click="saveImage">保存到相册</view>

	</view>
</template>

<script>
	export default {
		
		data: () => ({
            themeColors: uni.getStorageSync('color'),
			picture2: '',
			postInfo:{
                exhibit_one:{
                    start_time:'',
                    end_time:'',
                }
            },
		}),
     
		mounted() {
			this.$refs.poster.canvasToTempFilePathSync({
				fileType: 'jpg',
				quality: 1,
				success: (res) => {
                   console.log(res);
					this.picture2 = res.tempFilePath
            
			}
        })
		},
		methods: {
			fail(v) {
				console.log(v)
			},
			done(v) {
				console.log('绘制完成:',v)
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
			
			}
		}
	};
</script>

<style lang="scss" scoped>
    .page{
        width: 620rpx;
		height: 1200rpx;
    }
    .save{
        position: absolute;
        bottom: -110rpx;
        padding: 20rpx 36rpx;
        left: 196rpx;
        color: #FFF;
        border-radius: 10rpx;
    }
</style>