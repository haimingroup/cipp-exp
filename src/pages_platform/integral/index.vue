<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="themeColors" placeholder  @leftClick="back">
            <view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">我的积分</text>
            </view>
        </u-navbar>
        <view class="content">
            <view class="title">
				<view class="colorBox" :style="'background:'+ bgColor" />
				<text>我的积分</text>
			</view>
            <view class="integralBox">
                <view class="have">
                    <view>当前可用</view>
                    <view style="margin-top: 16rpx; font-size: 48rpx;">{{info.total}}</view>
                </view>
                <u-line length="128rpx" colo="#D2D2D2" margin="0 64rpx 0 150rpx " direction="col"></u-line>
                <view class="have">
                    <view>未来7天即将过期</view>
                    <view style="margin-top: 16rpx; font-size: 48rpx;">{{info.dying_period}}</view>
                </view>
            </view>
            <u-tabs
                :list="tablist"
                lineWidth="70rpx"
                lineHeight="6rpx"
                :lineColor="themeColors"
                :activeStyle="activeStyle"
                :inactiveStyle="inactiveStyle"
                :scrollable="false"
                @click="clickTabs"
            />
            <view class="listBox" v-if="current == 1">
                <view class="list" v-for="item,index in list" :key="index">
                    <view>
                        <view>{{ item.remark }}</view>
                        <view style="margin-top: 16rpx;color:#B9B9B9">{{ item.created_at }}</view>
                    </view>
                    <view style="font-size:36rpx;text-align: center;display: flex;align-items: center;">
                        <text v-if="item.type==10">+</text>
                        {{ item.value }}
                    </view>
                </view>
                <u-loadmore marginTop="30" :status="status" fontSize="32" />
            </view>
            <view class="listBox" v-if="current == 2">
                <view class="list" v-for="item,index in list2" :key="index">
                    <view >
                       <view>{{ item.remark }}</view>
                        <view style="margin-top: 16rpx;color:#B9B9B9">{{ item.created_at }}</view>
                    </view>
                    <view style="font-size:36rpx;display: flex;align-items: center;">
                        <text v-if="item.type==10">+</text>
                        <text>{{ item.value }}</text>
                    </view>
                </view>
                <u-loadmore marginTop="30" :status="status2" fontSize="32" />
            </view>
        </view>
        <u-back-top :scroll-top="scrollTopu" bottom="250"></u-back-top>
   </view>
</template>

<script>
import{getScoreLog,getBalance} from '@/api/v2'
import config from '@/utils/config'
export default {
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
        inactiveStyle: {
            color:"#B9B9B9",
            fontSize: "32rpx",
            lineHeight: "46rpx",
            paddingRight: "10rpx",
        },
        activeStyle: {
            color:uni.getStorageSync('color'),
            fontSize: "32rpx",
            lineHeight: "46rpx",
            paddingRight: "10rpx",
        }, 
        tablist: [
        {
          name: "已获得",
          status:1,
        },
        {
          name: "已使用",
          status:2
          
        }
      ],
      current:1,
      info:{},
      list:[],
      list2:[],
      page:1,
      page2:1,
      status: "loadmore",
      status2: "loadmore",
    }
    },
    async onLoad(){
        uni.showLoading({
				title: "加载中",
		});
        await getBalance({obj_id:config.obj_id}).then((res)=>{
            this.info = res.data
        })
        await getScoreLog({obj_id:config.obj_id,type:1,page:1}).then((res)=>{
            this.list = res.data.data
            if(res.data.data.length<15){
                this.status = 'nomore'
            }
        })
        await getScoreLog({obj_id:config.obj_id,type:2,page:1}).then((res)=>{
            this.list2 = res.data.data
            if(res.data.data.length<15){
                this.status2 = 'nomore'
            }
            uni.hideLoading();
        })
    },
    onReachBottom(){
		this.scrolltolower()
	},
    methods:{
        scrolltolower(){
            uni.showLoading({
				title: "加载中",
		    });
            if(this.current ==1){
                this.page++
                getScoreLog({obj_id:config.obj_id,type:1,page:this.page}).then((res)=>{
                    res.data.data.map((item=>{
                        this.list.push(item) 
                    }))
                    if(res.data.data.length<15){
                        this.status = 'nomore'
                    }
                     uni.hideLoading();
                }) 
            }else{
                this.page2++
                getScoreLog({obj_id:config.obj_id,type:1,page:this.page2}).then((res)=>{
                    res.data.data.map((item=>{
                        this.list2.push(item) 
                    }))
                    if(res.data.data.length<15){
                        this.status2 = 'nomore'
                    }
                     uni.hideLoading();
                }) 
            }
        },
        navigate(url){
            uni.navigateTo({ url: url })
        },
        clickTabs(e) {
            this.current = e.status
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
        .integralBox{
            display: flex;
            padding: 32rpx 64rpx;
            background: #FFF;
            justify-content: center;
            font-size: 28rpx;
            border-radius: 20rpx;
        }
        .listBox{
            border-radius: 20rpx;
            background: #FFF;
            padding:32rpx;
            margin-top: 32rpx;
            .list{
                margin-top: 10rpx;
                padding: 0 16rpx 32rpx;
                border-bottom: 2rpx solid #D2D2D2;
                display: flex;
                justify-content: space-between;
            }
        }
    }
</style>