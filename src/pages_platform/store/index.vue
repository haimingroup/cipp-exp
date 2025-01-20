<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="bgColor" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">展商信息</text>
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
                <view class="box"  style="display: flex;" v-if="info.status !== 2">
                    <u-icon name="minus-circle-fill" :color="info.status == 1 ? '#E9B85A' : 'red' "></u-icon>
                    <view style="margin-left: 24rpx;">
                        <text v-if="info.status == 1">信息审核中，请耐心等待通过</text>
                        <text v-if="info.status == 3">信息审核失败，请重新提交资料</text>
                    </view>
                   
                </view>
                <view class="box">
                    <u-form-item label="展商名称" ref="item1">
                        <u--input
                            v-model="cerform.name"
                            placeholder="13字以内海报显示效果最好"
                            border="bottom"
                            :disabled ='disable'
                        ></u--input>
                    </u-form-item>
                    <text style="margin-left:130rpx;color:#CCC;font-size: 20rpx">最多输入20字</text>
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
                                v-model="cerform.business   "
                                placeholder="请输入信息"
                                maxlength="8"
                                border="bottom"
                                :disabled ='disable'
                        ></u--input>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="公司简介">
                        <u--textarea v-model="cerform.dec" maxlength="1000"  :disabled ='disable'  border="bottom" placeholder="请输入内容" autoHeight ></u--textarea>
                    </u-form-item>
                    <text style="margin-left:130rpx;color:#CCC;font-size: 20rpx">最多输入1000字</text>
                </view>
                <!-- <view class="box" @tap="getTag">
                    <u-form-item label="店铺标签">
                        <u--input
                                v-model="cerform.tag_name"
                                placeholder="请输入信息"
                                border="bottom"
                                disabled
                        ></u--input>
                    </u-form-item>
                    <u-popup 
                        :show="showPop" 
                        safeAreaInsetTop 
                        customStyle="{padding:50rpx}"
                        :closeOnClickOverlay="true"
                        closeable
                        @close="close"
                         @open="open">
                        <view class="popBox" > 
                            <view 
                                v-for="item,index in tagList" :key="index"
                                class="tagBox" 
                                @tap="checkTag(item.tag_name)" 
                                :style="current == item.tag_name?'padding:22rpx 40rpx;border: none;color:#FFF;background:'+themeColors : ''"
                                >
                                {{ item.tag_name }}
                            </view>
                        </view>
                    </u-popup>
                </view> -->
                <view class="box">
                    <u-form-item label="Logo">
                        <img :src="info.logo" v-if="disable" style="width:144rpx;height:144rpx;" alt="">
                       <u-upload
                            v-if="!disable"
                            :fileList="fileList1"
                            @afterRead="afterRead1"
                            @delete="deletePic"
                            name="1"
                            width="144"
	                        height="144"
                            :maxCount="1"
                            :previewFullImage="true"
                        ></u-upload>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="公司图片">
                        <view style="display:flex;" v-if="disable">
                            <img  v-for="item,index in fileList2" :key="index" :src="item.url"  style="width:144rpx;height:144rpx;margin-right: 20rpx;" alt="">
                        </view>
                        <u-upload
                            v-if="!disable"
                            :fileList="fileList2"                          
                            @afterRead="afterRead2"
                            @delete="deletePic1"
                            name="2"
                            width="144"
	                        height="144"
                            :maxCount="3"
                            :previewFullImage="true"
                        ></u-upload>
                        <text style="margin-left:130rpx;color:#CCC;font-size: 20rpx">因为图片需要裁剪，请一次上传一张</text>
                    </u-form-item>
                </view>
             </u--form>
        </view>
        <view class="footer">
            <view class="subBtn" :style="'background:'+ themeColors"  v-if="disable == false" @tap='showMoadl = true    '>
                提交
            </view>
            <view class="subBtn" :style="'background:'+ themeColors" v-if="disable == true" @tap="disable = false">
                修改
            </view>
        </view>
        <u-modal :show="showMoadl"  showCancelButton :confirmColor="themeColors" :content='content' @confirm="submit" @cancel="showMoadl = false"></u-modal>
        <ksp-cropper mode="ratio" :width="600" :height="600" :maxWidth="600" :maxHeight="600" :url="logoUrl"  @cancel="oncancel"  @ok="onok"></ksp-cropper>
        <ksp-cropper mode="ratio" :width="375" :height="210" :maxWidth="375" :maxHeight="210" :url="imgsUrl" @cancel="oncancel" @ok="onok1"></ksp-cropper>
    </view>
</template>

