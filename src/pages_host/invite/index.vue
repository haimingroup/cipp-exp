<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="themeColors" placeholder  @leftClick="back">
            <view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">我的邀请</text>
            </view>
        </u-navbar>
        <view class="content">
            <view class="integralBox">
                <view class="have">
                    <view>已登记</view>
                    <view style="margin-top: 16rpx; font-size: 48rpx;">{{info.count}}</view>
                </view>
                <u-line length="128rpx" colo="#D2D2D2" margin="0 64rpx 0 150rpx " direction="col"></u-line>
                <view class="have">
                    <view>已到场</view>
                    <view style="margin-top: 16rpx; font-size: 48rpx;">{{info.verify}}</view>
                </view>
            </view>
            <view class="listBox" >
                <view class="list" v-for="item,index in list" :key="index">
                    
                    <view style="font-size:28rpx;width: 120rpx;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                        <text>{{ item.user_one.nickname }}</text>
                    </view>
					<view> {{ item.user_one.phone.substr(0,3) + "****" + item.user_one.phone.substr(7) }}</view>
					<view style="color:#B9B9B9">{{ item.created_at.slice(0,10) }}</view>
                </view>
                <u-loadmore marginTop="30" :status="status" fontSize="32" />
            </view>
			<view class="bottomBtn" :style="'background:'+ themeColors" @tap="showPop=true">
				分享邀请
			</view>
			<view>
			<u-popup :show="showPop" safeAreaInsetBottom @close="close">
				<view class="popTitle">分享至</view>
				<view class="sharePop">
					<button class='shareOpen' open-type="share">
						<view>
							<img src="../../pages_platform/static/wx.png" class="shareImg" alt="">
						</view>
						<view>微信好友</view>
					</button>
					<button class='shareOpen' @tap="checkShare">
						<view>
							<img src="../../pages_platform/static/friend.png" class="shareImg" alt="">
						</view>
						<view>生成小程序码</view>
					</button>
				</view>
			</u-popup>
			<u-popup :show="showlp" :safeAreaInsetBottom="false" mode="center"  @close="showlp = false">
				<view class="lpBox">
					<!-- <lime-painter  :postInfo="postInfo" /> -->
					<image
						:src="info.qr_code_mini_url"
						style="width: 430rpx; height: 430rpx;"
						mode="scaleToFill"
					/>
					<l-painter css="width: 430rpx; height:430rpx; " 
						custom-style="position: fixed; left: 200%"
						@fail="fail"
						@done="done"
						pathType="url"
						ref="poster"
						performance
					>
						<l-painter-image :src="info.qr_code_mini_url" css="width: 430rpx; height:430rpx; "/>
					</l-painter>
					<view class="save" :style="'background:'+ themeColors" @click="save">保存到相册</view>
				</view>
			</u-popup>
		</view>
        </view>
        <u-back-top :scroll-top="scrollTopu" bottom="250"></u-back-top>
   </view>
</template>

<script>
import{getStaffTeamUserTotal, getStaffTeamUserList, getTeamShare} from '@/api/host'

