<template>
   <view class="page">
        <u-navbar :fixed="true" :bgColor="themeColors"  @leftClick="back">
            <view class="navTitle" slot="left"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">扫码核销</text>
            </view>
        </u-navbar>
        <view class="banner">
			<image style="width: 750rpx; height: 532rpx" :src="imgSrc" mode="scaleToFill" />
		</view>
        <view class="content">

            <view class="scan" @tap="check">
                <u-icon name="scan" size="200" color="#FFF"></u-icon>
            </view>
            <view class="list">
                <view class="" hover-class="none" hover-stop-propagation="false">
                    
                </view>
                <view class="title">
                    <view class="colorBox" :style="'background:'+ themeColors" />
                    <text>核销历史</text>
                    <view class="more" @tap="more = true">
                        更多>>
                    </view>
			    </view>
                <view class="oneTable" v-for="item,index in list" :key="index" @tap="more = true">
                    <view class="one" style=" text-align: start;">
                        {{item.user_info_one.name}}
                    </view>
                    <view class="one" style=" text-align: start;">
                        {{item.user_info_one.position}}
                    </view>
                    <view class="one" style=" text-align: center;">
                        {{item.created_at.slice(5)}}
                    </view>
                </view>
            </view>
            <u-popup :show="more" safeAreaInsetTop closeable round="20" @open="open" @close="close">
            <view>
               <view class="popBox">
                <scroll-view  scroll-y="true"  style="height:100%" @scrolltolower="handle">
                    <u-cell-group>
                        <u-cell
                            v-for="item1,index1 in infoList"
                            :key="index1"
                            @tap="toInfo(item1)"
                            :title="item1.user_info_one.name+' / '+item1.user_info_one.position"
                            :label="item1.created_at.slice(5)"
                            center
                        >
                            <view slot="value" :style="'color:'+themeColors">查看详情 </view>
                        </u-cell>
                    </u-cell-group>
                    <u-loadmore fontSize="32" :status="status" />
                </scroll-view>
               
               </view>
            </view>
		</u-popup>
        </view>
   </view>
</template>

<script>
import{getVerifyTicketList} from '@/api/combination'
export default {
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
        imgSrc: uni.getStorageSync("ceilingImg"),
        infoList:[],
        list:[],
        more:false,
        page:1,
        status:'loadmore',
    }
    },
    onShow() {
        uni.showLoading({title: "加载中"});
        getVerifyTicketList({exhibit_id:uni.getStorageSync('exhibit_id'),page:this.page}).then((res)=>{
            if( res.data.data.length<5){
                this.list = res.data.data
            }else{
                this.list = res.data.data.slice(0,5)
            }
            uni.hideLoading();
        })
    },
   
    methods:{
        toInfo(el){
            uni.navigateTo({ url: '/pages_host/verification/info?show=1&id='+el.enroll_user_id })
        },
        check(){
            uni.scanCode({
                onlyFromCamera: true,
                success: function (res) {
                    uni.navigateTo({ url: '/pages_host/verification/info?card_num='+ res.result})
                }
            });
        },
        open(){
            uni.showLoading({title: "加载中"});
            getVerifyTicketList({exhibit_id:uni.getStorageSync('exhibit_id'),page:this.page}).then((res)=>{
            this.infoList = res.data.data
            if( res.data.data.length<15){
                 this.status = 'nomore'
            }
            uni.hideLoading();
        })
        },
        handle() {
            // 滚动到底部时触发的操作
            if( this.status = 'nomore' ){
                return
            }else{
                uni.showLoading({title: "加载中"});
                this.status = 'loading'
                this.page++
                getVerifyTicketList({exhibit_id:uni.getStorageSync('exhibit_id'),page:this.page}).then((res)=>{
                    res.data.data.map((item)=>{
                        this.infoList.push(item)
                    })
                    if( res.data.data.length<15){
                        this.status = 'nomore'
                    }
                    uni.hideLoading();
                })
            }
        },
        close(){
            this.more = false;
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

<style lang="scss" scoped>
    .page{
        min-height: 100vh;
        background: #EFEFEF;
        // padding-bottom: 0;
        // padding-bottom: constant(safe-area-inset-bottom);
        // padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
    }
    .navTitle {
        display: flex;
        color: rgb(255, 255, 255);
        font-size: 36rpx;
        font-weight: 700;
        line-height: 36rpx;
        text-align: left;
    }
    .banner {
		width: 750rpx;
		height: 532rpx;
		background-color: #999999;
	}

    .scan{
        width: 360rpx;
        height: 360rpx;
        border-radius: 360rpx;
        background: #FFCC84;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 140rpx auto 0;
        box-shadow: 0 2rpx 20rpx #00000025;
    }
    .list{
        background: #FFF;
        width: 654rpx;
        padding: 32rpx;
        margin: 100rpx auto;
        border-radius: 20rpx;
        .title {
			display: flex;
			align-items: center;
			color: rgb(3, 3, 3);
			font-size: 32rpx;
			font-weight: 500;
			line-height: 58rpx;
			letter-spacing: 0px;
			margin-bottom: 30rpx;
            position: relative;
			.colorBox {
				width: 12rpx;   
				height: 32rpx;
				margin-right: 20rpx;
			}
		}
        .more{
            font-size: 28rpx;
            color: #7d7d7d;
            position: absolute;
            right: 32rpx;
        }
    }
    .oneTable{
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        .one{
            flex: 1;
           
        }
    }
    .popBox{
        height: 70vh;
        overflow: auto;
        padding: 50rpx 32rpx 0;
    }
    
</style>