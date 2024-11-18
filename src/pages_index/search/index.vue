<template>
  <view class="page">
    <u-navbar :fixed="true" :bgColor="bgColor" placeholder @leftClick="back">
    <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">搜索</text>
    </view>
    </u-navbar>
    <view class="search">
        <view style="margin-right: 20rpx;display:flex;align-items: center;"  @tap="showType =true">
            <text style="margin-right: 10rpx;font-size: 28rpx;">
            {{ pickerText }}
            </text>
            <u-icon :name="showType?'arrow-up':'arrow-down'" size="24"></u-icon>
        </view>
        <view class="type" v-if="showType">
            <view class="item"  @tap="changeText(1)">展商</view>
            <view class="item"  @tap="changeText(2)">
                展品
            </view>
        </view>
		<u-search 
            shape="square" 
            borderColor="rgb(191, 195, 204)" 
            height="64"
            placeholder="请输入展商/展品名称" 
            v-model="keyword" 
            :actionStyle="actionStyle"
            @custom="custom"
        >
        </u-search>
	</view> 
    <view class="recentSearch">
        <text class="title">最近搜索</text>
        <u-divider></u-divider>
        <view class="listBox">
            <view class="listItem" v-for="item,index in rsList" :key="index" @tap="tokeyWord(item)">{{ item }}</view>
        </view>
    </view>
  </view>
</template>

<script>

export default {
    data() {
    return {
        imgSrc: uni.getStorageSync("ceilingImg"),
        bgColor: uni.getStorageSync('color'),
        rsList:uni.getStorageSync('rsList')||[],
        pickerText: '展商',
        checkBoxNum:1,
        keyword:'',
        showType:false,
        //搜索按钮控件样式
        actionStyle:{
            color: "#FFF",
            fontSize: "32rpx",
            borderRadius: '8rpx',
            background:uni.getStorageSync('color'),
            padding:'12rpx 16rpx',
        },
    }
    },
    methods: {
        tokeyWord(item){
            this.keyword = item
        },
        changeText(num){
            this.checkBoxNum = num
            if(num == 1){
                this.pickerText = '展商'
            }else if(num ==2){
                this.pickerText = '展品'
            }
            this.showType = false
        },
        back() {
            uni.navigateBack();
        },
        custom(){
            if(this.rsList.length > 6){
                this.rsList.pop()
            }
            for(let i in this.rsList){
                if(this.rsList[i] ==this.keyword){
                    this.rsList.splice(i,1)
                }
            }
            this.rsList.unshift(this.keyword)
            uni.setStorageSync('rsList', this.rsList)
            uni.setStorageSync('keyword',this.keyword)
            if(this.checkBoxNum == 1){
                uni.setStorageSync('current',0)
            }else if(this.checkBoxNum == 2){
                uni.setStorageSync('current',1)
            }
            uni.switchTab({ url: '/pages/exhibitor/index'})
        }
        
    }
}
</script>

<style lang="scss" scoped>
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
    .search{
        display:flex;
        margin-top: 20rpx;
        padding: 30rpx;
        height: 64rpx;
        position: relative;
        .type{
            position: absolute;
            background: #FFF;
            font-size: 28rpx;
            bottom: -6vh;
            left: 20rpx;
            border-radius: 0  0 20rpx 20rpx;
            .item{
                padding: 10rpx 30rpx;
                font-size: 28rpx;
                text-align: center;
                border-radius: 0  0 20rpx 20rpx;
            }
        }
    }
    .recentSearch{
         margin-top: 46rpx;
        padding: 0 30rpx;
        color: rgba(0, 0, 0, 0.6);
        .title{
            font-size: 24rpx;
            line-height: 34rpx;
        }
        .listBox{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .listItem{
                width: 45%;
                margin-bottom: 20rpx;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
</style>