<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="bgColor" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">联系人信息</text>
            </view>
		</u-navbar>
        <view class="content">
            <view class="title">
				<view class="colorBox" :style="'background:'+ bgColor" />
				<text>联系人</text>
                <view class="addBtn" :style="'background:'+ themeColors" @tap="navigateTo('/pages_platform/relation/add')">
                    <u-icon name="plus" color="#FFF"></u-icon>
                    <text> 添加联系人</text>   
                </view>
			</view>
            <view class="box">
                <view class="one" v-for="(item,index) in list" :key="index">
                    <view class="left">
                        <view>
                            <text style="color:#000">{{ item.nickname }}</text>
                            <text style="margin-left:16rpx ;">{{item.phone}}</text>
                        </view>
                        <view style="margin-top: 48rpx;">{{item.id_card}}</view>
                    </view>
                    <view class="right">
                        <view style="text-align: right;" 
                        :style="item.type==0? 'color:#E9B85A' : 'color: #9b9b9b' "
                        >{{item.type==0?'管理员':'员工'}}</view>
                        <view class="editBtn" @tap.stop="navigateTo('/pages_platform/relation/edit?id='+item.id)">修改信息</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import{getMyStoreUser} from '@/api/v2'
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
        getMyStoreUser({page:1}).then((res)=>{
            this.list = res.data.data
            for(let i in this.list){
                if( this.list[i].id_card){
                    this.list[i].id_card = this.list[i].id_card.replace(/(.{6}).*(.{4})/, '$1********$2')
                }
            }
            console.log(this.list)
            uni.hideLoading();
        })
    },
    methods:{
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
            .addBtn{
                padding: 10rpx 30rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                border-radius: 20rpx;
                right: 0;
                color: #FFF;
                font-size: 28rpx;
                text{
                    line-height: 38rpx;
                    margin-left: 8rpx;
                }
            }
		}
        .box{
           
            .one{
                background: #FFF;
                 border-radius: 20rpx;
                 padding:20rpx 32rpx;
                display: flex;
                justify-content: space-between;
                margin-bottom: 32rpx;
                .left{
                    color: #9B9B9B;
                }
                .right{
                   
                    .editBtn{
                        color: #FFF;
                        background: #9B9B9B;
                        padding: 8rpx 22rpx;
                        margin-top:82rpx;
                        border-radius: 20rpx;
                    }
                }
            }
        }
	}
</style>