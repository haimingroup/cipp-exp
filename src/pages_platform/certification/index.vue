<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="bgColor" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">资质信息</text>
            </view>
		</u-navbar>
        <view class="content">
            <view class="title">
				<view class="colorBox" :style="'background:'+ bgColor" />
				<text>基本信息</text>
			</view>
            <view class="box">
                <view class="cell">
                    <text class="ctitle">公司名称</text>
                    <text class="cContent">{{ info.q_name }}</text>
                </view>
                <view class="cell">
                    <text class="ctitle">税号</text>
                    <text class="cContent">{{ info.q_credit_code }}</text>
                </view>
                <view class="cell">
                    <text class="ctitle">法人</text>
                    <text class="cContent">{{ info.q_oper_name }}</text>
                </view>
                <view class="cell">
                    <text class="ctitle">地址</text>
                    <text class="cContent"> {{ info.q_address }}</text>
                </view>
                <view class="cell">
                    <text class="ctitle">成立日期</text>
                    <text class="cContent">{{ info.q_start_date }}</text>
                </view>
                <view class="cell">
                    <text class="ctitle">登记状态</text>
                    <text class="cContent">{{ info.q_status }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import{getCompanyInfo} from '@/api/v2'
export default {
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
        bgColor: uni.getStorageSync('color'),
        info:{},
    }
    },
    onLoad(options) {
        getCompanyInfo().then((res)=>{
            this.info  = res.data;
            console.log(this.info)
            
        })
    },
    methods:{
        back() {
            uni.navigateBack();
        },
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
        color: rgb(255, 255, 255);
        font-size: 36rpx;
        font-weight: 700;
        line-height: 36rpx;
        text-align: left;
    }
    .content {
		padding:48rpx 30rpx;

		.title {
			display: flex;
			align-items: center;
			color: rgb(3, 3, 3);
			font-size: 40rpx;
			font-weight: 500;
			line-height: 58rpx;
			letter-spacing: 0px;
			margin-bottom: 30rpx;

			.colorBox {
				width: 12rpx;
				height: 40rpx;
				margin-right: 20rpx;
			}
		}
        .box{
            background: #FFF;
            border-radius: 20rpx;
            padding: 24rpx;
            margin-bottom: 32rpx;
            .cell{
                display: flex;
                align-items: center;
                margin-bottom: 24rpx;
                .ctitle{
                    font-size: 28rpx;
                    font-weight: 600;
                    width: 120rpx;
                    text-align: left;
                    margin-right:48rpx;
                }
                .cContent{
                    width: 462rpx;
                    color: #7F7F7F;
                }
            }
        }
	}
</style>