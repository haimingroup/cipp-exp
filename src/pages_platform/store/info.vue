<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="bgColor" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">资产信息</text>
            </view>
		</u-navbar>
        <view class="content">
            <view class="title">
				<view class="colorBox" :style="'background:'+ themeColors" />
				<text>公司信息</text>
			</view>
            <u--form
				labelPosition="left"
				:model="cerform"
				ref="uForm"
                labelWidth="130rpx"
		    >
                <view class="box">
                    <u-form-item label="品牌名称" ref="item1">
                        <text>{{}}</text>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="公司简介">
                        <u--textarea v-model="cerform.name"  border="bottom" placeholder="请输入内容" autoHeight ></u--textarea>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="Logo上传">
                       <u-upload
                            :fileList="cerform.image"
                            @afterRead="afterRead"
                            @delete="deletePic"
                            name="1"
                            width="144"
	                        height="144"
                            multiple
                            :maxCount="1"
                            :previewFullImage="true"
                        ></u-upload>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="公司图片">
                        <u-upload
                            :fileList="cerform.image"
                            @afterRead="afterRead"
                            @delete="deletePic"
                            name="2"
                            width="144"
	                        height="144"
                            multiple
                            :maxCount="3"
                            :previewFullImage="true"
                        ></u-upload>
                    </u-form-item>
                </view>
             </u--form>
        </view>
        <view class="footer">
            <view class="subBtn" :style="'background:'+ themeColors">
                提交
            </view>
        </view>
    </view>
</template>

<script>
import {getMyStore,} from "@/api/v2";
export default {
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
        bgColor: uni.getStorageSync('color'),
        cerform:{}
    }
    },
    onLoad(){
        uni.showLoading({
				title: "加载中",
			});
        getMyStore({}).then((res)=>{
            this.cerform = res.data
            uni.hideLoading();
        })
    },
    methods:{
        back() {
            uni.navigateBack();
        },
        deletePic(event) {
				this[`cerform.image${event.name}`].splice(event.index, 1)
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
        .box{
            background: #FFF;
            border-radius: 20rpx;
            padding: 24rpx;
            margin-bottom: 32rpx;
        }
	}
    .footer{
        display: flex;
        justify-content: center;
        align-items: center;
       
        .subBtn{
            margin: 0 auto;
            padding: 10rpx 70rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 20rpx;
            color: #FFF;
            font-size: 28rpx;
        }
    }

    ::v-deep .u-form-item__body{
        padding: 0 !important;
    }
    ::v-deep .u-upload__button{
        .u-icon{
            text{
                font-size: 40rpx !important;
            }
        }
    }
</style>