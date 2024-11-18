<template>
    <view class="page">
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
            <l-painter-view  css="position:absolute;top:388.2rpx; left:140rpx;width:338rpx;height:59.2rpx;line-height:59.2rpx;text-align:center">
                <l-painter-text css="color:#055739;font-size:25.6rpx;" :text="postInfo.store_one.company_name" ></l-painter-text>
            </l-painter-view>
            <l-painter-text :text="postInfo.booth_no" css="position:absolute;top:476rpx;left:340rpx;color:#055739;font-size:35.2rpx"></l-painter-text>
            <l-painter-image :src="postInfo.qr_code_mini_url" css="width: 124.8rpx;height: 124.8rpx; border-radius:50%;position:absolute;top:678.8rpx;left:80.4rpx; "/>
        </l-painter>
        <view class="save" :style="'background:'+ themeColors" @click="save">保存到相册</view>
    </view>
</template>

<script>
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
                this.picture2 = res.tempFilePath
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
                filePath: this.picture2,
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

<style lang="scss" scoped>
    .save{
        position: absolute;
        bottom: -110rpx;
        padding: 20rpx 36rpx;
        left: 196rpx;
        color: #FFF;
        border-radius: 10rpx;
    }
</style>
