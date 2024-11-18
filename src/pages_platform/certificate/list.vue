<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="themeColors" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">参展服务</text>
            </view>
		</u-navbar>
        <view class="content">
            <view class="title">
				<view class="colorBox" :style="'background:'+ themeColors" />
				<text>选择联系人</text>
			</view>
            <view class="box">
                 <u-checkbox-group  v-model="checkList" shape="circle" size="32rpx" iconSize="32" :activeColor="themeColors"   placement="column"  @change="checkboxChange">
                <view class="one" v-for="(item,index) in list" :key="index">
                    <u-checkbox :name="item.id"></u-checkbox>
                    <view class="left">
                        <view>
                            <text style="color:#000">{{ item.nickname }}</text>
                            <text style="margin-left:16rpx ;">{{item.phone}}</text>
                        </view>
                        <view style="margin-top: 24rpx;">{{item.id_card||""}}</view>
                        <!-- .replace(/(.{6}).*(.{4})/, '$1********$2') -->
                    </view>
                </view>
                </u-checkbox-group>
            </view>
        </view>
        <view class="footer" :style="'background:'+ themeColors" @tap="add">
            <text>添加</text>
        </view>
    </view>
</template>

<script>
import{getStoreUserList,addStoreExhibitCards} from '@/api/v2'
export default {
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
        list:[],
        checkList:[],
    }
    },
    onShow(){
        uni.showLoading({title: "加载中",});
        getStoreUserList({exhibit_id:uni.getStorageSync('exhibit_id')}).then((res)=>{
            this.list = res.data
            uni.hideLoading();
        })
    },
    methods:{
        checkboxChange(e){
            console.log('change',e);
            console.log('list',this.checkList)
        },
        add(){
            addStoreExhibitCards({exhibit_id:uni.getStorageSync('exhibit_id'),ids:this.checkList.join()}).then((res)=>{
                uni.showToast({
                    title: res.msg,
                    icon: 'none',
                    mask: true
                })
                if(res.code !== 0){
                    setTimeout(()=>{
                        this.back()
                    },2000)
                }
            })
        },
        back() {
            uni.navigateBack({
                fail:()=>uni.switchTab({url:'/pages/index/index'})
            });
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
    ::v-deep  .one{
                background: #FFF;
                border-radius: 20rpx;
                height: 184rpx;
                padding:0 32rpx;
                display: flex;
                align-items: center;
                margin-bottom: 32rpx;
                .left{
                    color: #9B9B9B;
                    margin-left: 44rpx;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
            }
</style>