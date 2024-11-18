<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" :bgColor="themeColors" @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">团队排行</text>
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
      <view class="box" v-for="(item, index) in list" :key="index">
        <view class="header" :style="'background:'+ dColor">
          <view class="name">
            <p style="margin-bottom: 10rpx">{{ item.name }}</p>
            <p>团长:{{ item.user_one.nickname||item.store_one.company_name }}</p>
          </view>
          <view class="num">
            <text class="number">{{ item.enroll_users_count }}</text>
            <text style="font-size: 24rpx; font-weight: 400">人</text>
          </view>
        </view>
        <view class="avaList">
          <view class="captainAva">
            <u-avatar size="96" :src="item.user_one.avatar||item.store_one.logo"></u-avatar>
            <view class="captain">团长</view>
          </view>
          <u-avatar
            v-for="avaSrc in item.enroll_users"
            :key="avaSrc"
            size="96"
            :src="avaSrc.user_one.avatar"
          ></u-avatar>
          <u-avatar
            v-if="item.enroll_users.length > 4"
            size="96"
            font-size="60"
            icon="more-dot-fill"
          ></u-avatar>
        </view>
        <view
          class="btnBox"
          @tap="
            navigate(
              '/pages_index/mine/teamInfo/index?team_id=' + item.enroll_team_id+'&type='+current
            )
          "
        >
          <view class="btn" :style="'background:'+themeColors">我要参团</view>
        </view>
      </view>
    </view>

    <u-loadmore :status="status" fontSize="32" />
  </view>
</template>  
<script>
import { getTopTeamE } from "@/api/v2";
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
					name: '观众组团'
				}, {
					name: '展商组团'
				}],
      status: "loadmore",
      noMore: false,
      avaList: [],
      page: 1,
      list: [],
      current:0,
    };
  },
  onLoad() {
    uni.showLoading({
      title: "加载中",
    });
    getTopTeamE({
      exhibit_id: uni.getStorageSync("exhibit_id"),
      type:0,
      page: this.page,
    }).then((res) => {
      this.list = res.data.data;
      if (this.list.length < 15) {
        this.status = "nomore";
      }
      this.list.map((item) => {
        const newList = item.enroll_users;
        if (item.enroll_users.length > 4) {
          item.enroll_users = [newList[0], newList[1], newList[2]];
        }
      });
      uni.hideLoading();
    });
  },
  onReachBottom() {
    if (this.noMore) {
      return;
    } else {
      this.page++;
      if(this.current == 0){
        obj = {
          exhibit_id: uni.getStorageSync("exhibit_id"),
          type:0,
          page: this.page,
      }
      }else{
        obj = {
          exhibit_id: uni.getStorageSync("exhibit_id"),
          type:1,
          page: this.page,
        }
      }
      getTopTeamE(obj).then((res) => {
        if (res.data.data.length == 0) {
          this.noMore = true;
          this.status = "nomore";
        } else {
          res.data.data.map((item) => {
            this.list.push(item);
          });
        }
      });
    }
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
      this.page = 1
      let obj = {}
      this.current = e.index
      if(e.index == 0){
        obj = {
          exhibit_id: uni.getStorageSync("exhibit_id"),
          type:0,
          page: 1,
      }
      }else{
        obj = {
          exhibit_id: uni.getStorageSync("exhibit_id"),
          type:1,
          page: 1,
      }
      }
      uni.showLoading({
      title: "加载中",
    });
    getTopTeamE(obj).then((res) => {
      this.list = res.data.data;
      if (this.list.length < 15) {
        this.status = "nomore";
      }
      this.list.map((item) => {
        const newList = item.enroll_users;
        if (item.enroll_users.length > 4) {
          item.enroll_users = [newList[0], newList[1], newList[2]];
        }
      });
      uni.hideLoading();
    });
    }
  },
};
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
    width: 100%;
    border-radius: 20rpx 20rpx 0 0;
    overflow: hidden;
    background-color: #fff;
    margin: 40rpx 0;
    .header {
      padding: 20rpx 32rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .name {
        color: #fff;
        font-size: 24rpx;
      }
      .num {
        color: #ffdba3;
        .number {
          font-size: 48rpx;
          margin-right: 10rpx;
        }
      }
    }
    .avaList {
      padding: 32rpx 32rpx 24rpx 32rpx;
      display: flex;
    }
    .btnBox {
      padding: 0 32rpx 32rpx 32rpx;
      background: #fff;
      display: flex;
      justify-content: flex-end;
      .btn {
        width: fit-content;
        padding: 8rpx 30rpx;
        color: #fff;
        font-size: 24rpx;
        border-radius: 20rpx;
      }
    }
  }
}
.captainAva {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  padding: 2rpx;
  margin-right: 22rpx;
}
.captain {
  color: #4c2e05;
  font-size: 20rpx;
  background: #dcc389;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 96rpx;
}
::v-deep .u-avatar {
  margin-right: 22rpx;
}
</style>