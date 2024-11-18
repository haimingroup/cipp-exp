<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="themeColors" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">参赛信息</text>
            </view>
		</u-navbar>
        <view class="content">
            <view class="title">
				<view class="colorBox" :style="'background:'+ themeColors" />
				<text>参赛产品</text>
                <view class="addBtn" :style="'background:'+ themeColors" @tap="navigate('/pages_platform/match/rank')">
                    <u-icon name="plus" color="#FFF"></u-icon>
                    <text>查看排行榜</text>   
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

            <view v-if="showBtn ==0">
                <view class="box" v-for="item,index in goodList" :key="index">
                    <view class="boxTitle">{{item.goods_one.goods_name}}</view>
                    <view class="boxContent">
                        <view class="logo">
                            <image
                            class="logo"
                            :src="item.goods_one.goods_img"
                            mode="scaleToFill"
                        />
                        </view>
                        <view class="status">
                            <text v-if="item.status == 0" style="color:#E9B85A">审核中</text>
                            <text v-else style="color:#07C160">参赛中</text>
                        </view>
                        <view class="intro">{{item.goods_one.goods_dec}}</view>
                    </view>
                    <view class="boxFooter">
                        <view class="btn" style="background-color: #9B9B9B" @tap="open(item.id)">取消参赛</view>
                    </view>
                   
                </view>
            </view>
            <view v-else-if="showBtn == 1">
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
                        <view class="btn" style="background-color: #07C160" @tap="opGood(1,item.id)">提交参赛</view>
                    </view>
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
        <u-modal :show="showModal" showCancelButton  content='取消后无法再次参赛,确定取消?' @cancel="showModal = false" @confirm="opGood(2,item.id)"></u-modal> 
        <u-back-top :scroll-top="scrollTop" bottom="250"></u-back-top>
    </view>
</template>

<script>
import { getMyUpGoods , getMyContestGoods,addMyContestGoods,cancel } from "@/api/match"
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
        showBtn:0,
        page:1,
        showqs:false,
        showModal:false,
        list: [
        {
          name: "参赛产品",
          status:0
        },
        {
          name: "未参赛产品",
          status:1
        },
      ],
      config_id:'',
      goodList:[],
      scrollTop:"",
      closeID:'',
      upstatus:'loadmore',
    }
    },
    onLoad(options) {
        uni.showLoading({title: "加载中",});
        this.config_id = options.id
        getMyContestGoods({ config_id : this.config_id}).then((res)=>{
            this.goodList = res.data
            if(res.data.length == 0){
                     this.showqs = true
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
            uni.switchTab({ url: '/pages/mine/index' });
        },
        open(id){
            this.closeID = id
            this.showModal = true
        },
        opGood(status,id){
            if(status == 1){
                addMyContestGoods({config_id:this.config_id,goods_id:id}).then((res)=>{
                  
                    uni.showToast({
                            title:res.msg,
                            icon:'none'
                        }) 
                    if(res.code !== 0){
                        let index = this.goodList.findIndex((el)=>{
                            return el.id == id
                        })
                    // 
                        this.goodList.splice(index,1)
                    }
                   
                })
            }else if(status == 2){
                cancel({contest_id:id}).then((res)=>{
                   
                    uni.showToast({
                            title:res.msg,
                            icon:'none'
                        }) 
                    if(res.code !== 0){
                        let index1 = this.goodList.findIndex((el)=>{
                           return id == el.id
                        })
                        console.log(index1)
                        this.goodList.splice(index1,1)
                    }
                })
            }
        },
        navigate(url){
            uni.navigateTo({ url: url })
        },
       scrolltolower(){
            if( this.showBtn == 1){
                if( this.upstatus == "nomore"){
                    return
                }
                uni.showLoading({title: "加载中",});
                this.page++
                getMyUpGoods({
                    config_id:this.config_id,
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
            }
       },
        clickTabs(e) {
            this.upstatus = "loadmore";
            uni.showLoading({title: "加载中",});
            // this.goodList.length = 0
            this.showBtn = e.status;
            if(e.status == 1){
                getMyUpGoods({config_id : this.config_id}).then((res)=>{
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
            }else if(e.status ==0){
                getMyContestGoods({ config_id : this.config_id}).then((res)=>{
                    this.goodList = res.data
                   
                    if( this.goodList.length == 0){
                            this.showqs = true
                    }
                    uni.hideLoading();
                })
            }
          
           
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
        position: relative;
        .status{
                position: absolute;
                font-size: 24rpx;
                top: 24rpx;
                right: 32rpx;
            }
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