<script>
import {getMyStore,saveMyStore,getStoreTags,fileUp} from "@/api/v2";
import config from "@/utils/config"
export default {
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
        bgColor: uni.getStorageSync('color'),
        cerform:{name:'',brand_name:'',imgs:[],logo:'',dec:'',business:'' }, // tag_name:''
        content:'店铺修改后需要重新审核，店铺自动下架，是否确认修改？',
        info:{},
        tagList:[],
        showPop:false,
        showMoadl:'',
        current:'',
        fileList1: [],
        fileList2: [],
        disable:true,
        logoUrl:'',
        imgsUrl:'',
        path:'',
        eventArr:[],
    }
    },
    onLoad(){
        uni.showLoading({
				title: "加载中",
			});
        getMyStore({}).then((res)=>{
            this.info = res.data
            const { name,logo,imgs,dec,brand_name,business} =res.data
            this.cerform = {name:name,logo:logo,imgs:imgs,dec:dec,brand_name:brand_name,business:business}
            this.fileList1.push({url:this.cerform.logo,type: "image"})
            for(let i in this.cerform.imgs){
                this.fileList2.push({url:this.cerform.imgs[i],type: "image"})
            }
            if(this.cerform.status =='3'){
                this.disable = true;
            }
            uni.hideLoading();
        })
    },
    methods:{
        async changeEventArr(event,status){
                event.file.url = this.path
                let fileListLen = this[`fileList${event.name}`].length
				this[`fileList${event.name}`].push({
                    file:event.file,
                    status: 'uploading',
                    message: '上传中'
                })
                let url = "data:image/jpeg;base64," + uni.getFileSystemManager().readFileSync(event.file.url, "base64");
                await fileUp({type:1,img:url}).then((res)=>{
                    if(status == 0 ){
                        this.cerform.logo = res.data.url
                    }else if(status == 1){
                        this.cerform.imgs.push (res.data.url)
                    }
                    this[`fileList${event.name}`].splice(fileListLen, 1,)
                    this[`fileList${event.name}`].push({
                        status: 'success',
                        message: '',
                        url: res.data.url
                    })
                })
        },
        onok(ev) {
            this.logoUrl = "";
            this.path = ev.path;
            this.changeEventArr(this.eventArr,0)
        },
        onok1(e){
            this.imgsUrl = "";
            this.path = e.path;
            this.changeEventArr(this.eventArr,1)
        },
        oncancel() {
            this.logoUrl = "";
            this.imgsUrl = "";
        },
         afterRead1(event){
            // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
                this.logoUrl = event.file.url
                this.eventArr = event       
        },
         afterRead2(event){
            // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
                console.log(event)
                this.imgsUrl =  event.file.url
                this.eventArr = event       
        },
        deletePic(event) {
            this[`fileList${event.name}`].splice(event.index, 1)
            this.cerform.logo=""
		},
        deletePic1(event) {
            this[`fileList${event.name}`].splice(event.index, 1)
            this.cerform.imgs.splice(event.index, 1)
		},
        getTag(){
            getStoreTags({obj_id:config.obj_id}).then((res)=>{
                this.tagList =res.data
            })
            this.showPop = true
        },
        checkTag(str){
            if(this.current == str){
                this.current = ''
                this.cerform.tag_name = ''
            }else{
                this.current = str
                this.cerform.tag_name = str
                this.showPop = false
            }
        },
         submit(){
            this.cerform.imgs = this.cerform.imgs.join(',')
            saveMyStore(this.cerform).then((res)=>{
                if(res.code == 0){
                    uni.showToast({
                        title: res.msg,
                        icon: 'none',
                        mask: true
                    })
                    this.cerform.imgs = this.cerform.imgs.split(',')
                    console.log(this.cerform.imgs)
                }else{
                    uni.showToast({
                        title: '添加成功,等待审核',
                        icon: 'none',
                        mask: true
                    })
                    this.back()
                } 
            })

        },
        open() {
          // console.log('open');
        },
        close() {
          this.showPop = false
          // console.log('close');
        },
       
        back() {
            uni.navigateBack();
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

    .popBox{
        display: flex;
        height: 180rpx;
        width: 686rpx;
        overflow: auto;
        flex-wrap: wrap;
        padding: 32rpx;
        justify-content: space-between;
        align-items: center;
        .tagBox{
            width: 100rpx;
            text-align: center;
            padding: 20rpx 40rpx;
            border: 2rpx solid #ccc;
            border-radius: 20rpx;
            margin-bottom: 20rpx;
        }
        .tagBox:nth-child(-3n+8){
            margin: 0rpx 32rpx 20rpx 32rpx;
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