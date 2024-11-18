<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar
      :fixed="true"
      :bgColor="themeColors"
      placeholder
      @leftClick="back"
    >
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">产品审核</text>
      </view>
    </u-navbar>
    <view class="content">
      <view class="box" v-for="item,index in list" :key="index" @tap="click(item)">
        <view class="right">
            <image :src="item.goods_img" mode="scaleToFill"/>
        </view>
        <view class="left">
          <view class="title">{{ item.goods_name }}</view>
          <view class="info">
            <text class="time">{{ item.tags_name }}</text>
            <text class="type" :style="'color:' + themeColors"></text>
          </view>
        </view>
        <view class="status">
            <text  style="color:#E9B85A">待审核</text>
        </view>
      </view>
      <view v-if="list.length == 0" style="margin:20rpx auto;color: #7d7d7d;text-align: center;">
            暂无审核数据
        </view>
    </view>
    <u-popup :show="showPop" @close="()=>{showPop = false}">
           <view class="popBox">
            <u--form
                labelPosition="left"
                :model="form"
                ref="uForm"
                labelWidth="130rpx"
                >
                <view class="box">
                    <u-form-item label="产品名称" ref="item1">
                        <u--input
                                v-model="form.goods_name"
                                placeholder="请输入信息"
                                border="bottom"
                        ></u--input>
                    </u-form-item>
                </view>
                <view class="box" @tap="getTag">
                    <u-form-item label="产品标签">
                        <u--input
                                v-model="form.tags_name"
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
                    <u-form-item label="产品简介">
                        <u--textarea v-model="form.goods_dec"  border="bottom" placeholder="请输入内容" autoHeight ></u--textarea>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="产品主图">
                        <view style="display: flex;">
                            <view class="imgsBox" v-if="form.goods_img">
                                <image
                                  class="upImg"
                                  :src="form.goods_img"
                                  mode="aspectFit"
                                />
                                <view class="delBtn" @tap="del(item,0)">
                                    <u-icon name="close" color="#FFF" size="16rpx"></u-icon>
                                </view>
                            </view>
                            <view class="upBox" @tap="select(0)" v-if="!form.goods_img">
                                <u-icon name="plus" color="#FFF"></u-icon>
                            </view>
                        </view>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="产品图片">
                        <view style="display: flex;">
                            <view class="imgsBox"  v-for="item,index in form.goods_imgs" :key="index">
                                <image
                                class="upImg"
                                :src="item"
                                mode="aspectFit"
                                />
                                <view class="delBtn" @tap="del(index,1)">
                                    <u-icon name="close" color="#FFF" size="16rpx"></u-icon>
                                </view>
                            </view>
                           
                            <view class="upBox" @tap="select(1)" v-if="form.goods_imgs <= 2">
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
  <ksp-cropper mode="ratio" :width="700" :height="700" :maxWidth="700" :maxHeight="700" :url="imgUrl"  @cancel="oncancel"  @ok="onok"></ksp-cropper>
  <ksp-cropper mode="ratio" :width="700" :height="700" :maxWidth="700" :maxHeight="700" :url="imgsUrl" @cancel="oncancel" @ok="onok1"></ksp-cropper>
  </view>
