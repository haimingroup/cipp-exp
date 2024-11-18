<template>
  <view
    class="box"
    @tap="navigator('/pages_index/activityInfo/index?id=' + info.activity_id)"
  >
    <view class="acname">
      <text>活动名称:</text>
      <text class="right">{{ info.title }}</text>
    </view>
    <view class="acinfo">
      <text>活动介绍:</text>
      <text class="info">{{ info.dec }}</text>
    </view>
    <view class="acinfo">
      <text>活动时间:</text>
      <text class="info"
        >{{ info.start_time.slice(0, 16) }} - {{ info.end_time.slice(0, 16) }}
      </text>
    </view>
    <u-line color="rgb(210, 210, 210)" margin="20rpx 0" />
    <view class="btn">
      <view class="local">
        <u-icon name="map" size="13px"></u-icon>
        <text style="margin-left: 15rpx">{{ info.address }}</text>
      </view>
      <view class="bmBtn" :style="'background:'+themeColors">
        <slot> 详情 </slot>
      </view>
    </view>
  </view>
</template>  
<script>
import { activeGetInfo } from "@/api/list";

export default {
  props: ["item"],
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      info: this.item,
    };
  },
  methods: {
    navigator(url) {
      activeGetInfo({ activity_id: this.info.activity_id }).then((res) => {
        if (res.code == 1) {
          uni.navigateTo({
            url: url,
          });
        } else {
        }
      });
    },
  },
};
</script>
<style lang="scss"scoped>
.box {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  border: 2rpx solid rgb(210, 210, 210);
  width: 650rpx;
  margin-bottom: 30rpx;
  .acname {
    margin-bottom: 10rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: #000;
    line-height: 36rpx;
    display: flex;
    .right {
      margin-left: 10rpx;
      display: block;
      width: 500rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .acinfo {
    color: rgb(105, 97, 97);
    margin-bottom: 10rpx;
    font-size: 24rpx;
    font-weight: 500;
    line-height: 36rpx;
    display: flex;
    .info {
      margin-left: 10rpx;
      display: block;
      width: 500rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .local {
      display: flex;
      align-items: center;
      width: 460rpx;
      color: rgb(105, 97, 97);
      font-size: 24rpx;
    }
    .bmBtn {
      padding: 4rpx 28rpx;
      color: #fff;
      border-radius: 10rpx;
      font-size: 28rpx;
      font-weight: 500;
    }
  }
}
</style>