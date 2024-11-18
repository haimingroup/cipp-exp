<template>
  <view
    class="page"
    @tap="navigator()"
  >
    <view class="right"><image :src="info.logo" mode="scaleToFill" /></view>
    <view class="left">
      <view class="title">{{ info.company_name}}</view>
      <view class="info">
        <text class="time">{{ info.tags_name }}</text>
        <text class="type" :style="'color:'+ themeColors"></text>
      </view>
    </view>
   
  </view>
</template>
<script>
export default {
  props: ["item"],
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      info: this.item.store_one,
    };
  },
  methods: {
    navigator() {
        uni.navigateTo({
          url: '/pages_index/exhibitorInfo/index?id=' + this.info.id +'&store_id=' + this.item.store_id,
      })
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
    
    border-radius: 10rpx;
    overflow: hidden;
    image {
      width: 160rpx;
      height: 160rpx;
    }
  }
}
</style>