</template>
  
  <script>
    import {getVerifyStoreGoods,getVerifyStoreGoodInfo,verifyStoreGood} from "@/api/host.js";
    import {fileUp,getGoodTags} from "@/api/v2"
    import config from "@/utils/config"

    export default {
    data() {
        return {
            themeColors: uni.getStorageSync("color"),
            form: {},
            showPop:false,
            showPop1:false,
            list: [],
            path:'',
            path2:[],
            page:1,
            tagList:[],
            cerform:{
              exhibit_id: uni.getStorageSync("exhibit_id"),
              store_id:'',
              id:'',
              goods_name:'',
              goods_dec:'',
              goods_img:'',
              goods_imgs:[],
              tag_name:'',
              goods_specs:'',
            },
            imgUrl:'',
            imgsUrl:'',
            current:'',
        };
    },
    onReachBottom(){
        uni.showLoading({
            title: '加载中',
            mask: true
        })
        this.page++
        getVerifyStoreGoods({ exhibit_id: uni.getStorageSync('exhibit_id'),page:this.page,}).then((res)=>{
            res.data.data.map((item) => {
				this.list.push(item)
			})
            uni.hideLoading();
        })
    },
    onLoad() {
        uni.showLoading({
            title: '加载中',
            mask: true
        })
        getVerifyStoreGoods({ exhibit_id: uni.getStorageSync('exhibit_id'),page:this.page,}).then((res)=>{
            this.list = res.data.data
            uni.hideLoading();
        })
	  },
    methods: {
        click(item){
            uni.showLoading({
            title: '加载中',
            mask: true
        })
            getVerifyStoreGoodInfo({
                exhibit_id: uni.getStorageSync('exhibit_id'),
                store_id:item.store_id,
                id: item.id
            }).then((res)=>{
                this.form = res.data
                this.current =  res.data.tags_name
                this.showPop = true;
                uni.hideLoading();
            })  
        },
        select(type){
            uni.chooseImage({
                    count: 1,
                    success: (rst) => {
                        // 设置url的值，显示控件
                        if(type ==0){
                            this.imgUrl = rst.tempFilePaths[0];
                        }
                        else if(type ==1){
                            this.imgsUrl = rst.tempFilePaths[0];
                        }
                    }
                });
        },
        onok(e) {
            this.imgUrl = "";
            this.path=e.path;
            let url = "data:image/jpeg;base64," + uni.getFileSystemManager().readFileSync(e.path, "base64");
             fileUp({type:1,img:url}).then((res)=>{
                    this.cerform.goods_img = res.data.url
                })
        },
        onok1(e){
            this.imgsUrl = "";
            this.path2.push(e.path) ;
            let url = "data:image/jpeg;base64," + uni.getFileSystemManager().readFileSync(e.path, "base64");
            fileUp({type:1,img:url}).then((res)=>{
                this.cerform.goods_imgs.push (res.data.url)
            })
        },
        del(index,type){
            if(type == 0){
                this.form.goods_img =''
            }else{
                this.form.goods_imgs.splice(index,1)
            }
        },
        confirm(){
            let obj={
                exhibit_id: uni.getStorageSync("exhibit_id"),
                store_id:this.form.store_id,
                id:this.form.id,
                goods_name:this.form.goods_name,
                goods_dec:this.form.goods_dec,
                goods_img:this.form.goods_img,
                goods_imgs:this.form.goods_imgs.join(),
                tag_name:this.form.tags_name,
                goods_specs:this.form.goods_specs,
            }
            verifyStoreGood(obj).then((res)=>{
                if(res.code==1){
                    uni.showToast({
                        title: '审核成功',
                        icon: 'none',
                        mask: true
                    })
                    getVerifyStoreGoods({ exhibit_id: uni.getStorageSync('exhibit_id'),page:this.page,}).then((res)=>{
                        this.list = res.data.data
                        this.showPop = false
                    })
                }else{
                    uni.showToast({
						title: res.msg,
						icon: 'none',
						mask: true
					})
                }
            })
        },
        oncancel() {
            this.imgUrl = "";
            this.imgsUrl = "";
        },
        getTag(){
            getGoodTags({obj_id:config.obj_id}).then((res)=>{
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
        navigator(url) {
            uni.navigateTo({
                url: url,
            });
        },
        back() {
            uni.navigateBack();
        },
    },
    };
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
  .content {
    padding: 48rpx 30rpx;
    .box{
      background: #FFF;
      border-radius: 20rpx;
      padding:28rpx 32rpx;
      margin-bottom: 20rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      .left {
      width: 350rpx;
      .title {
        color: rgb(51, 51, 51);
        font-size: 32rpx;
        font-weight: 400;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .info {
        display: flex;
        justify-content: space-between;
        margin-top: 40rpx;

        .type {
          font-size: 24rpx;
          font-weight: 400;
          line-height: 36rpx;
        }

        .time {
          color: rgb(153, 153, 153);
          font-size: 24rpx;
          font-weight: 400;
          line-height: 36rpx;
          width: 350rpx; /* 定义容器的宽度 */
          height: 36rpx; /* 自动调整高度 */
          overflow: hidden; /* 当内容超出容器时进行隐藏 */
          white-space: nowrap; /* 不换行 */
          text-overflow: ellipsis; /* 使用省略号表示被隐藏的部分 */
        }
      }
    }

    .right {
      width: 160rpx;
      margin-right: 30rpx;
      height: 160rpx;
      background: #333;
      border-radius: 10rpx;
      overflow: hidden;
      image {
        width: 160rpx;
        height: 160rpx;
      }
    }
    .status{
          position: absolute;
          font-size: 24rpx;
          top: 28rpx;
          right: 32rpx;
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
        padding: 0 32rpx ;
        
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
            font-size: 28rpx;
            text-align: center;
            padding: 20rpx 30rpx;
            border: 2rpx solid #ccc;
            border-radius: 20rpx;
            margin-bottom: 20rpx;
            overflow: hidden; /* 当内容超出容器时进行隐藏 */
            white-space: nowrap; /* 不换行 */
            text-overflow: ellipsis; /* 使用省略号表示被隐藏的部分 */
    }
    //上传图标
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
    ::v-deep .u-popup__content__close{
        .u-icon__icon{
            font-size: 38rpx !important;
        }
    }
</style>