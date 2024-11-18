<template>
    <view class="page">
        <!-- 顶部标题栏 -->
        <u-navbar :fixed="true" placeholder :bgColor="themeColors" @leftClick="back">
        <view class="navTitle" slot="left">
            <u-icon name="arrow-left" color="#FFF"></u-icon>
            <text style="margin-left: 10rpx">我的客户</text>
        </view>
        </u-navbar>
        <view class="content">
            <view class="clientBox" v-for="item,index in list" :key="index">
                <view>
                    <view class="name">{{ item.store_one.company_name}}</view>
                    <view class="type">
                        <text>{{ item.m2 }}m²</text>
                        <text v-if="item.booth_type ==1">标展</text>
                        <text v-else-if="item.booth_type ==2">豪展</text>
                        <text v-else-if="item.booth_type ==3">特装</text>
                    </view>
                    
                </view>
                <view class="changeBtn" :style="'background:'+ themeColors" @tap="open(item.store_id,item.store_one.company_name)"> 
                        切换
                </view>
            </view>
        </view>
        <u-modal 
            :show="showModal"  
            showCancelButton 
            :content='content'
            @confirm="changeUser"
            @cancel="showModal=false"
        ></u-modal>
    </view>
</template>

<script>
import {getStoreList,loginStore} from "@/api/host.js";

export default {
    data() {
        return {
            themeColors: uni.getStorageSync('color'),
            list:[],
            showModal:false,
            changeId:'',
            content:'',
            page:1,
        }
    },
    onReachBottom(){
        uni.showLoading({
            title: '加载中',
            mask: true
        })
        this.page++
        getStoreList({
            exhibit_id: uni.getStorageSync('exhibit_id'),
            status:0,
            page:this.page,
        }).then((res)=>{
            res.data.data.map((item) => {
				this.list.push(item)
			})
            uni.hideLoading();
        })
    },
    onLoad(){
        uni.showLoading({
            title: '加载中',
            mask: true
        })
        getStoreList({
            exhibit_id: uni.getStorageSync('exhibit_id'),
            status:0,
            page:this.page,
        }).then((res)=>{
            this.list = res.data.data;
            uni.hideLoading();
        })
    },
    methods:{
        open(id,name){
            this.showModal = true;
            this.content =  `确认切换到`+name+`账号下么？`;
            this.changeId = id;
        },
        changeUser(id){
            loginStore({ exhibit_id: uni.getStorageSync('exhibit_id'),store_id:this.changeId}).then((res)=>{
                console.log(res.data)
                this.showModal = false;
                uni.setStorageSync('token', res.data)
                uni.switchTab({ url: '/pages/mine/index' })
            })
        },
        back() {
				uni.navigateBack();
			},
    }
}
</script>

<style lang="scss" scoped>
    .page {
		min-height: 90vh;
		background: rgb(239, 239, 239);
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
	}
    .navTitle {
		display: flex;
		align-items: center;
		color: rgb(255, 255, 255);
		font-size: 36rpx;
		font-weight: 700;
		line-height: 36rpx;
		text-align: left;
	}
    .content{
        padding: 52rpx 32rpx;
        .clientBox{
            padding:28rpx 24rpx ;
            background: #FFF;
            border-radius: 20rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24rpx;
            font-size: 28rpx;
            .name{
                font-weight: 600;
            }
            .type{
                margin-top:20rpx ;
                color: #7F7F7F;
            }
            .changeBtn{
                color: #fff;
                padding: 10rpx 24rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 20rpx;
            }
        }
    }
</style>