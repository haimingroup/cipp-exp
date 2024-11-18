<template>
  <view class="page">
    <u-navbar :fixed="true" :bgColor="themeColors" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">任务列表</text>
            </view>
	</u-navbar>
    <view class="content">
        <u-tabs
            :list="tabList"
            lineWidth="70rpx"
            lineHeight="6rpx"
            :current="current"
            :lineColor="themeColors"
            :activeStyle="activeStyle"
            :inactiveStyle="inactiveStyle"
            :scrollable="false"
            @click="clickTabs"
        />
        <view class="title" v-if=" list.must_task.length != 0">
				<view class="colorBox" :style="'background:'+ themeColors" />
				<text>参展任务</text>
		</view>
        <view class="box" v-for="item,index in list.must_task" :key="index">
            <view v-if="current == 0">
                <image :src="item.icon" alt="" class="label"/>
            </view>
            <view style="margin-left: 20rpx;" @tap="popInfo(item.task_id)">
                <view :style="current == 0 ? '' : 'color:#9E9E9E'">{{item.title}}</view>
                <view v-if="current == 0" style="color:#F4734F;font-size: 20rpx;margin-top: 12rpx;">积分+{{item.score_num}}</view>
            </view>
            <view :class=" current==0 ? 'backlog' : 'finish'" :style="current==0 ? 'background:'+ themeColors : ''"  @tap="gettestInfo(item.xcx_url)">
                <text v-if= "current==0">去完成</text>
                <text v-if= "current==1">已完成</text>
            </view>
        </view>
        <view class="title" v-if=" list.exhibit_task.length != 0">
				<view class="colorBox" :style="'background:'+ themeColors" />
				<text>平台任务</text>
		</view>
        <view class="box"  v-for="item,index in list.exhibit_task" :key="index">
            <view v-if="current == 0">
                <image :src="item.icon" alt="" class="label"/>
            </view>
            <view style="margin-left: 20rpx;" @tap="popInfo(item.task_id)">
                <view :style="current == 0 ? '' : 'color:#9E9E9E'">{{item.title}}</view>
                <view v-if="current == 0" style="color:#F4734F;font-size: 20rpx;margin-top: 12rpx;">积分+{{item.score_num}}</view>
            </view>
            <view :class=" current==0 ? 'backlog' : 'finish'" :style="current==0 ? 'background:'+ themeColors : ''" @tap="gettestInfo(item.xcx_url)">
                <text v-if= "current==0">去完成</text>
                <text v-if= "current==1">已完成</text>
            </view>
        </view>
    </view>
    <u-popup :show="show" @close="close">
            <view class="popBox">
                <view  style="margin-bottom:65rpx;">{{ info.title }}</view>
                <view style="margin-bottom:48rpx;">{{ info.dec }}</view>
                <view>
                    <text style="font-size: 72rpx;">{{ '+' + info.score_num }}</text>
                    <text>积分</text>
                </view>
            </view>
	</u-popup>
  </view>
</template>

<script>
import {getList,getInfo} from '@/api/test'
export default {
    data() {
        return{
            themeColors: uni.getStorageSync('color'),
            list:{
                must_task:[],
                exhibit_task:[],
            },
            info:{},
            show:false,
            current:0,
            tabList: [
                {
                    name: "待办任务",
                },
                {
                    name: "已完成",
                }
            ],
            inactiveStyle: {
                fontSize: "32rpx",
                lineHeight: "46rpx",
                paddingRight: "10rpx",
            },
            activeStyle: {
                color:  uni.getStorageSync('color'),
                fontSize: "32rpx",
                lineHeight: "46rpx",
                paddingRight: "10rpx",
            },
        }
    },
    onShow(){
        uni.showLoading({title: "加载中",});
        getList({type:1, exhibit_id:uni.getStorageSync('exhibit_id'),}).then((res)=>{
            this.list = res.data
            uni.hideLoading();
        })
    },
    methods:{
        gettestInfo(url){
            if(this.current==0){
                uni.navigateTo({ url: url })
            }
        },
        popInfo(id){
            if(this.current==0){
                getInfo({task_id:id}).then((res)=>{
                    if(res.code == 0){
                        uni.showToast({
                            title: res.msg,
                            icon: 'none',
                            mask: true
                        })
                    }
                    this.info = res.data
                    this.show = true
                })
            }
        },
        clickTabs(e){
            this.current = e.index;
            uni.showLoading({title: "加载中",});
            this.list = {
                must_task:[],
                exhibit_task:[],
            };
            if(e.index == 0){
                getList({type:1, exhibit_id:uni.getStorageSync('exhibit_id'),}).then((res)=>{
                    this.list = res.data
                    uni.hideLoading();
                })
            }else if(e.index == 1){
                getList({type:2, exhibit_id:uni.getStorageSync('exhibit_id'),}).then((res)=>{
                    this.list = res.data
                    uni.hideLoading();
                })
            }
        },
        close(){
            this.show = false
        },
        back() {
            uni.navigateBack({
                fail:()=>{
                uni.switchTab({ url: '/pages/index/index' })
                }
            });
        },
    }
}
</script>

<style  lang="scss" scoped>
    .page {
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
			font-size: 32rpx;
			font-weight: 500;
			line-height: 48rpx;
			letter-spacing: 0px;
			margin: 44rpx 0 30rpx 0;

			.colorBox {
				width: 12rpx;
				height: 32rpx;
				margin-right: 20rpx;
			}
		}
        .box{
            padding: 24rpx; 
            background: #FFF;
            margin-bottom: 24rpx;  
            position: relative;
            display: flex; 
            align-items: center;
            border-radius: 20rpx;
            .label{
                width: 72rpx;
                height: 86rpx;
            }
            .finish{
               color: #9E9E9E;
               position: absolute;
               right: 24rpx;
            }
            .backlog{
                position: absolute;
                right: 24rpx;
                height: 40rpx;
                padding: 8rpx 16rpx;
                color:#FFF;
                border-radius: 40rpx;
                font-size: 24rpx;
                line-height: 40rpx;
            }
        }
    }
    .popBox{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50rpx 74rpx;
    }
</style>