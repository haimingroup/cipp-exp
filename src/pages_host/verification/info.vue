<template>
  <view class="page">
        <u-navbar :fixed="true" :bgColor="themeColors"  placeholder  @leftClick="back">
            <view class="navTitle" slot="left"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">核销详情</text>
            </view>
        </u-navbar>
        <view class="content">
                <view class="one">
                    <view class="title">
                        <view class="colorBox" :style="'background:'+ themeColors" />
                        <text>票据信息</text>
                    </view>
                    <view class="li">姓名 : {{ info.user_info_one.name }}</view>
                    <view class="li">手机号 : {{ info.user_info_one.phone}}</view>
                    <view class="li">公司职位 : {{ info.user_info_one.company_name }}</view>
                    <view class="li">门票类型 : <text v-if="info.people_num">{{ info.people_num }}人票</text><text v-else>单人票</text></view>
                    <view class="li">已核销次数 : {{ info.verify_times||0 }}次</view>
                </view>
                <view class="one" style="margin-top: 30rpx;" v-if="info.activities">
                    <view class="title">
                        <view class="colorBox" :style="'background:'+ themeColors" />
                        <text v-if="showFooter">选择可核销信息</text>
                        <text v-else>全部信息</text>
                    </view>
                    <u-checkbox-group
                        v-model="checkList"
                        :disabled="!showFooter"
                        placement="column"
                       
                    >
                    <view class="act" v-for="item,index in info.activities" :key="index">
                        <view>{{ item.title }}</view>
                        <view class="equ">
                            <u-checkbox
                                :customStyle="{marginTop: '20rpx'}"
                                size="32"
                                shape="circle"
                                iconSize="32"
                                labelSize="32rpx"
                                labelColor="#000"
                                v-for="item1 in item.equities" 
                                :disabled="Boolean(item1.type)"
                                :key="item1.activity_id"
                                :label=" item1.title "
                                :name="item1.activity_equity_id"
                            >
                            </u-checkbox>
                        </view>
                        <u-line margin="20rpx 0"></u-line>
                    </view>
                  
                    </u-checkbox-group>
                </view>

        </view>
        <view class="footer" v-if="showFooter">
            <view class="submit" @tap="finish">核销完成</view>
            <view class="submit" :style="'background:'+ themeColors" @tap="finish(1)">继续核销</view>
        </view>
  </view>
</template>

<script>
import {getVerifyTicketInfo,verifyTicketInfo} from "@/api/combination"
export default {
    data(){
        return{
            themeColors: uni.getStorageSync('color'),
            info:{},
            checkList: [],
            showFooter:true,
        }
    },
    onLoad(options){
        if(options.show){
            this.showFooter = false;
        }
        let obj= {}
        if(options.id){
            obj.enroll_user_id = options.id
        }else if(options.card_num){
            obj.card_num = options.card_num
        }
        getVerifyTicketInfo(obj).then((res)=>{
            this.info = res.data
        })
    },
    methods:{
        finish(status){
            verifyTicketInfo({enroll_user_id:this.info.enroll_user_id,activity_equity_ids:this.checkList.join(", ")}).then((res)=>{
                if(status == 1){
                    uni.scanCode({
                    onlyFromCamera: true,
                    success: function (res) {
                        uni.navigateTo({ url: '/pages_host/verification/info?card_num='+ res.result})
                    }
                });
                }else{
                    this.back()
                }
            })
                
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
    .content{
        padding: 50rpx 32rpx;
        .one{
            background: #FFF;
            border-radius: 20rpx;
            margin-bottom: 50rpx;
            padding: 32rpx;
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
            .li{
                font-size: 30rpx;
                margin-top: 24rpx;
                margin-left: 20rpx;
            }
            .act{
                margin-left: 20rpx;
                .equ{
                    margin: 0  0 0 20rpx;
                }
            }
        }
    }
    .footer{
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        .submit{
            width: 252rpx;
            height: 80rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20rpx;
            background: #818181;
            color: #FFF;
        }
    }
</style>