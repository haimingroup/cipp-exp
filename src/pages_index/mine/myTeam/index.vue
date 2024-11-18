<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" :bgColor="bgColor" @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">我的团队</text>
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
      <view class="info" :style="'background:'+ themeColors">
        <u-avatar
          size="168"
          :src="userInfo.user_one.avatar||userInfo.store_one.logo ? userInfo.user_one.avatar||userInfo.store_one.logo : ''"
        ></u-avatar>
        <view class="name">
          <view class="userName" @tap="getUserInfo">
            <text>团长:{{ userInfo.user_one.nickname ||userInfo.store_one.company_name  ||"" }}</text>
          </view>
          <view
            style="
              font-size: 24rpx;
              overflow: hidden;
              width: 150px;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ userInfo.exhibit_one.name }}
          </view>
          <view class="userLevel" :style="'background:'+ themeColors">
            {{ userInfo.name }}
          </view>
        </view>

      </view>
      <view class="gird" :style="'background:'+ themeColors+'B2'">
         <button class="shareBtn" open-type="share">
          <image
            class="paiming"
            style="margin: 0"
            src="../../static/share.png"
            mode="aspectFit"
          >
          </image>
        </button>
         <button class="shareBtn" @tap='toTeam'>
          <image
            class="paiming"
            style="margin: 0"
            src="../../static/paiming.png"
            mode="aspectFit"
          >
          </image>
        </button>
      </view>
      <view class="list">
        <view class="listTitle">
          <view class="num">团员列表</view>
        </view>
        <scroll-view
          :scroll-y="true"
          lower-threshold="20"
          @scrolltolower="scrolltolower"
          class="listContent"
        >
          <view>
            <view class="one" v-for="(item, index) in list" :key="index">
              <text class="sNum">{{ index + 1 }}</text>
              <u-avatar size="36" :src="item.user_one.avatar"></u-avatar>
              <view class="oneName">
                {{ item.user_one.nickname }}
              </view>
              <view class="time"> {{ item.created_at }} </view>
              <view class="state" v-if="item.status == 0"> 未核销 </view>
              <view
                class="state"
                style="color: #07c160"
                v-if="item.status == 1"
              >
                已到场
              </view>
            </view>
          </view>
          <u-loadmore marginTop="30" :status="status" fontSize="32" />
        </scroll-view>
      </view>
    </view>
    <u-popup
      :show="showNewTeam"
      :closeOnClickOverlay="false"
      round="10"
      mode="center"
      @close="close"
      @open="open"
    >
      <view class="popBox">
        <u-avatar size="220" :src="require('@/static/logo.png')"></u-avatar>
        <text class="popText1">您尚未成为团长 是否立即以团长身份新建团队</text>
        <text class="popRemind">成为团长后仍可加入其他团队</text>
        <view class="local">
          <text></text>
        </view>
        <view class="in"  :style="'background:'+ themeColors" @tap="join"> 新建团队 </view>
        <view class="change" @tap="cancel"> 取消 </view>
      </view>
    </u-popup>
  </view>
