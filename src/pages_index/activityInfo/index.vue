<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" :bgColor="bgColor" @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">活动详情</text>
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
      <view class="acInfo">
        <view class="title">
          <text class="titleText">{{ info.title || "" }} </text>
          <view class="star">
            <u-icon
              v-if="showStar"
              @tap="collect"
              name="star-fill"
              label="收藏"
              labelPos="bottom"
              labelSize="10px"
              space="5px"
              color="#999"
              labelColor="rgb(153, 153, 153)"
            ></u-icon>
            <u-icon
              v-if="!showStar"
              @tap="collect"
              name="star-fill"
              label="已收藏"
              labelPos="bottom"
              labelSize="10px"
              space="5px"
              color="#FADB14"
              labelColor="rgb(153, 153, 153)"
            ></u-icon>
          </view>
        </view>
        <u-line margin="18rpx 0 40rpx 0" color="rgb(210, 210, 210)"></u-line>
        <view class="acContent">
          <view class="clist" v-for="(item, index) in list" :key="index">
            <view class="up">
              <view class="colorBox" :style="'background:'+ themeColors" />
              <view class="acTitle">
                {{ item.name }}
              </view>
            </view>
            <view class="down">
              {{ item.content }}
            </view>
          </view>
          <view class="clist">
            <view class="up">
              <view class="colorBox" :style="'background:'+ themeColors" />
              <view class="acTitle"> 活动介绍 </view>
            </view>
            <view class="down">
              <rich-text :nodes="info.content" @tap="handleRich"></rich-text>
            </view>
          </view>
        </view>
      </view>
      <view class="footerBtn">
        <button class="shareBtn" :style="'color:'+ themeColors+';border-color:'+themeColors" open-type="share"> 分享好友 </button>
          <!-- 暂时隐藏 -->
          <view
            v-if="exhibitId !== 4"
            class="btn"
            @tap="apply"
            :style="showapply ? 'background: rgb(153, 153, 153);' : 'background:'+ themeColors"
          >
            {{ bmText }}
          </view>
        </view>
      </view>
    </view>
  </template>

  <script>
  import { activeGetInfo, activeCollect, activeEnroll } from "@/api/list";
  export default {
    data() {
      return {
        themeColors: uni.getStorageSync('color'),
        imgSrc: uni.getStorageSync("ceilingImg"),
      bgColor: uni.getStorageSync('color'),
      exhibitId: uni.getStorageSync("exhibit_id"),
      showStar: true, //true为未收藏。
      starLock: false,
      showapply: false,
      bmText: "立即报名",
      info: {},
      list: {
        time: { name: "活动时间", content: "" },
        local: { name: "活动地点", content: "" },
        end_num: { name: "活动人数限制", content: "" },
        sponsor: { name: "活动主办方", content: "" },
      },
    };
  },
  onLoad(option) {
    uni.showLoading({
      title: "加载中",
    });
    activeGetInfo({ activity_id: option.id }).then((res) => {
      this.info = res.data;
      //对循环对象进行赋值
      this.list.time.content =
        this.info.start_time.slice(0, 16) +
        " - " +
        this.info.end_time.slice(0, 16); //时间
      this.list.local.content = this.info.address; //地点
      this.list.end_num.content = this.info.end_num + "人"; //限制人数
      this.list.local.content = this.info.address; //地点
      this.list.sponsor.content = this.info.sponsor; //主办方
      let newContent = this.info.content.replace(/<img[^>]*>/gi, (match) => {
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
      if (res.data.enroll == 1) {
        this.bmText = "报名成功";
        this.showapply = true;
      }
      if (res.data.collect == 1) {
        this.showStar = false;
      }
      uni.hideLoading();
    });
  },
  onShareAppMessage(res) {
			if (res.from === "button") {
			// 来自页面内分享按钮
			console.log(res.target);
			}
			return {
			title: this.info.title,
			path:`/pages_index/activityInfo/index?id=${this.info.activity_id}&exhibit_id=${uni.getStorageSync("exhibit_id")}`,
			};

		},
  onShareTimeline() {
    (res) => {
    return {
      title: this.info.title,
      path:`/pages_index/activityInfo/index?id=${this.info.activity_id}&exhibit_id=${uni.getStorageSync("exhibit_id")}`,
      imageUrl: imageUrl,
    };
    };
  },
  methods: {
    handleRich(){
      let regex = /<img.*?src="(.*?)"/g;
      let match = regex.exec(this.info.content)
      uni.previewImage({
        urls:[match[1]]
      })
    },
    apply() {
      if (this.showapply) {
        return;
      } else {
        activeEnroll({ activity_id: this.info.activity_id }).then((res) => {
          if (res.code == 1) {
            uni.showToast({
              title: "报名成功",
            });
            this.showapply = !this.showapply;
            this.bmText = "报名成功";
          }
        });
      }
    },
    collect() {
      if (this.starLock) {
        return;
      } else {
        if (!this.showStar) {
          activeCollect({
            activity_id: this.info.activity_id,
            status: "0",
          }).then((res) => {
            uni.showToast({
              title: "取消收藏",
              icon: "",
            });
            this.showStar = !this.showStar;
            this.starLock = false;
          });
        } else {
          activeCollect({
            activity_id: this.info.activity_id,
            status: "1",
          }).then((res) => {
            uni.showToast({
              title: "已收藏",
              icon: "",
            });
            this.showStar = !this.showStar;
            this.starLock = false;
          });
        }
      }
    },
    back() {
      uni.navigateBack({
        fail:()=>{
          uni.switchTab({ url: '/pages/index/index' })
        }
      });
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
  .acInfo {
    background-color: #fff;
    padding: 20rpx 40rpx;
    border-radius: 20rpx;
    position: relative;
    top: -60rpx;
    margin-bottom: 50rpx;
    .title {
      font-size: 32rpx;
      font-weight: 500;
      line-height: 36rpx;
      text-align: center;
      display: flex;
      .titleText {
        width: 85%;
      }
    }
    .star {
      width: 100rpx;
      height: 50rpx;
    }
  }
  .acContent {
    .clist {
      margin-bottom: 20rpx;
      .up {
        display: flex;
        align-items: center;
        .colorBox {
          width: 10rpx;
          height: 40rpx;
          margin-right: 20rpx;
        }
        .acTitle {
          color: rgb(0, 0, 0);
          font-size: 32rpx;
        }
      }
      .down {
        margin: 20rpx 0 20rpx 30rpx;
        color: rgb(153, 153, 153);
        font-size: 28rpx;
        font-weight: 400;
      }
    }
  }
}
.footerBtn {
  display: flex;
  justify-content: space-around;
  position: relative;
  top: -60rpx;
  .btn {
    width: 300rpx;
    height: 78rpx;
    text-align: center;
    line-height: 78rpx;
    border-radius: 100px;
    color: rgb(255, 255, 255);
    font-size: 32rpx;
    font-weight: 600;
  }
  .shareBtn {
    font-size: 32rpx;
    font-weight: 600;
    border-radius: 100px;
    width: 300rpx;
    height: 70rpx;
    text-align: center;
    line-height: 70rpx;
    background: #fff;
    border: 4rpx solid $theme-color;
  }
  .shareBtn::after{
    border: none;
  }
}
</style>
