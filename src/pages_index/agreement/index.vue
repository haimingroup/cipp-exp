<template>
	<view class="page">
		<u-navbar :fixed="true" placeholder @leftClick="toHome">
			<view class="navTitle" slot="left">
				<u-icon name="home"></u-icon>
				<text style="margin-left: 20rpx">承诺书确认</text>
			</view>
		</u-navbar>
        <view class="content">
            <view class="padding: 0 30rpx">
                <view class="title">{{ info.title }}</view>
                
                <rich-text class="richText" :nodes="info.content"></rich-text>
            </view>
            <view class="form-item"><text style="margin-right: 20rpx">签署日期:</text>{{ time }}</view>
            <view class="form-item"><text style="margin-right: 20rpx">监护人签名:</text> <text @tap="toShouXie">点击添加手动签名</text>
                    </view>
            <view class="form-item">
                <text style="margin-right: 20rpx;">监护人身份证号:</text>
                
                <u--input
                    placeholder="请输入身份证号"
                    border="surround"
                    v-model="value"
                    maxlength="18"
                    @change="change"
                ></u--input>
            </view>

        </view>
	</view>
</template>

<script>
import {getExhibitSign} from '@/api/user.js'
	export default {
		data() {
			return {
				time:'',
                info:{}
			};
		},
		onLoad(option) {
            uni.showLoading({
					title: "加载中",
			});
            let data = new Date();
            this.time = data.toLocaleDateString()
            getExhibitSign({id:option.id||2}).then((res)=>{
                this.info = res.data
                uni.hideLoading();
				
            })
		},
		methods: {
            toHome(){
                uni.switchTab({ url: '/pages/index/index' })
            },
            toShouXie(){
                uni.navigateTo({url:'/pages_index/agreement/shouxie'})
            }
		}
	};
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
		color: #000;
		font-size: 36rpx;
		font-weight: 700;
		line-height: 36rpx;
		text-align: left;
	}
    .content{
        width: 100%;
        background: #FFF;
       
        .title{
            width: 100%;
            text-align: center;
        }
        .form-item{
            font-size: 24rpx;
            display: flex;
            align-items: center;
            padding: 30rpx;
        }
    }
	::v-deep .u-icon {
        padding: 5rpx;
		border: 2rpx solid #ccc;
        border-radius: 50%;
	}
   
</style>