<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="themeColors" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">展品信息</text>
            </view>
		</u-navbar>
        <view class="content">
            <view class="title">
				<view class="colorBox" :style="'background:'+ themeColors" />
				<text>公司信息</text>
                <view class="addBtn" :style="'background:'+ themeColors" @tap="navigate('/pages_platform/exhibit/add')">
                    <u-icon name="plus" color="#FFF"></u-icon>
                    <text> 添加产品</text>   
                </view>
               
			</view>
            <u-tabs
                :list="list"
                lineWidth="70rpx"
                lineHeight="6rpx"
                :lineColor="themeColors"
                :activeStyle="activeStyle"
                :inactiveStyle="inactiveStyle"
                :scrollable="false"
                @click="clickTabs"
            />
            <view class="box" v-for="item,index in goodList" :key="index">
                <view class="boxTitle">{{item.goods_name}}</view>
                <view class="boxContent">
                    <view class="logo">
                        <image
                        class="logo"
                        :src="item.goods_img"
                        mode="scaleToFill"
                    />
                    </view>
                   
                    <view class="intro">{{item.goods_dec}}</view>
                </view>
                <view class="boxFooter">
                    <view class="btn" v-if="showBtn == 1||showBtn ==3" style="background-color: #FA5151;" @tap="opGood(4,item.id)">删除</view>
                    <view class="btn" v-if="showBtn ==1||showBtn == 3" style="background-color: #9B9B9B;margin-left: 24rpx;" @tap="navigate('/pages_platform/exhibit/edit?id='+item.id)">修改</view>
                    <view class="btn" v-if="showBtn ==2" style="background-color: #E9B85A;margin-left: 24rpx" @tap="opGood(3,item.id)">下架</view>
                    <view class="btn" v-if="showBtn ==3" style="background-color: #07C160;margin-left: 24rpx" @tap="opGood(2,item.id)">上架</view>
                </view>
            </view>
            <u-loadmore marginTop="30" v-if="!showqs" :status="status" fontSize="32" />
            <view class="list" v-if="showqs">
                <image
                    class="quesheng"
                    :src="qusheng"
                    mode="aspectFit"
                />
            </view>
        </view>
        <u-back-top :scroll-top="scrollTop" bottom="250"></u-back-top>
    </view>
</template>

<script>
import { getMyGoodList , opMyGood } from "@/api/v2"
import qusheng from "@/static/quesheng.png"
export default {
    data() {
    return {
        qusheng:qusheng,
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
        // showList:true,
        showBtn:2,
        page:1,
        showqs:false,
        list: [
        {
          name: "已上架",
          status:2
        },
        {
          name: "待上架",
          status:3
        },
        {
          name: "待审核",
          status:1
        },
      ],
      goodList:[],
      scrollTop:"",
      upstatus:'loadmore',
    }
    },
    onShow() {
        uni.showLoading({title: "加载中",});
        getMyGoodList({
            status:this.showBtn,
            page:1
        }).then((res)=>{
            this.goodList = res.data.data
            if(res.data.data.length == 0){
                    this.showqs = true
            }else if(res.data.data.length < 15){
                this.upstatus = "nomore";
            }
          
            uni.hideLoading();
        })
    },
    onPageScroll(event) {
        //顶部导航渐变 从无到有
        this.scrollTop = event.scrollTop; // 更新页面滚动高度
	},
    onReachBottom(){
		this.scrolltolower()
	},
    methods:{
        back() {
            uni.navigateBack();
        },
        opGood(status,id){
            opMyGood({id:id,status:status}).then((res)=>{
                let index = this.goodList.findIndex(item => item.id == id)
                this.goodList.splice(index,1)
                if(this.goodList.length ==0){
                    this.showqs = true
                }
                uni.showToast({
                    title: res.msg,
                    icon: 'none',
                    mask: true
                })
                
            })
        },
        navigate(url){
            uni.navigateTo({ url: url })
        },
       scrolltolower(){
            uni.showLoading({title: "加载中",});
            this.page++
            getMyGoodList({
                status:this.showBtn,
                page:this.page
            }).then((res)=>{
                res.data.data.map((item)=>{
                    this.goodList.push(item)
                })  
                if (res.data.data.length < 15) {
                        this.upstatus = "nomore";
                    }
                uni.hideLoading();
                })
       },
        clickTabs(e) {
            this.upstatus = "loadmore";
            this.goodList.length =0
            this.showBtn = e.status;
            getMyGoodList({
                    status:this.showBtn,
                    page:1
                }).then((res)=>{
                    this.goodList = res.data.data
                    if(res.data.data.length == 0){
                        this.showqs = true
                    }else{
                        this.showqs = false
                    }
                    if (res.data.data.length < 15) {
                        this.upstatus = "nomore";
					}
                    uni.hideLoading();
                 })
           
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
	}
    .box{
        background: #FFF;
        border-radius: 20rpx;
        padding:20rpx 32rpx;
        margin-bottom: 20rpx;
        .boxTitle{
            font-size: 28rpx;
            line-height: 40rpx;
            margin-bottom: 16rpx;
        }
        .boxContent{
            display: flex;
            align-items: center;
            .logo{
                width: 168rpx !important;
                height: 168rpx;
                border-radius: 20rpx;
            }
            .intro{
                font-size: 24rpx;
                margin-left: 48rpx;
            }
        }
        .boxFooter{
            margin-top: 20rpx;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .btn{
                color: #FFF;
                padding: 10rpx 30rpx;
                border-radius: 10rpx;
                font-size: 24rpx;
            }
        }
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

    ::v-deep .u-tabs{
        margin-bottom:42rpx ;
    }
</style>