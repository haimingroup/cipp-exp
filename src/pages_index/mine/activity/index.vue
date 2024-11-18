<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" placeholder :bgColor="bgColor" @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">我的活动</text>
      </view>
    </u-navbar>
    <u-tabs
      :list="list"
      lineWidth="70rpx"
      lineHeight="6rpx"
      :lineColor="themeColors"
      :activeStyle="activeStyle"
      :inactiveStyle="inactiveStyle"
      :scrollable="false"
      @click="clickTabs"
    />
    <scroll-view
      :scroll-y="true"
      lower-threshold="20"
      @scrolltolower="scrolltolower"
      class="listContent"
    >
      <view class="content" v-if="showList">
        <activitBox
          v-for="(item, index) in cList"
          :key="index"
          :item="item.activity_one"
        >
        </activitBox>
        <image
          v-if="cList.length == 0"
          class="quesheng"
          src="../../../static/quesheng.png"
          mode="aspectFit"
        />
        <u-loadmore
          v-if="cList.length !== 0"
          marginTop="30"
          :status="status"
          fontSize="32"
        />
      </view>
      <view class="content" v-if="!showList">
        <activitBox
          v-for="(item, index) in eList"
          :key="index"
          :item="item.activity_one"
        >
        </activitBox>
        <image
          v-if="eList.length == 0"
          class="quesheng"
          src="../../../static/quesheng.png"
          mode="aspectFit"
        />
        <u-loadmore
          v-if="eList.length !== 0"
          marginTop="30"
          :status="status"
          fontSize="32"
        />
      </view>
    </scroll-view>
  </view>
</template>  
<script>
import { getCollectList, getEnrollList } from "@/api/list";
import activitBox from "../../../components/activityBox.vue";
export default {
  components: { activitBox },
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      showList: true,
      bgColor: uni.getStorageSync('color'),
      cPage: 1,
      ePage: 1,
      list: [
        {
          name: "已收藏",
        },
        {
          name: "已报名",
        },
      ],
      cList: [],
      eList: [],
      cstatus: "loadmore",
      estatus: "loadmore",
      inactiveStyle: {
        color: this.themeColors,
        fontSize: "32rpx",
        lineHeight: "46rpx",
        paddingRight: "10rpx",
      },
      activeStyle: {
        color: this.themeColors,
        fontSize: "32rpx",
        lineHeight: "46rpx",
        paddingRight: "10rpx",
      },
    };
  },
  onLoad(options) {
    getCollectList({
      exhibit_id: uni.getStorageSync("exhibit_id"),
      page: this.cPage,
    }).then((res) => {
      this.cList = res.data.data;
    });
    getEnrollList({
      exhibit_id: uni.getStorageSync("exhibit_id"),
      page: this.ePage,
    }).then((res) => {
      this.eList = res.data.data;
    });
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    clickTabs(e) {
      if (e.index == 0) {
        this.showList = true;
        this.cstatus = "loadmore";
      } else if (e.index == 1) {
        this.showList = false;
        this.estatus = "loadmore";
      }
    },
    scrolltolower() {
      if (this.showList) {
        if (this.cstatus == "nomore") {
          return;
        } else {
          this.cPage++;
          getCollectList({
            exhibit_id: uni.getStorageSync("exhibit_id"),
            page: this.cPage,
          }).then((res) => {
            res.data.data.map((item) => {
              this.cList.push(item);
            });
            if (res.data.data.length < 15) {
              this.cstatus = "nomore";
            }
          });
        }
      } else {
        if (this.cetatus == "nomore") {
          return;
        } else {
          this.ePage++;
          getEnrollList({
            exhibit_id: uni.getStorageSync("exhibit_id"),
            page: this.ePage,
          }).then((res) => {
            res.data.data.map((item) => {
              this.eList.push(item);
            });
            if (res.data.data.length < 15) {
              this.estatus = "nomore";
            }
          });
        }
      }
    },
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
.content {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.quesheng {
  width: 116rpx;
}
</style>