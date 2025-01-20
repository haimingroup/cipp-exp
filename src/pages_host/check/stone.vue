<template>
	<view class="page">
		<!-- 顶部标题栏 -->
		<u-navbar :fixed="true" placeholder :bgColor="themeColors" @leftClick="back">
			<view class="navTitle" slot="left">
			<u-icon name="arrow-left" color="#FFF"></u-icon>
			<text style="margin-left: 10rpx">店铺审核</text>
			</view>
		</u-navbar>
	  	<view class="content">
			<view class="mbBox" v-for="item,index in list" :key="index" @tap="click(item)">
				<view class="name">
					{{ item.store_one.company_name}}
				</view>
				<view class="type">
                        <text>{{ item.m2 }}m²</text>
                        <text v-if="item.booth_type ==1">标展</text>
                        <text v-else-if="item.booth_type ==2">豪展</text>
                        <text v-else-if="item.booth_type ==3">特装</text>
                    </view>
				<view class="status">
					<text style="color:#E9B85A">待审核</text>
				</view>
			<view/>
		</view>
		<u-popup :show="showPop" closeable @close="close">
           <view class="popBox">
			<u--form
				labelPosition="left"
				:model="cerform"
				ref="uForm"
                labelWidth="140rpx"
		    >
                <view class="box">
                    <u-form-item label="展商名称" ref="item1">
                        <u--input
                            v-model="cerform.name"
                            placeholder="13字以内海报显示效果最好"
                            border="bottom"
                            :disabled ='disable'
                        ></u--input>
                        <text style="color:#CCC;font-size: 20rpx">最多输入20字</text>
                    </u-form-item>
                    
                </view>
                <view class="box">
                    <u-form-item label="企业/品牌简称" ref="item1">
                        <u--input
                                v-model="cerform.brand_name"
                                placeholder="请输入信息"
                                maxlength="8"
                                border="bottom"
                                :disabled ='disable'
                        ></u--input>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="主营产品" ref="item1">
                        <u--input
                                v-model="cerform.business"
                                placeholder="请输入信息"
                                maxlength="8"
                                border="bottom"
                                :disabled ='disable'
                        ></u--input>
                    </u-form-item>
                </view>
                <view class="box" @tap="getTag">
                    <u-form-item label="店铺标签">
                        <u--input
                                v-model="cerform.tags_name"
                                placeholder="请输入信息"
                                border="bottom"
                                disabled
                        ></u--input>
                    </u-form-item>
                    <u-popup 
                        :show="showPop1" 
                        safeAreaInsetTop 
                        customStyle="{padding:50rpx}"
                        :closeOnClickOverlay="true"
                        closeable
                        @close="showPop1 = false"
                        >
                        <view class="popBox1" > 
                            <u-grid
                                    :border="false"
                            >
                                <u-grid-item
                                    v-for="item,index in tagList" :key="index"
                                    @tap="checkTag(item.tag_name)" 
                                >
                                <view class="tagBox" :style="current == item.tag_name?'padding:22rpx 40rpx;border: none;color:#FFF;background:'+themeColors : ''">
                                    {{ item.tag_name }}

                                </view>
                                </u-grid-item>
                            </u-grid>
                        </view>
                    </u-popup>
                </view>
                <view class="box">
                    <u-form-item label="公司简介">
                        <u--textarea v-model="cerform.dec" maxlength="1000"  :disabled ='disable'  border="bottom" placeholder="请输入内容" autoHeight ></u--textarea>
                    </u-form-item>
                    <text style="margin-left:130rpx;color:#CCC;font-size: 20rpx">最多输入1000字</text>
                </view>
               
                <view class="box">
                    <u-form-item label="Logo">
                        <view style="display: flex;">
                            <view class="imgsBox" v-if="cerform.logo">
                                <image
                                  class="upImg"
                                  :src="cerform.logo"
                                  mode="aspectFit"
                                />
                                <view class="delBtn" @tap="del(0)">
                                    <u-icon name="close" color="#FFF" size="16rpx"></u-icon>
                                </view>
                            </view>
                            <view class="upBox" @tap="select(0)" v-if="!cerform.logo">
                                <u-icon name="plus" color="#FFF"></u-icon>
                            </view>
                        </view>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="公司图片">
						<view style="display: flex;">
                            <view class="imgsBox"  v-for="item,index in cerform.imgs" :key="index">
                                <image
                                class="upImg"
                                :src="item"
                                mode="aspectFit"
                                />
                                <view class="delBtn" @tap="del(index,1)">
                                    <u-icon name="close" color="#FFF" size="16rpx"></u-icon>
                                </view>
                            </view>
                           
                            <view class="upBox" @tap="select(1)" v-if="cerform.imgs.length <= 2">
                                <u-icon name="plus" color="#FFF"></u-icon>
                            </view>
                        </view>
                        <text style="margin-top:30rpx;color:#CCC;font-size: 20rpx">因为图片需要裁剪，请一次上传一张</text>
                    </u-form-item>
                </view>
             </u--form>
				<view class="confirmBtn" :style="'background:'+ themeColors"  @tap="confirm">
					确认
				</view>
		   </view>
		</u-popup>
	</view>
	<ksp-cropper mode="ratio" :width="600" :height="600" :maxWidth="600" :maxHeight="600" :url="logoUrl"  @cancel="oncancel"  @ok="onok"></ksp-cropper>
    <ksp-cropper mode="ratio" :width="375" :height="210" :maxWidth="375" :maxHeight="210" :url="imgsUrl" @cancel="oncancel" @ok="onok1"></ksp-cropper>

    </view>
	
  </template>
  
  <script>
  import {getStoreList,getStoreInfo,verifyStoreInfo} from "@/api/host.js";
  import {fileUp,getStoreTags} from "@/api/v2"
  import config from "@/utils/config"

  export default {
	  data() {
		  return {
			  themeColors: uni.getStorageSync('color'),
			  page:1,
			  list:[],
			  info:{},
			  cerform:{
                exhibit_id: uni.getStorageSync('exhibit_id'),
                store_id:'',
                name:'',
                logo:'',
				imgs:[],
				dec:'',
				brand_name:'',
                business:''
              },
              tagList:[],
              current:'',
			  showPop:false,
			  showPop1:false,
			  logoUrl:'',
			  imgsUrl:'',
		  }
	  },
	  onReachBottom(){
		this.page++;
		uni.showLoading({
				title: '加载中',
				mask: true
			})
		getStoreList({
			exhibit_id: uni.getStorageSync('exhibit_id'),
			status:1,
			page:this.page
		}).then((res)=>{
			res.data.data.map((item) => {
				this.list.push(item)
			})
			uni.hideLoading();
		})
	  },
	  onLoad(){
		this.getlist()
	  },
	  methods:{
		confirm(){
			verifyStoreInfo({
				exhibit_id: uni.getStorageSync('exhibit_id'),
				store_id:this.info.store_id,
				name:this.cerform.name,
				logo:this.cerform.logo,
				imgs:this.cerform.imgs.join(),
				dec:this.cerform.dec,
				brand_name:this.cerform.brand_name,
                business:this.cerform.business
			}).then((res)=>{
				if(res.code == 1){
					this.showPop = false
					this.getlist()
				}else{
					uni.showToast({
						title: res.msg,
						icon: 'none',
						mask: true
					})
				}
			})
		},
		getlist(){
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			getStoreList({
				exhibit_id: uni.getStorageSync('exhibit_id'),
				status:1,
				page:this.page
			}).then((res)=>{
				this.list = res.data.data;
				uni.hideLoading();
			})
		},
		click(item){
			this.showPop = true;
			this.info = item
			getStoreInfo({exhibit_id:uni.getStorageSync('exhibit_id'),store_id:item.store_id}).then((res)=>{
				this.cerform = res.data
                const {name,logo,imgs,dec,brand_name} = res.data
                this.current =  res.data.tags_name
                if(imgs !=null){
                    this.cerform.imgs = JSON.parse(this.cerform.imgs)
                }else{
                    this.cerform.imgs= []
                }
                console.log(this.cerform.imgs)
			})
		},
		select(type){
            uni.chooseImage({
                    count: 1,
                    success: (rst) => {
                        // 设置url的值，显示控件
                        if(type ==0){
                            this.logoUrl = rst.tempFilePaths[0];
                        }
                        else if(type ==1){
                            this.imgsUrl = rst.tempFilePaths[0];
                        }
                    }
                });
        },
		onok(e) {
            this.logoUrl = "";
            uni.showLoading({
				title: '上传中',
				mask: true
			})
            let url = "data:image/jpeg;base64," + uni.getFileSystemManager().readFileSync(e.path, "base64");
             fileUp({type:1,img:url}).then((res)=>{
                    this.cerform.logo = res.data.url
                    uni.hideLoading();
                })
        },
        onok1(e){
            this.imgsUrl = "";
            uni.showLoading({
				title: '上传中',
				mask: true
			})
            let url = "data:image/jpeg;base64," + uni.getFileSystemManager().readFileSync(e.path, "base64");
            fileUp({type:1,img:url}).then((res)=>{
                this.cerform.imgs.push (res.data.url)
                uni.hideLoading();
            })
        },
		del(index,type){
            if(type == 0){
                this.cerform.logo =''
            }else{
                this.cerform.imgs.splice(index,1)
            }
        },
        //店铺标签
        getTag(){
            getStoreTags({obj_id:config.obj_id}).then((res)=>{
                this.tagList =res.data
            })
            this.showPop1 = true
        },
        checkTag(str){
            if(this.current == str){
                this.current = ''
                this.form.tag_name = ''
            }else{
                this.current = str
                this.form.tags_name = str
                this.showPop1 = false
            }
        },
		oncancel() {
            this.imgUrl = "";
            this.imgsUrl = "";
        },
		close(){
			this.showPop = false;
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
		align-items: center;
		color: rgb(255, 255, 255);
		font-size: 36rpx;
		font-weight: 700;
		line-height: 36rpx;
		text-align: left;
	}
	.content{
        padding: 52rpx 32rpx;
        .mbBox{
            padding:28rpx 24rpx ;
            background: #FFF;
            border-radius: 20rpx;
            margin-bottom: 24rpx;
            font-size: 28rpx;
			position: relative;
			.name{
				margin-bottom: 16rpx;
			}
            .type{
                margin-top:20rpx ;
                color: #7F7F7F;
            }
			.status{
				position: absolute;
				top: 28rpx;
				right: 32rpx;
				font-size: 24rpx;
			}
        }
    }
	.popBox{
            height: 65vh;
            overflow: auto;
			font-size: 28rpx;
			display: flex;
			flex-direction: column;
			font-size: 28rpx;
			padding: 0 32rpx 75rpx;
        
			.box{
				background: #FFF;
				border-radius: 20rpx;
				padding: 24rpx;
				margin-bottom: 32rpx;
       		}
			.confirmBtn{
				margin: 0 auto;
				color: #fff;
                padding: 10rpx 40rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 20rpx;
				margin-top: 56rpx;
			}
		}
		.upBox{
      width: 144rpx;
      height: 144rpx;
      border-radius: 20rpx;
      background: #C4C4C4;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .imgsBox{
        display: flex;
        position: relative;
        .upImg{
            width: 144rpx;
            height: 144rpx;
            border-radius: 20rpx;
            margin-right: 20rpx;
        }
        .delBtn{
            width: 32rpx;
            height: 32rpx;
            background: #7F7F7F;
            border-radius: 32rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: -16rpx;
            right: 8rpx;
        }
    }
    .popBox1{
        height: 48vh;
        width: 686rpx;
        overflow: auto;
        padding: 32rpx; 
    }
    //店铺标签
    .tagBox{
            width: 130rpx;
            height: 54rpx;
            line-height: 54rpx;
            text-align: center;
            padding: 20rpx 30rpx;
            border: 2rpx solid #ccc;
            border-radius: 20rpx;
            margin-bottom: 20rpx;
            overflow: hidden; /* 当内容超出容器时进行隐藏 */
            white-space: nowrap; /* 不换行 */
            text-overflow: ellipsis; /* 使用省略号表示被隐藏的部分 */
    }
    ::v-deep .u-popup__content__close{
        .u-icon__icon{
            font-size: 38rpx !important;
        }
    }
  </style>