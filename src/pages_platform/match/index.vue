<template>
    <view class="page">
        <u-navbar :fixed="true" bgColor="#FFFFFF00"   @leftClick="back">
                <view class="navTitle" slot="left"> 
                    <u-icon name="arrow-left" color="#FFF"></u-icon>
                    <text style="margin-left: 10rpx">返回</text>
                </view>
        </u-navbar>
        <view class="content">
            <rich-text :nodes="info.dec" :image-menu-prevent="true"></rich-text>
        </view>
        <view class="footer">
            <view class="subBtn" :style="'background:'+ themeColors" @tap="toList">{{ footerContent }}</view>
        </view>
    </view>
</template>

<script>
import {getConfig,addContest} from '@/api/match'
export default {
    data() {
    return {
        footerContent:'我已知晓  立即报名',
        themeColors: uni.getStorageSync('color'),
        info:{},
    }
    },
    onLoad() {
        uni.showLoading({
				title: "加载中",
			});
        getConfig({exhibit_id:uni.getStorageSync("exhibit_id")}).then((res)=>{
                this.info = res.data
                this.info.dec = this.info.dec.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
                if(this.info.contest ==1){
                    this.footerContent = '查看参赛作品'
                }
                uni.hideLoading();
        })
    },
    methods:{
        back() {
            uni.navigateBack({
                fail:()=>{
                    uni.switchTab({ url: '/pages/index/index' })
                }
            });
        },
        toList(){
            if(this.info.contest == 1){
                uni.navigateTo({
                        url:'/pages_platform/match/list?id='+ this.info.id
                })
            }else{
                addContest({config_id:this.info.id}).then((res)=>{
                        uni.showToast({
                            title: res.msg,
                            icon: 'none',
                            mask: true
                        })
                        if(res.code !== 0){
                        setTimeout(()=>{
                        uni.navigateTo({
                            url:'/pages_platform/match/list?id='+ this.info.id
                        })
                        },2000)
                    }
                })
            }
           
           
        }
    }
}
</script>

<style lang="scss" scoped>
    .page{
        min-height: 92vh;
        background: rgb(239, 239, 239);
        padding-bottom: 0;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
    }
    .navTitle {
        display: flex;
        background: #FFFFFF00;
        color: rgb(255, 255, 255);
        font-size: 36rpx;
        font-weight: 700;
        line-height: 36rpx;
        text-align: left;
    }
    .content{
        overflow: auto;
        width: 750rpx;
        img{
            width:100% !important;
            height: auto;
        }
    }
  
    .footer{
        width: 100%;
        position: fixed;
        bottom: 0;
        padding:24rpx 0 12rpx 0;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
        background: #FFF;
        .subBtn{
            margin: 0 auto;
            border-radius: 20rpx;
            width: 592rpx;
            height: 62rpx;
            color: #FFF;
            font-size: 32rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>