export default {
    data() {
    return {
      themeColors: uni.getStorageSync('color'),
      info:{},
      list:[],
	  showPop:false,
	  showlp:false,
      page:1,
	  picture2:'',
      status: "loadmore",
    }
    },
    async onLoad(){
        uni.showLoading({
				title: "加载中",
		});
        await getStaffTeamUserTotal({exhibit_id: uni.getStorageSync('exhibit_id')}).then((res)=>{
            this.info = res.data
        })
        await getStaffTeamUserList({exhibit_id: uni.getStorageSync('exhibit_id'),page:this.page}).then((res)=>{
			if(res.code ==0){
				uni.showToast({
					title: res.msg,
					icon: 'none',
					mask: true
				})
			}else{
				this.list = res.data.data
				if(res.data.data.length<15){
					this.status = 'nomore'
				}
				
			}	
         
			uni.hideLoading();
        })
       
    },
	onShareTimeline() {
		(res) => {
			return {
			title: "邀您参观!",
			path:
				"/pages_index/mine/teamInfo/index?exhibit_id=" +
				uni.getStorageSync("exhibit_id") +
				"&team_id=" +
				this.info.team.enroll_team_id +
				"&share=1",
			};
		};
 	 },
	onShareAppMessage(res) {
			console.log(res)
			if (res.from === "button") {
			// 来自页面内分享按钮
			console.log(res.target);
			}
			return {
			title: '邀您参观',
			path:
				"/pages_index/mine/teamInfo/index?exhibit_id=" +
				uni.getStorageSync("exhibit_id") +
				"&team_id=" +
				this.info.team.enroll_team_id +
				"&share=1",
			};
	},
    onReachBottom(){
		this.scrolltolower()
	},
    methods:{
        scrolltolower(){
            uni.showLoading({
				title: "加载中",
		    });
			this.page++
			getStaffTeamUserList({exhibit_id:uni.getStorageSync("exhibit_id"),page:this.page}).then((res)=>{
				res.data.data.map((item=>{
					this.list.push(item) 
				}))
				if(res.data.data.length<15){
					this.status = 'nomore'
				}
					uni.hideLoading();
			}) 
        },
		fail(v) {
				console.log(v)
			},
		done(v) {
			console.log('绘制完成:',v)
		},
		save() {
				this.$refs.poster.canvasToTempFilePathSync({
					fileType: 'jpg',
					quality: 1,
					success: (res) => {
						console.log(res.tempFilePath)
						this.picture2 = res.tempFilePath
						this.saveImage()
					},
					fail(e) {
						console.log('???????????',e)
					}
				})
			},
			// 保存图征
			saveImage() {
				uni.saveImageToPhotosAlbum({
					filePath: this.picture2,
					success(res) {
						uni.showToast({
							title: '已保存到相册',
							icon: 'success',
							duration: 2000
						});
					},
				});
				
			},
		checkShare(){
			this.showPop= false;
			if(this.info.qr_code_mini_url){
				this.showlp = true
			}else{
				console.log(this.info)
				getTeamShare({enroll_team_id:this.info.team.enroll_team_id}).then((res)=>{
					console.log(res.data.qr_code_mini_url)
					this.info.qr_code_mini_url = res.data.qr_code_mini_url
					this.$refs.poster.canvasToTempFilePathSync({
					fileType: 'jpg',
					quality: 1,
					success: (res) => {
						this.picture2 = res.tempFilePath
						this.showlp = true
					}
				})
				})
			}
		},
        back() {
            uni.navigateBack();
        },
    }
}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 90vh;
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
		}
        .integralBox{
            display: flex;
            padding: 32rpx 64rpx;
            background: #FFF;
            justify-content: space-around;
            font-size: 28rpx;
            border-radius: 20rpx;
        }
        .listBox{
            border-radius: 20rpx;
            background: #FFF;
            padding:32rpx;
            margin-top: 32rpx;
			height: 750rpx;
			overflow: auto;
            .list{
                margin-top: 10rpx;
                padding: 0 16rpx 32rpx;
                border-bottom: 2rpx solid #D2D2D2;
                display: flex;
                justify-content: space-between;
				align-items: center;
            }
        }
    }
	.bottomBtn{
                color: #fff;
				width: 480rpx;
                padding: 12rpx 0;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 20rpx;
				margin: 56rpx auto;
            }
	.popTitle{
		margin: 48rpx;
		font-weight: 600;
	}
	.sharePop{
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		padding-bottom: 30rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
		.shareImg{
			width:112rpx ;
			height: 112rpx;
			margin-bottom: 24rpx;

		}
	}
	.shareOpen{
		outline: none !important;
		border: none;
		overflow: visible;
		background: #fff;
		margin: 0;
		padding: 0;
		line-height: 32rpx !important;
	}
	.save{
		position: absolute;
		bottom: -110rpx;
		padding: 20rpx 36rpx;
		left: 96rpx;
		color: #FFF;
		border-radius: 10rpx;
	}
	button::after {
    	border: none;
  	}
</style>