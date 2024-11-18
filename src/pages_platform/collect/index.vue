<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="themeColors" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">我的收藏</text>
            </view>
		</u-navbar>
        <view class="content">
            <view class="title">
				<view class="colorBox" :style="'background:'+ themeColors" />
				<text>收藏列表</text>
			</view>
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
           
            <view class="box" v-if="list.length !== 0 && current == 0">
                <exhibitBox  v-for="item,index in list" :key="index" :item="item" />
            </view>
            <view class="box" v-if="list.length !== 0 && current == 1">
                <productBox  v-for="item1,index1 in list" :key="index1" :item="item1.goods_one" />
            </view>
            <view class="list" v-if="list.length == 0">
                <image
                    class="quesheng"
                    src="@/static/quesheng.png"
                    mode="aspectFit"
                />
            </view>
        </view>
    </view>
</template>

<script>
import exhibitBox from "../../components/exhibitorBox.vue";
import productBox from "../../components/productBox.vue";

import {getCollectionStore,getCollectionGoods} from '@/api/v2.js'
export default {
    components:{exhibitBox,productBox},
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
        inactiveStyle: {
            color: this.themeColors,
            fontSize: "32rpx",
            lineHeight: "46rpx",
            paddingRight: "10rpx",
        },
        activeStyle: {
            color: this.themeColors,
            fontSize: "32rpx",
            lineHeight: "46rpx",
            paddingRight: "10rpx",
        },
        list:[],
        current:0,
        tabList: [
            {
                name: "收藏展商",
            },
            {
                name: "收藏产品",
            }
        ],
        page:1,
        gPage:1,

    }
    },
    onLoad(){
        this.page = 1
        this.gPage = 1
        getCollectionStore({page:this.page , exhibit_id:uni.getStorageSync('exhibit_id')}).then((res)=>{
            this.list = res.data.data
        })
    },
    onReachBottom(){
			this.scrolltolower()
		},
    methods:{
        back() {
            uni.navigateBack();
        },
        scrolltolower(){
            if(this.current == 0){
                this.page ++
                getCollectionStore({page:this.page, exhibit_id:uni.getStorageSync('exhibit_id') }).then((res)=>{
                    this.list = res.data.data
                })
            }else if(this.current == 1){
                this.gPage++
                getCollectionGoods({page: this.gPage, exhibit_id:uni.getStorageSync('exhibit_id')}).then((res)=>{
                    this.list = res.data.data
                })
            }
        },
        clickTabs(e){
            this.list = []
            this.current =e.index
            if(e.index == 0){
                getCollectionStore({page:1, exhibit_id:uni.getStorageSync('exhibit_id'),}).then((res)=>{
                    this.list = res.data.data
                })
            }else if(e.index == 1){
                getCollectionGoods({page:1, exhibit_id:uni.getStorageSync('exhibit_id'),}).then((res)=>{
                    this.list = res.data.data
                    console.log( this.list.length !== 0 && this.current == 0 )
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
            padding:20rpx 32rpx;
            margin-top: 40rpx;
        }
        .list{
            padding: 30rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .quesheng {
                width: 116rpx;
            }
        }
	}
</style>