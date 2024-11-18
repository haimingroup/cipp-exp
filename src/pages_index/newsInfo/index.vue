<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" :bgColor="bgColor" @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">新闻详情</text>
      </view>
    </u-navbar>
    <view class="header">
      <image
        style="width: 750rpx; height: 532rpx"
        :src="imgSrc"
        mode="scaleToFill"
      />
    </view>
    <view class="content">
      <view class="newsInfo">
        <view class="title"> {{ info.title || "" }} </view>
        <u-line margin="18rpx 0 40rpx 0" color="rgb(240, 240, 240)"></u-line>
        <view class="newsContent">
          <rich-text :nodes="info.content"></rich-text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { newsGetInfo } from "@/api/list.js";

export default {
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      imgSrc: uni.getStorageSync("ceilingImg"),
      bgColor: uni.getStorageSync('color'),
      info: {},
    };
  },
  onLoad(option) {
    uni.showLoading({
      title: "加载中",
    });
    newsGetInfo({ news_id: option.news_id }).then((res) => {
      this.info = res.data;
      let newContent = res.data.content.replace(/<img[^>]*>/gi, (match) => {
        match = match
          .replace(/style="[^"]+"/gi, "")
          .replace(/style='[^']+'/gi, "");
        match = match
          .replace(/width="[^"]+"/gi, "")
          .replace(/width='[^']+'/gi, "");
        match = match
          .replace(/height="[^"]+"/gi, "")
          .replace(/height='[^']+'/gi, "");
        match = match.replace(/style\s*=\s*(["'])(?:(?!\1).)*\1/gi, ""); // 去除 style=""这样的属性
        return match;
      });
      // img标签添加style属性：max-width:100%;height:auto
      this.info.content = newContent.replace(
        /\<img/gi,
        '<img style="width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"'
      );
      uni.hideLoading();
    });
  },
  methods: {
    clickTabs(e) {
      console.log(e);
    },
    back() {
      uni.navigateBack();
    },
  },
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
  color: rgb(255, 255, 255);
  font-size: 36rpx;
  font-weight: 700;
  line-height: 36rpx;
  text-align: left;
}
.header {
  width: 750rpx;
  height: 532rpx;
  background-color: #999999;
}
.content {
  padding: 0 30rpx;
  position: relative;
  .newsInfo {
    background-color: #fff;
    padding: 20rpx 40rpx;
    border-radius: 20rpx;
    position: relative;
    top: -60rpx;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // position: relative;
    margin-bottom: 50rpx;
    .title {
      font-size: 32rpx;
      font-weight: 500;
      line-height: 36rpx;
      text-align: center;
    }
  }
}
</style>
