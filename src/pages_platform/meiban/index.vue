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
				<text>楣板提交</text>
			</view>
            <view class="box" >
                <view style="display: flex;">
                    <u-icon :name="form.lintel_status == 2?`checkmark-circle-fill`:`minus-circle-fill`" :color="form.lintel_status == 2?`#07C160`:`#7f7f7f`"></u-icon>
                    <view style="margin-left: 24rpx;">
                        <text v-if="form.lintel_status == 0">信息未提交，请尽快完善信息</text>
                        <text v-if="form.lintel_status == 1">信息待审核，请等待审核</text>
                        <text v-if="form.lintel_status == 2">信息已提交</text>
                    </view>
                </view>
                <view style="margin: 16rpx 0 0 24rpx;font-size: 24rpx;color: #7f7f7f;">
                    <text>您可于开展前10天修改已提交的楣板信息，过时如需修改，请联系您的销售人员</text>
                </view>
            </view>
            <u--form
				labelPosition="left"
				:model="form"
				ref="uForm"
                labelWidth="140rpx"
		    >
                <view class="box">
                    <u-form-item label="中文楣板" ref="item1">
                        <u--input
                                v-model="form.lintel_cn"
                                placeholder="请输入信息"
                                :disabled ='disable'
                                border="bottom"
                        ></u--input>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="英文楣板" ref="item1">
                        <u--input
                                v-model="form.lintel_en"
                                placeholder="请输入信息"
                                :disabled ='disable'
                                border="bottom"
                        ></u--input>
                    </u-form-item>
                </view>
             </u--form>
        </view>
        <view class="footer">
            <view class="subBtn" :style="'background:'+ themeColors" @tap="submit">
                提交
            </view>
        </view>
    </view>
</template>

<script>
import {getLintel,saveLintel} from '@/api/v2.js'
export default {
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
        form:{},
        disable:false,
        }
    },
    onShow() {
       this.getlineInfo()
    },
    methods:{
        getlineInfo(){
            uni.showLoading({
				title: "加载中",
			});
            getLintel({exhibit_id:uni.getStorageSync('exhibit_id')}).then((res)=>{
                this.form = res.data
                if(this.form.lintel_status == 2){
                    this.disable = true
                }
                uni.hideLoading();
            })
        },
       
        submit(){
            let obj = {
                exhibit_id:uni.getStorageSync('exhibit_id'),
                lintel_cn:this.form.lintel_cn,
                lintel_en:this.form.lintel_en
            }
            saveLintel(obj).then((res)=>{
                if(res.code == 0){
                    uni.showToast({
                        title: res.msg,
                        icon: 'none',
                        mask: true
                    })
                }else{
                    this.getlineInfo()
                    uni.showToast({
                        title: '提交成功',
                        icon: 'none',
                        mask: true
                    })
                }
            })
        },
        back() {
            uni.navigateBack({fail:()=>uni.switchTab({url:'/pages/index/index'})});
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

			.colorBox {
				width: 12rpx;
				height: 40rpx;
				margin-right: 20rpx;
			}
       
		}
	}
    .box{
            background: #FFF;
            border-radius: 20rpx;
            padding: 24rpx;
            margin-bottom: 32rpx;
        }
    .footer{
        position: fixed;
        bottom: 0;
        width: 750rpx;
        .subBtn{
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
    }
    ::v-deep .u-form-item__body{
        padding: 0 !important;
    }
</style>