<template>
     <view class="page">
        <u-navbar :fixed="true" :bgColor="themeColors" placeholder  @leftClick="back">
            <view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">返回首页</text>
            </view>
        </u-navbar>
        <view class="content">
            <u-icon name="checkmark-circle-fill" color="#159E4D" size="148"></u-icon>
            <text>提交成功,等待人工审核</text>
            <view class="backbtn" :style="'background:'+ themeColors" @tap="back">
                返回首页
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
    }
    },
    methods:{
        back(){
            uni.switchTab({ url: '/pages/index/index' })
        }
    }

}
</script>

<style  lang="scss" scoped>
      .page{
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
    .content{
        padding:100rpx 30rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text{
            font-size: 36rpx;
            margin: 24rpx 0 36rpx;
        }
        .backbtn{
            margin: 0 auto;
            padding: 10rpx 70rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 20rpx;
            color: #FFF;
            font-size: 28rpx;
        }
    }
</style>