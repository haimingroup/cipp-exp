<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="bgColor" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">参展服务</text>
            </view>
		</u-navbar>
        <view class="content">
            <view class="title">
				<view class="colorBox" :style="'background:'+ bgColor" />
				<text>展商证件</text>
			</view>
            <view class="box" style="display: flex;" v-if="list.length == 0">  
                <u-icon  name="minus-circle-fill" color="#7F7F7F"></u-icon>
                <text style="margin-left: 24rpx;">暂未添加展商证，请尽快提交</text>
            </view>
            <view class="list">
                <view class="one" v-for="(item,index) in list" :key="index">
                    <view class="left">
                        <view>
                            <text style="color:#000">{{ item.store_user_one.nickname }}</text>
                            <text style="margin-left:16rpx ;">{{item.store_user_one.phone}}</text>
                        </view>
                        <view style="margin-top: 48rpx;">{{item.store_user_one.id_card.replace(/(.{6}).*(.{4})/, '$1********$2')}}</view>
                    </view>
                    <view class="right">
                        <view style="text-align: center;color:#FFF;border-radius:20rpx" 
                        :style="item.status==0? 'background:#FA5151' : 'background: #07C160' "
                        >{{item.status==0?'未领取':'已领取'}}</view>
                        <view class="editBtn" @tap.stop="cancel(item.id)">取消</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="footer" :style="'background:'+ themeColors" @tap="navigateTo('/pages_platform/certificate/list')">
            <text>添加展商证</text>
        </view>
    </view>
</template>

<script>
import{getStoreExhibitCards,delStoreExhibitCards} from '@/api/v2'
export default {
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
        bgColor: uni.getStorageSync('color'),
        list:[],
    }
    },
    onShow(){
        uni.showLoading({title: "加载中",});
        getStoreExhibitCards({exhibit_id:uni.getStorageSync('exhibit_id')}).then((res)=>{
            this.list = res.data
            uni.hideLoading();
        })
    },
    methods:{
        cancel(id){
            delStoreExhibitCards({exhibit_id:uni.getStorageSync('exhibit_id'),id:id}).then(res=>{
                uni.showToast({
                    title: res.msg,
                    icon: 'none',
                })
                if(res.code !==0){
                   let num = this.list.findIndex((item)=>{
                        return item.id ==id
                    })
                    this.list.splice(num,1)
                }
            })

            
        },
        back() {
            uni.navigateBack();
        },
        navigateTo(url){
            uni.navigateTo({
                url: url,
            })
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
            position: relative;
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
        }
        .list{
            .one{
                background: #FFF;
                border-radius: 20rpx;
                height: 184rpx;
                padding:20rpx 32rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 32rpx;
                .left{
                    color: #9B9B9B;
                }
                .right{
                   display: flex;
                   flex-direction: column;
                   justify-content: center;
                   align-content: space-between;
                    .editBtn{
                        color: #FFF;
                        background: #9B9B9B;
                        padding: 8rpx 44rpx;
                        margin-top:70rpx;
                        border-radius: 20rpx;
                    }
                }
            }
        }
	}
    .footer{
        position: fixed;
        bottom: 0;
        width: 750rpx;
        padding-top: 26rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFF;
        font-size: 32rpx;
        padding-bottom: 0;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        
    }
</style>