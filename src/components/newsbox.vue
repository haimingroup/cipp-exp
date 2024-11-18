<template>
  <view
    class="page"
    @tap="navigator('/pages_index/newsInfo/index?news_id=' + info.news_id)"
  >
    <view class="left">
      <view class="title">{{ info.title }}</view>
      <view class="info">
        <text class="time">{{ info.created_at.slice(0, 10) }}</text>
        <text class="type"  :style="'color:'+ themeColors"></text>
      </view>
    </view>
    <view class="right"><image :src="info.img" mode="scaleToFill" /></view>
  </view>
</template>
<script>
export default {
  props: ["item"],
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      info: this.item,
      webviewStyles: {
        height: "100vh",
        width: "750rpx",
      },
    };
  },
  methods: {
    navigator(url) {
      if (this.info.out_link) {
        uni.navigateTo({
          url:
            "/pages_index/webview/index?url=" +
            this.info.out_link +
            "&title=" +
            this.info.title,
        });
       
      } else {
        uni.navigateTo({
          url: url,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  padding: 30rpx 0rpx;
  margin: 0 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(240, 240, 240);

  .left {
    width: 350rpx;
    margin-right: 30rpx;

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
      }
    }
  }

  .right {
    width: 200rpx;
    height: 130rpx;
    background: #333;
    border-radius: 10rpx;
    overflow: hidden;
    image {
      width: 200rpx;
      height: 130rpx;
    }
  }
}
</style>