<template>
  <view class="page">
    <u-navbar :fixed="true" placeholder :bgColor="bgColor" @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">我的门票</text>
      </view>
    </u-navbar>

    <view class="content">
      <view class="List">
        <view class="box" v-for="(item, index) in list" :key="index">
          <view class="boxTitle"> {{ item.exhibit_one.name }} </view>
          <view class="info">
            <u-icon :name="timeIcon" size="26"></u-icon>
            <text>{{
              item.exhibit_one.start_time + "-" + item.exhibit_one.end_time
            }}</text>
          </view>
          <view class="info">
            <u-icon name="map" size="26"></u-icon>
            <text>{{ item.exhibit_one.city_name }}</text>
          </view>
          <view v-if="current == index" class="isCheck" :style="'background: linear-gradient(-45deg,'+themeColors+','+themeColors+'50%,transparent 50%,transparent 100%);'">
            <u-icon
              top="28rpx"
              name="checkbox-mark"
              color="#FFF"
              size="32"
            ></u-icon>
          </view>
        </view>
      </view>
      <image
        v-if="list.length == 0"
        class="quesheng"
        src="../../../static/quesheng.png"
        mode="aspectFit"
      />
    </view>
  </view>
</template>

<script>
import config from "@/utils/config.js";
import { getMyTicketList } from "@/api/register.js";
export default {
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      current: -1,
      //顶部标题栏背景色
      bgColor: uni.getStorageSync('color'),
      list: [],
      checkInfo: {},
    };
  },
  onLoad() {
    getMyTicketList({ obj_id: config.obj_id }).then((res) => {
      this.list = res.data.data;
    });
  },
  methods: {
    onBeforeChange(next, index) {
      next();
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
.content {
  padding: 30rpx;
  .title {
    display: flex;
    align-items: center;
    .icon {
      width: 36rpx;
      height: 48rpx;
      margin-right: 20rpx;
    }
    .text {
      color: rgb(0, 0, 0);
      font-size: 32rpx;
      font-weight: 400;

      text {
        font-size: 36rpx;
        font-weight: 600;
      }
    }
  }

  .List {
    margin-top: 30rpx;

    .box {
      padding: 30rpx;
      position: relative;
      background-color: #fff;
      border-radius: 20rpx;
      margin-bottom: 30rpx;
      border: 2rpx solid rgba(224, 8, 75, 0);
      .boxTitle {
        color: rgb(0, 0, 0);
        font-size: 40rpx;
        font-weight: 700;
        margin-bottom: 15rpx;
      }
      .info {
        display: flex;
        align-items: center;
        margin-bottom: 15rpx;
        text {
          color: rgb(153, 153, 153);
          font-size: 24rpx;
          font-weight: 500;
          margin-left: 10rpx;
        }
      }
      .isCheck {
        padding: 0 0 0rpx 20rpx;
        width: 40rpx;
        height: 60rpx;
        position: absolute;
        bottom: -2rpx; //因为边框宽2px 但右侧没有影响
        right: 0;
        border-radius: 0 0 20rpx 0;
      }
    }
  }
}

.quesheng {
  width: 116rpx;
  margin: 0 auto;
  transform: translate(238%, 5%);
}
</style>
