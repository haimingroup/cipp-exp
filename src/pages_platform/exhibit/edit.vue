<template>
    <view class="page">
        <u-navbar :fixed="true" :bgColor="bgColor" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
                <u-icon name="arrow-left" color="#FFF"></u-icon>
                <text style="margin-left: 10rpx">展品信息</text>
            </view>
		</u-navbar>
        <view class="content">
            <view class="title">
				<view class="colorBox" :style="'background:'+ themeColors" />
				<text>添加产品</text>
			</view>
            <u--form
				labelPosition="left"
				:model="cerform"
				ref="uForm"
                labelWidth="130rpx"
		    >
                <view class="box">
                    <u-form-item label="产品名称" ref="item1">
                        <u--input
                                v-model="cerform.goods_name"
                                placeholder="请输入信息"
                                border="bottom"
                        ></u--input>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="产品规格" ref="item1">
                        <u--input
                                v-model="cerform.goods_specs"
                                placeholder="请输入信息"
                                border="bottom"
                        ></u--input>
                    </u-form-item>
                </view>
                <view class="box">
                    <u-form-item label="产品简介">
                        <u--textarea v-model="cerform.goods_dec"  border="bottom" placeholder="请输入内容" autoHeight ></u--textarea>
                    </u-form-item>
                </view>
                <view class="box" @tap="getTag">
                    <u-form-item label="产品标签">
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
                    <u-form-item label="产品主图">
                       <u-upload
                            :fileList="fileList1"
                            @afterRead="afterRead1"
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
                    <u-form-item label="产品图片">
                        <u-upload
                            :fileList="fileList2"
                            @afterRead="afterRead2"
                            @delete="deletePic"
                            name="2"
                            width="144"
	                        height="144"
                            multiple
                            :maxCount="3"
                            :previewFullImage="true"
                        ></u-upload>
                    </u-form-item>
                    <text style="margin-left:130rpx;color:#CCC;font-size: 20rpx">因为图片需要裁剪，请一次上传一张</text>

                </view>
             </u--form>
        </view>
        <view class="footer">
            <view class="subBtn" :style="'background:'+ themeColors" @tap="submit">
                提交
            </view>
        </view>
        <ksp-cropper mode="ratio" :width="700" :height="700" :maxWidth="700" :maxHeight="700" :url="imgUrl"  @cancel="oncancel"  @ok="onok"></ksp-cropper>
        <ksp-cropper mode="ratio" :width="700" :height="700" :maxWidth="700" :maxHeight="700" :url="imgsUrl" @cancel="oncancel" @ok="onok1"></ksp-cropper>

    </view>
</template>

<script>
import {editMyGood,fileUp,getGoodTags,getMyGoodInfo} from "@/api/v2"
import config from "@/utils/config"
export default {
    data() {
    return {
        themeColors: uni.getStorageSync('color'),
        bgColor: uni.getStorageSync('color'),
        showPop:false,
        current:'',
        cerform:{
            goods_name:'',
            goods_dec:'',
            goods_img:'',
            goods_imgs:[],
            tag_name:'',
            goods_specs:'',
            id:'',
        },
        tagList:[],
        fileList1: [],
        fileList2: [],
        path:'',
        eventArr:[],
        imgUrl:'',
        imgsUrl:'',
    }
    },
    onLoad(option){
        this.cerform.id = option.id
        getMyGoodInfo({
            id: this.cerform.id
        }).then((res=>{
            const{goods_name,goods_dec,goods_specs, goods_img,goods_imgs,tag_name,id} = res.data
            this.cerform ={
                goods_specs:goods_specs,
                goods_name:goods_name,
                goods_dec:goods_dec,
                goods_img:goods_img,
                goods_imgs:goods_imgs,
                tag_name:tag_name,
                id:id
            }
            this.fileList1.push({url:this.cerform.goods_img,type: "image"})
            for(let i in this.cerform.goods_imgs){
                this.fileList2.push({url:this.cerform.goods_imgs[i],type: "image"})
            }
        }))
    },
    methods:{
        back() {
            uni.navigateBack();
        },
        async changeEventArr(event,status){
                event.file.url = this.path
                let fileListLen = this[`fileList${event.name}`].length
				this[`fileList${event.name}`].push({
                    file:event.file,
                    status: 'uploading',
                    message: '上传中'
                })
                let url = "data:image/jpeg;base64," + uni.getFileSystemManager().readFileSync(event.file.url, "base64");
                await fileUp({type:2,img:url}).then((res)=>{
                    if(status == 0 ){
                        this.cerform.goods_img = res.data.url
                    }else if(status == 1){
                        this.cerform.goods_imgs.push(res.data.url)
                    }
                    this[`fileList${event.name}`].splice(fileListLen, 1,)
                    this[`fileList${event.name}`].push({
                        status: 'success',
                        message: '',
                        url: res.data.url
                    })
                })
        },
        onok(e) {
            this.imgUrl = "";
            this.path = e.path;
            this.changeEventArr(this.eventArr,0)
        },
        onok1(e){
            this.imgsUrl = "";
            this.path = e.path;
            this.changeEventArr(this.eventArr,1)
        },
        oncancel() {
            this.imgUrl = "";
            this.imgsUrl = "";
        },
        async afterRead1(event){
            // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
                this.imgUrl = event.file.url
                this.eventArr = event      
        },
        async afterRead2(event){
            // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
                this.imgsUrl =  event.file.url
                this.eventArr = event  
        },
        deletePic(event) {
            this[`fileList${event.name}`].splice(event.index, 1)
		},
        getTag(){
            getGoodTags({obj_id:config.obj_id}).then((res)=>{
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
            this.cerform.goods_imgs = this.cerform.goods_imgs.join(', ')
            editMyGood(this.cerform).then((res)=>{
                if(res.code ==0){
                    uni.showToast({
                        title: res.msg,
                        icon: 'none',
                        mask: true
                    })
                }else{
                    uni.showToast({
                        title: '修改成功,等待审核',
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
    .popBox{
        height: 48vh;
        width: 686rpx;
        overflow: auto;
        padding: 32rpx; 
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
    ::v-deep .u-upload__deletable__icon{
        .u-icon{
            text{
                font-size: 16rpx !important;
            }
        }
    }
</style>