<template>
    <view class="page">
      <!-- 顶部标题栏 -->
      <u-navbar :fixed="true" bgColor="#FFFFFF00" @leftClick="back">
        <view class="navTitle" slot="left">
          <u-icon name="arrow-left" color="#FFF"></u-icon>
          <text style="margin-left: 10rpx">排行榜</text>
        </view>
      </u-navbar>
      <view class="banner">
        <image
          style="width: 750rpx; height: 532rpx"
          :src="imgSrc"
          mode="scaleToFill"
        />
      </view>
      <view class="content">
        <u-tabs :list="tabList" :scrollable="false" lineWidth="74rpx" lineHeight="6rpx" :lineColor="themeColors"
                      :activeStyle="activeStyle" :inactiveStyle="inactiveStyle" @click="clickTabs" />
        <view v-if="current ==0">
          <view  class="box"  v-for="(item, index) in listV" :key="index" @tap="navigate('/pages_index/productInfo/index?id=' + item.goods_one.id)">
          <view class="ranknum" :style="current == 1 ?'' : index+1==1 ? 'background: linear-gradient(45deg,#FAFF6F,#E8B960);color:#FFF' : index+1==2 ? 'background:#C7C7C7;color:#FFF' : index+1==3 ? 'background:#CFA700;color:#FFF' : '' ">
            <text :style="current == 0 ? '' : 'color:#FFF'">{{index+1}}</text>
          </view>
          <view class="right"><image :src="item.goods_one.goods_img" mode="scaleToFill" /></view>
          <view class="left">
            <view class="title">{{ item.goods_one.goods_name}}</view>
            <view class="info">
              <text class="time">{{ item.goods_one.tags_name }}</text>
              <view class="type" v-if="rule == 0">
                <u-icon name="eye" color="#272536"></u-icon>
                <text style="margin-left: 5rpx;color: #666666;">{{ item.viewer }}</text>
              </view>
              <view class="type" v-if="rule == 1">
                <image src="../static/vote.png" style="width:40rpx;height:40rpx" ></image>
                <text style="margin-left: 5rpx;color: #666666;">{{ item.vote_num }}</text>
              </view>
              
            </view>
          </view>
        </view>
        </view>
        <view v-else>
          <view  class="box" v-for="(item, index) in list" :key="index" @tap="navigate('/pages_index/productInfo/index?id=' + item.goods_one.id)">
          <view class="ranknum">
            <text style="color:#FFF">{{index+1}}</text>
          </view>
          <view class="right"><image :src="item.goods_one.goods_img" mode="scaleToFill" /></view>
          <view class="left">
            <view class="title">{{ item.goods_one.goods_name}}</view>
            <view class="info">
              <text class="time">{{ item.goods_one.tags_name }}</text>
            </view>
          </view>
        </view>
        </view>
        <u-back-top :scroll-top="scrollTop" bottom="250"></u-back-top>
      </view>
      <u-loadmore v-if="current ==0" :status="statusV" fontSize="32" />
      <u-loadmore v-if="current ==1" :status="status" fontSize="32" />
    </view>
  </template>  
  <script>
  import { getContestGoods,getConfig } from "@/api/match";
  import config from "@/utils/config";
  export default {
    data() {
      return {
        dColor:uni.getStorageSync('color_d'),
        themeColors: uni.getStorageSync('color'),
        imgSrc: uni.getStorageSync("ceilingImg"),
        activeStyle: {
                color: uni.getStorageSync('color'),
                fontSize: "32rpx",
                lineHeight: "46rpx",
        },
        inactiveStyle: {
          color: uni.getStorageSync('color'),
          fontSize: "32rpx",
          lineHeight: "46rpx",
        },
        tabList: [{
                      name: '排行榜'
                  }, {
                      name: '爆品列表'
                  }],
        status: "loadmore",
        statusV:'loadmore',
        page: 1,
        pageV: 1,
        randomPage:'',
        list: [],
        listV: [],
        current:0,
        scrollTop:'',
        config_id:'',
        rule:'',
        totel:'',
      };
    },
    async onShow() {
      uni.showLoading({
        title: "加载中",
      });
     await getConfig({exhibit_id: uni.getStorageSync("exhibit_id")}).then((res)=>{
        this.config_id = res.data.id
        this.rule = res.data.rule
      })
      await getContestGoods({
        config_id: this.config_id,
        type:1,
        page: this.page,
      }).then((res) => {
        this.listV = res.data.data;
        if (this.listV.length < 15) {
          this.statusV = "nomore";
        }
        this.totel = Math.ceil(res.data.to/15)
        this.page = Math.floor(Math.random()*(this.totel-1))+1
        this.randomPage = this.page + 1
        uni.hideLoading()
      });
    },
    onPageScroll(event) {
			this.scrollTop = event.scrollTop; // 更新页面滚动高度
		},
    onReachBottom() {
        this.reachButtom()
    },
    methods: {
      back() {
        uni.navigateBack();
      },
      navigate(url) {
        uni.navigateTo({
          url: url,
        });
      },
      clickTabs(e){
        this.current = e.index
        if(this.current == 0){
            getContestGoods({
              config_id: this.config_id,
              type:1,
              page: 1,
            }).then((res) => {
              this.listV = res.data.data
              if (res.data.data.length <= 15) {
                this.statusV = "nomore";
              }
           })//排行榜
          }else{
          getContestGoods({
              config_id: this.config_id,
              type:0,
              page: this.page,
            }).then((res) => {
                  this.list =res.data.data
                  this.list.sort(() => Math.random() - 0.5);
                  if (res.data.data.length <= 15) {
                    this.status = "nomore";
                  }
                })
          }//列表
      },
      //触底更新列表
      reachButtom(){
        if(this.current == 0){
          if(this.statusV == "nomore"){
            return
          }else{
            this.pageV++
            getContestGoods({
              config_id: this.config_id,
              type:1,
              page: this.pageV,
            }).then((res) => {
              res.data.data.map((item) => {
                  this.listV.push(item);
                });
              if (res.data.data.length <= 15) {
                this.statusV = "nomore";
              }
           })
          }//排行榜判断终
        }else{
          if(this.status == "nomore"){
            return
          }else{
            if(this.page < this.randomPage){
              this.page--
              if(this.page ==0){
                this.page = this.randomPage
              }
            }else if(this.page >= this.randomPage){
              this.page++
              if(this.page>this.totel){
                this.status = "nomore";
              }
            }
            getContestGoods({
              config_id: this.config_id,
              type:0,
              page: this.page,
            }).then((res) => {
              res.data.data.map((item) => {
                  this.list.push(item);
                });
              if (res.data.data.length <= 15) {
                this.status = "nomore";
              }
           })
          }//列表判断终
        }
      },
    }
  }
  </script>
  <style lang="scss"scoped>
  .page {
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
  .banner {
    width: 750rpx;
    height: 532rpx;
    background-color: #ccc;
  }
  .content {
    padding: 48rpx 32rpx;
    .box {
      background: #FFF;
      border-radius: 20rpx;
      padding: 30rpx 40rpx;
      margin-top: 32rpx ;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow:hidden;
      .ranknum{
        width: 32rpx;
        height: 32rpx;
        font-size:32rpx;
        border-radius: 32rpx;
        padding: 5rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        text{
          line-height: 32rpx;
        }
      }
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
        display: flex;
        align-items: center;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 36rpx;
      }

      .time {
        color: rgb(153, 153, 153);
        font-size: 24rpx;
        font-weight: 400;
        line-height: 36rpx;
        width: 200rpx; /* 定义容器的宽度 */
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
    }
  }
  </style>