<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="themeColors"  placeholder  @leftClick="back">
            <view class="navTitle" slot="left"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">参会选择</text>
            </view>
        </u-navbar>
        <view class="content">
            <u-checkbox-group
                v-model="checkList"
                placement="column"
                @change="checkboxChange"
            >
      
            <view class="one" v-for="item,index in list" :key="index">
                <view class="title">
                    <u-checkbox
                        :customStyle="{width: '600rpx',display:'flex',alignItems:'start'}"
                        shape="circle"
                        size="32"
                        iconSize="32"
                        :disabled="Boolean(item.enroll)"
                        labelSize="32rpx"
                        labelColor="#000"
                        :label="item.title"
                        :name="item.activity_id"
                    >
                    </u-checkbox>
                    <view v-if="item.price" class="price">
                        ¥{{item.price}}
                    </view>
                </view>
                <view class="dec" v-if="checkList.includes(item.activity_id)">
                    权益说明
                    <view v-for="info,index1 in item.equities" :key="index1">
                        {{ info.title }}
                    </view>
                </view>
            </view>
        </u-checkbox-group>
        </view>
        <view class="footer"> 
            <view class="submitBtn"  :style="`background:`+themeColors" @tap="topay">
                去支付
            </view>
        </view>
    </view>
    
</template>

<script>
import {getExhibitActivities,enrollActivities,verifyTicketBySelf} from "@/api/combination"
export default {
    data(){
        return{
            themeColors: uni.getStorageSync('color'),
            list:[],
            pay:'',
            money:0,
            checkList:[],
        }
    },
    onLoad(options){
       
        uni.showLoading({
				title: "加载中",
		});
        getExhibitActivities({exhibit_id:uni.getStorageSync('exhibit_id')}).then((res)=>{
            this.list = res.data.activities
            if(options.activity_id){
                this.list.map((item)=>{
                    if(item.activity_id == options.activity_id){
                        this.checkList.push(item.activity_id)
                        this.money =  Number(item.price)
                        console.log(this.checkList)
                    }
                    
                })
            }
            this.pay = res.data.pay
            uni.hideLoading();
        })
    },
    methods:{
        topay(){
            if(this.pay == 1 ){
                uni.navigateTo({ url: '/pages_index/pay/index?check='+this.checkList})
            }
            else if(this.pay==0 && this.money != 0){
                uni.navigateTo({ url: '/pages_index/pay/index?pic=1&check='+this.checkList})
            }else if(this.pay== 0 && this.money == 0){
               if(this.checkList.length!= 0){
                enrollActivities({exhibit_id:uni.getStorageSync('exhibit_id'),activity_ids:this.checkList.join()}).then((res)=>{
                    if(res.code ==1){
                        uni.showToast({
                            title: '报名成功',
                            icon: 'none',
                            mask: true
                        })
                        if(uni.getStorageSync("self_write_off")){
                            verifyTicketBySelf({exhibit_id:uni.getStorageSync('exhibit_id')}).then(((res)=>{
                                uni.removeStorageSync('self_write_off')
                                uni.switchTab({ url: '/pages/center/index' })
                            }))
                        }
                    }
                })
               }else{
                uni.showToast({
                            title: '请选择报名活动',
                            icon: 'none',
                            mask: true
                        })
               }
            }
            else {
                uni.showToast({
                            title: '出错了，请联系管理员',
                            icon: 'none',
                            mask: true
                        })
            }
        },
        checkboxChange(detail){
            console.log(detail,this.checkList)
            this.money = 0
            this.list.map((item=>{
                for(let i in detail){
                    if(item.activity_id == detail[i]){
                        
                        this.money = Number(this.money) + Number(item.price)
                    }
                }
            }))
        },
        back(){
            uni.navigateBack({
                fail:()=>{
                    uni.switchTab({ url: '/pages/index/index' })
                }
            });
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
        line-height: 36rpx;
        text-align: left;
    }
    .content{
        padding: 50rpx 32rpx 132rpx ;
        .one{
            background: #FFF;
            border-radius: 20rpx;
            margin-bottom: 32rpx;
            padding: 32rpx 0;
            .title{
                margin: 0 32rpx;
                display: flex;
                position: relative;
                .price{
                    position: absolute;
                    right: 32rpx;
                }
            }
            .dec{
                margin:24rpx 32rpx;
                color: #7D7D7D;
            }
        }
    }
    .footer{
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 132rpx;
        box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
        background: rgb(255, 255, 255);
        padding-top: 12rpx;
        padding-bottom: 0;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: calc(env(safe-area-inset-bottom));
        .submitBtn{
            width:498rpx;
            height: 80rpx;
            color: #FFF;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20rpx;
        }
    }
</style>