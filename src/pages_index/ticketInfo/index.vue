<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" :bgColor="bgColor" @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">登记核销</text>
      </view>
    </u-navbar>
    <view>
      <image class="headerImg" :src="info.exhibit_one.img" mode="scaleToFill" />
    </view>
    <view class="userInfo" :style="'color:'+themeColors">
      <view style="display: flex">
        <u-icon name="checkmark-circle-fill" :color="themeColors" size="32"></u-icon>
        <text style="margin-left: 10rpx">当前登录</text>
        <text style="margin: 0 10rpx">{{ info.user_one.nickname || "" }}</text>
        <text>{{ info.user_one.phone || "" }}</text>
      </view>
      <view style="display: flex" @tap="switchTab('/pages/mine/index')">
        <text style="margin-right: 5rpx">会员中心</text>
        <u-icon name="arrow-right" :color="themeColors" size="32"></u-icon>
      </view>
    </view>
    <view class="qrcode">
      <view class="time">{{ nowTime }}</view>
      <u-divider></u-divider>
      <view>电子票</view>
      <view>
        <uqrcode
          ref="uqrcode"
          canvas-id="qrcode"
          value="https://uqrcode.cn/doc"
          :options="{ margin: 10, foregroundColor: qrColor }"
        ></uqrcode>
      </view>
      <view style="color: rgba(0, 0, 0, 0.6)">
        {{ info.exhibit_one.name || "" }}
      </view>
    </view>
    <view class="regdata">
      <text>已登记信息</text>
      <view
        :style="'display: flex; color:'+themeColors"
        @tap="navigator('/pages_index/ticketInfo/userInfo')"
      >
        <text>查看详情</text>
        <u-icon name="arrow-right" :color="themeColors" size="32"></u-icon>
      </view>
    </view>
    <view class="regdata" style="padding: 24rpx 32rpx; display: block">
      <text
        >恭喜您成功登记，现场凭二维码核销入场。
        {{ info.exhibit_one.name || "" }}
        将于{{ info.exhibit_one.start_time || "" }} -
        {{ info.exhibit_one.end_time || "" }} 在
        {{ info.exhibit_one.city_name || "" }}
        {{ info.exhibit_one.lab_name || "" }}
        举行，期待您的到来！
      </text>
    </view>
    <view class="myTeam">
      <view class="myTeamHeader">
        <view>
          我的团组
          <text style="color: red">
            {{ info.team.enroll_users_count || "0" }}
          </text>
          人
        </view>
        <view
          v-if="info.team"
          @tap="navigator('/pages_index/mine/myTeam/index')"
          :style="'display: flex; color:'+color"
        >
          <text>查看详情</text>
          <u-icon name="arrow-right" :color="themeColors" size="32"></u-icon>
        </view>
      </view>
      <u-divider></u-divider>
      <view class="subBtn" :style="'background:'+ themeColors" @tap="clustering">{{ text }}</view>
    </view>
  </view>
</template>  
  <script>
import { getMyTicket } from "@/api/register";
import { createTeam } from "@/api/team";
export default {
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      bgColor: uni.getStorageSync('color'),
      qrColor: "#2CA347",
      info: {},
      nowTime: "",
      text: "邀请好友入团",
    };
  },
  created() {
    this.$refs.uqrcode.toTempFilePath({
      success: (res) => {
        console.log(res);
      },
    });
  },
  //在mounted钩子函数中调用nowTimes函数、在beforeDestroy钩子函数中调用clear函数
  mounted() {
    this.nowTimes();
    setInterval(this.nowTimes, 1000);
  },
  beforeDestroy() {
    this.clear();
  },
  onLoad(op) {
    uni.showLoading({
      title: "加载中",
    });
    this.info = JSON.parse(uni.getStorageSync("tickerInfo"));
    if (this.info.status == 0) {
      this.qrColor = "#000";
    } else if (this.info.status == 1) {
      this.qrColor = "#2CA347";
    }
    if (!this.info.team) {
      this.text = "立即成团";
    }
    uni.hideLoading();
  },
  methods: {
    //获取当前时间
    timeNow(timeStamp) {
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      this.nowTime = hh + ":" + mm + ":" + ss;
    },
    // 实时刷新当前时间，格式化
    nowTimes() {
      this.timeNow(new Date());
    },
    //清除定时器
    clear() {
      clearInterval(this.nowTimes);
      this.nowTimes = null;
    },
    back() {
      uni.navigateBack();
    },
    navigator(url) {
      uni.navigateTo({
        url: url,
      });
    },
    switchTab(url) {
      uni.switchTab({
        url: url,
      });
    },
    clustering() {
      if (this.text == "立即成团") {
        createTeam({ exhibit_id: uni.getStorageSync("exhibit_id") }).then(
          () => {
            uni.showToast({
              title: "成团成功",
              icon: "",
            });
            setTimeout(() => {
              uni.navigateTo({
                url: "/pages_index/mine/myTeam/index",
              });
            }, 1000);
          }
        );
      } else {
        uni.showToast({
          title: "邀请好友",
          icon: "",
        });
      }
    },
    submit() {
      addTicket().then(() => {});
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
.headerImg {
  width: 750rpx;
  height: 532rpx;
  background: #000;
  display: flex;
}
.userInfo {
  height: 66rpx;
  background: #e2f8ff;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  font-size: 24rpx;
  justify-content: space-between;
}
.qrcode {
  margin: 24rpx 32rpx;
  border-radius: 20rpx;
  background: #fff;
  padding: 32rpx 76rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .time {
    font-weight: 700;
    font-size: 96rpx;
  }
}
.regdata {
  font-size: 28rpx;
  margin: 24rpx 32rpx;
  padding: 14rpx 48rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 20rpx;
}
.myTeam {
  font-size: 28rpx;
  margin: 32rpx;
  padding: 24rpx 48rpx;
  background: #fff;
  border-radius: 20rpx;
}
.myTeamHeader {
  display: flex;
  font-size: 32rpx;
  justify-content: space-between;
  align-items: center;
}
.subBtn {
  width: 360rpx;
  text-align: center;
  margin: 40rpx auto;
  padding: 16rpx 0;
  color: rgb(255, 255, 255);
  font-size: 36rpx;
  border-radius: 50px;
}
::v-deep .u-divider {
  width: 267px;
  border-bottom-width: 3px;
}
</style>