</template>  
<script>
import { getMyTeamInfo, createTeam, getTeamUsers } from "@/api/team";
import { getMyTeamInfoE, createTeamE} from "@/api/v2";
export default {
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      imgSrc: uni.getStorageSync("ceilingImg"),

      showNewTeam: false,
      bgColor: uni.getStorageSync('color'),
      userInfo: {},
      teamList: {},
      list: [],
      page: 1,
      status: "loadmore",
      type:0,
    };
  },
  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内分享按钮
      console.log(res.target);
    }
  
      return {
      title: "点击加入我的团队!",
      path:
        "/pages_index/mine/teamInfo/index?exhibit_id=" +
        uni.getStorageSync("exhibit_id") +
        "&team_id=" +
        this.userInfo.enroll_team_id +
        "&share=1",
     };
    
    
  },
  onShareTimeline() {
    (res) => {
      return {
        title: "点击加入我的团队!",
        path:
          "/pages_index/mine/teamInfo/index?exhibit_id=" +
          uni.getStorageSync("exhibit_id") +
          "&team_id=" +
          this.userInfo.enroll_team_id +
          "&share= 1",
        imageUrl: imageUrl,
      };
    };
  },
  onLoad(option) {
    uni.showLoading({
      title: "加载中",
    });
    console.log(option);
    if(option.type){
      this.type = 1
      console.log(1);
      getMyTeamInfoE({
        exhibit_id: uni.getStorageSync("exhibit_id"),
      }).then((res) => {
        if (res.code == 3) {
          this.showNewTeam = true;
        } else {
          this.userInfo = res.data;
        }
        getTeamUsers({
          enroll_team_id: this.userInfo.enroll_team_id,
          page: this.page,
        }).then((res) => {
          this.list = res.data.data;
          if (this.list.length < 15) {
            this.status = "nomore";
          }
        });
        uni.hideLoading();
    });
    }else{
      console.log(2);
      getMyTeamInfo({
        exhibit_id: uni.getStorageSync("exhibit_id"),
      }).then((res) => {
        if (res.code == 3) {
          this.showNewTeam = true;
        } else {
          this.userInfo = res.data;
        }
        getTeamUsers({
          enroll_team_id: this.userInfo.enroll_team_id,
          page: this.page,
        }).then((res) => {
          this.list = res.data.data;
          if (this.list.length < 15) {
            this.status = "nomore";
          }
        });
        uni.hideLoading();
    });
    }
   
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    toTeam(){
      uni.redirectTo({url: "/pages_index/mine/team/index",})
    },
    navigate(url) {
      uni.navigateTo({
        url: url,
      });
    },
    join() {
      if(this.type ==1){
        createTeamE({ exhibit_id: uni.getStorageSync("exhibit_id") }).then(
        (res) => {
          uni.showToast({
            title: "新建成功",
            icon: "success",
            mask: true,
          });
          getMyTeamInfo({
            exhibit_id: uni.getStorageSync("exhibit_id"),
          }).then((res) => {
            this.userInfo = res.data;
            this.showNewTeam = false;
            getTeamUsers({
              enroll_team_id: this.userInfo.enroll_team_id,
              page: this.page,
            }).then((res) => {
              this.list = res.data.data;
              if (this.list.length < 15) {
                this.status = "nomore";
              }
            });
          });
        }
      );
      }else{
        createTeam({ exhibit_id: uni.getStorageSync("exhibit_id") }).then(
        (res) => {
          uni.showToast({
            title: "新建成功",
            icon: "success",
            mask: true,
          });
          getMyTeamInfo({
            exhibit_id: uni.getStorageSync("exhibit_id"),
          }).then((res) => {
            this.userInfo = res.data;
            this.showNewTeam = false;
            getTeamUsers({
              enroll_team_id: this.userInfo.enroll_team_id,
              page: this.page,
            }).then((res) => {
              this.list = res.data.data;
              if (this.list.length < 15) {
                this.status = "nomore";
              }
            });
          });
        }
      );
      }
      
    },
    cancel() {
      this.showNewTeam = false;
      uni.navigateBack();
    },
    scrolltolower() {
      if (this.status == "nomore") {
        return;
      } else {
        if (this.list.length == 15) {
          this.page++;
          getTeamUsers({
            enroll_team_id: this.userInfo.enroll_team_id,
            page: this.page,
          }).then((res) => {
            res.data.data.map((item) => {
              this.list.push(item);
            });
          });
        } else if (this.list.length < 15) {
          this.status = "nomore";
        }
      }
    },
    open() {
      console.log(123);
    },
    close() {
      this.showNewTeam = false;
      uni.navigateBack();
    },
  },
};
</script>
<style lang="scss"scoped>
.page {
  min-height: 100vh;
  background: rgb(239, 239, 239);
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
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
  padding: 0 30rpx;
  .info {
    margin-top: -32rpx;
    position: relative;
    padding: 32rpx;
    border-radius: 20rpx 20rpx 0 0;
    background-color: #fff;
    display: flex;
    align-items: center;
    .name {
      margin-left: 48rpx;
      color: #fff;
      .userName {
        font-size: 36rpx;
        font-weight: 500;
        line-height: 42rpx;
        margin-bottom: 20rpx;
      }
      .userLevel {
        font-size: 24rpx;
        border-radius: 10rpx;
        padding: 8rpx 16rpx;
        width: fit-content;
        margin-top: 32rpx;
      }
    }
    .paiming {
      width: 112rpx;
      height: 120rpx;
    }
  }
  .list {
    margin-top: 40rpx;
    .listTitle {
      display: flex;
      align-items: center;
      .icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 10rpx;
      }
      .num {
        color: rgb(0, 0, 0);
        font-size: 36rpx;

        text {
          color: rgb(224, 8, 75);
          margin: 0 13rpx;
        }
      }
    }
    .listContent {
      margin-top: 40rpx;
      background: rgb(255, 255, 255);
      border-radius: 20rpx;
      padding: 30rpx;
      height: 40vh;
      width: 630rpx;

      .one {
        display: flex;
        align-items: center;
        padding: 24rpx 0;
        border-bottom: 1px solid rgb(210, 210, 210);

        .sNum {
          font-size: 32rpx;
          margin-right: 20rpx;
        }

        .oneName {
          margin-left: 20rpx;
          font-size: 32rpx;
          width: 120rpx;
        }

        .time {
          margin-left: 35rpx;
          color: rgba(153, 153, 153, 0.8);
          font-size: 24rpx;
        }

        .state {
          margin-left: 48rpx;
          color: rgba(153, 153, 153, 0.8);
          font-size: 24rpx;
        }
      }
    }
  }
}
.popBox {
  width: 686rpx;
  padding: 64rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .popText1 {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 54rpx;
    margin-top: 34rpx;
  }
  .popRemind {
    font-size: 20rpx;
    color: rgba(0, 0, 0, 0.45);
    margin-top: 32rpx;
  }
  .local {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50rpx;

    .icon {
      width: 32rpx;
      height: 42rpx;
      margin-right: 12rpx;
    }
    text {
      font-size: 40rpx;
      font-weight: 700;
      line-height: 54rpx;
    }
  }
  .in {
    margin-top: 70rpx;
    padding: 8rpx 0;
    width: 300rpx;
    text-align: center;
    color: #fff;
    font-size: 32rpx;
    font-weight: 700;
    line-height: 54rpx;
    letter-spacing: 0px;
    border-radius: 100rpx;
  }
  .change {
    margin-top: 40rpx;
    padding: 8rpx 0;
    width: 300rpx;
    text-align: center;
    color: #000;
    font-size: 32rpx;
    font-weight: 700;
    line-height: 54rpx;
    letter-spacing: 0px;
    border: 1px solid rgba(153, 153, 153, 0.8);
    background: #fff;
    border-radius: 100rpx;
  }
}
.shareBtn {
  width: 112rpx;
  height: 120rpx;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
}
button::after {
  border: none;
}
.gird{
    border-radius: 0 0 20rpx 20rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 32rpx;
}
</style>