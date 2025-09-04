<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="bgColor" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">联系人信息</text>
            </view>
		</u-navbar>
        <view class="content">
            <view class="title">
				<view class="colorBox" :style="'background:'+ bgColor" />
				<text>添加联系人</text>
			</view>
            <view class="box">
                <u--form
				labelPosition="left"
				:model="form"
				ref="uForm"
                labelWidth="150rpx"
                >
                    <u-form-item label="姓名" ref="item1" required>
                        <u--input
                                v-model="form.nickname"
                                placeholder="请输入信息"
                                border="bottom"
                        ></u--input>
                    </u-form-item>
                    <u-form-item label="手机号" ref="item1" required>
                        <u--input
                                v-model="form.phone"
                                placeholder="请输入信息"
                                border="bottom"
                        ></u--input>
                    </u-form-item>
                    <!-- <u-form-item label="密码" ref="item1">
                        <u--input
                                v-model="form.password"
                                placeholder="最少6位,不能含有空格"
                                border="bottom"
                        ></u--input>
                    </u-form-item> -->
                  
                    <u-form-item label="证件类型" ref="item1" required>
                            <u-radio-group
                                v-model="form.card_type"
                                placement="row"
                                iconSize="24"
                                labelSize="32"
                                size="32"
                            >
                            <u-radio
                                :customStyle="{ marginRight: '8px', fontSize: '32rpx' }"
                                iconSize="24"
                                labelSize="32"
                                name="0"
                                label="护照"
                                value="0"
                            />
                            <u-radio
                                :customStyle="{ marginRight: '8px', fontSize: '32rpx' }"
                                iconSize="24"
                                labelSize="32"
                                name="1"
                                label="身份证"
                                value="1"
                            />
                            </u-radio-group>
                    </u-form-item>
                    <u-form-item label="证件号" ref="item1" required>
                        <u--input
                                v-model="form.id_card"
                                placeholder="请输入信息"
                                border="bottom"
                        ></u--input>
                    </u-form-item>
                    <u-form-item label="员工类型" ref="item1" required>
                            <u-radio-group
                                v-model="form.type"
                                placement="row"
                                iconSize="24"
                                labelSize="32"
                                size="32"
                            >
                            <u-radio
                                :customStyle="{ marginRight: '8px', fontSize: '32rpx' }"
                                iconSize="24"
                                labelSize="32"
                                name="0"
                                label="管理员"
                                value="0"
                            />
                            <u-radio
                                :customStyle="{ marginRight: '8px', fontSize: '32rpx' }"
                                iconSize="24"
                                labelSize="32"
                                name="1"
                                label="员工"
                                value="1"
                            />
                            </u-radio-group>
                    </u-form-item>
                    <u-form-item label="部门" ref="item1">
                        <u--input
                                v-model="form.dept"
                                placeholder="请输入信息"
                                border="bottom"
                        ></u--input>
                    </u-form-item>
                    <u-form-item label="职位" ref="item1">
                        <u--input
                                v-model="form.position"
                                placeholder="请输入信息"
                                border="bottom"
                        ></u--input>
                    </u-form-item>
                </u--form>
            </view>
           
        </view>
        <view class="footer">
            <view class="subBtn" :style="'background:'+themeColors" @tap="editSub" >
                确认添加
            </view>
        </view>
    </view>
</template>

<script>
import{addMyStoreUser} from '@/api/v2'
export default {
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
        bgColor: uni.getStorageSync('color'),
        form:{
            nickname:'',
            phone:'',
            password:'',
            dept:'',
            position:'',
            card_type:'',
            id_card:'',
            type:'',
        }

    }
    },
    methods:{
        back() {
            uni.navigateBack();
        },
        editSub(){
            uni.showLoading({title: "加载中",});
            addMyStoreUser(this.form).then((res)=>{
                if(res.code ==0){
                    uni.showToast({
                        title: res.msg,
                        icon: 'none',
                        mask: true
                    })
                }else{
                    uni.showToast({
                        title: '添加成功',
                        icon: 'none',
                        mask: true
                    })
                    this.back()
                }
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
        .box{
            background: #FFF;
            border-radius: 20rpx;
            padding:20rpx 32rpx;
            .one{
                display: flex;
                justify-content: space-between;
                margin-bottom: 32rpx;
                .left{
                    color: #9B9B9B;
                }
                .right{
                   
                    .editBtn{
                        color: #FFF;
                        background: #9B9B9B;
                        padding: 8rpx 22rpx;
                        margin-top:82rpx;
                        border-radius: 20rpx;
                    }
                }
            }
        }
        
	}
    .footer{
        margin-top: 72rpx;
        display: flex;
        .subBtn{
            color: #FFF;
            font-size: 32rpx;
            padding: 20rpx 104rpx;
            margin: 0 auto;
            border-radius: 20rpx;
        }
    }
</style>