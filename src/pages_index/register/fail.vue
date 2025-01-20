<template>
    <view class="page">
       <u-navbar :fixed="true" :bgColor="themeColors" placeholder  @leftClick="back">
           <view class="navTitle" slot="left" :style="'color:' + titleColor"> 
               <u-icon name="arrow-left" color="#FFF"></u-icon>
               <text style="margin-left: 10rpx">返回首页</text>
           </view>
       </u-navbar>
       <view class="content">
           <u-icon name="error" color="#F0C873" size="148"></u-icon>
           <text>审核未通过</text>
           <text style="font-size: 28rpx;">很抱歉，您提报的信息不符合专业观众登记要求</text>
           <view class="btnBox">
                <view class="backbtn" :style="'background:'+ themeColors" @tap="contactUs">
                    联系我们
                </view>
                <view class="backbtn" :style="'margin-left: 50rpx;background:'+ themeColors" @tap="goOn">
                    继续登记
                </view>
           </view>
           
       </view>
   </view>
</template>

<script>
import {getMyTicket,editProStatus} from "@/api/register";
export default {
   data() {
   return {
       themeColors: uni.getStorageSync('color'),
   }
   },
   methods:{
        async goOn(){
            await editProStatus({exhibit_id:uni.getStorageSync('exhibit_id')}).then(res=>{
                if(res.code == 0){
                    uni.showToast({
                        title: res.msg,
                        icon: 'none',
                        mask: true
                    })
                    return;
                }
            })
            await getMyTicket({
                    exhibit_id: uni.getStorageSync("exhibit_id"),
                    }).then((res) => {
                        this.lock = false;
                        if(res.code == 0||res.code == -1){
                            uni.showToast({
                                title: res.msg,
                                icon: 'none',
                                mask: true
                            })
                            return;
                        }
                        if (res.code == 1) {
                            uni.navigateTo({
                                    url: "/pages/center/index",
                            });
                        }
                    })
        },
        contactUs(){
            uni.navigateTo({ url: '/pages_index/mine/contact/' })
        },
       back(){
           uni.switchTab({ url: '/pages/index/index' })
       }
   }

}
</script>

<style  lang="scss" scoped>
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
       padding:100rpx 30rpx;
       display: flex;
       justify-content: center;
       align-items: center;
       flex-direction: column;
       text{
           font-size: 36rpx;
           margin: 24rpx 0 36rpx;
       }
       .btnBox{
        display: flex;
        margin-top:60rpx;
        justify-content: center;
        align-items: center;
        .backbtn{
           padding: 10rpx 70rpx;
           display: flex;
           justify-content: center;
           align-items: center;
           border-radius: 20rpx;
           color: #FFF;
           font-size: 28rpx;
       }
       }
       
   }
</style>