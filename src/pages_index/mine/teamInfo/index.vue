<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" :bgColor="bgColor" @leftClick="back">
      <view slot="left">
        <view class="navTitle" v-if="!showHome">
          <u-icon name="arrow-left" color="#FFF"></u-icon>
          <text style="margin-left: 10rpx">团队详情</text>
        </view>
        <view v-else>
          <u-icon name="home" size="32px" color="#FFF"></u-icon>
        </view>
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
      <view>
        <view class="info" :style="'background:'+ themeColors" >
          <u-avatar
            size="168"
            :src="userInfo.user_one.avatar ? userInfo.user_one.avatar :userInfo.store_one.logo"
          ></u-avatar>
          <view class="name">
            <view class="userName" @tap="getUserInfo">
              <text>团长:{{ userInfo.user_one.nickname || userInfo.store_one.company_name  }}</text>
            </view>
            <view style="font-size: 24rpx">
              {{ userInfo.exhibit_one.name }}
            </view>
            <view class="userLevel"  :style="'background:'+ themeColors">
              {{ userInfo.name || "" }}
            </view>
          </view>
        </view>
        <view class="grid">
          <u-grid :col="3">
            <u-grid-item
              v-for="(item, index) in gridList"
              :key="index"
              @click="clickGrid"
            >
            <view :style="'background-image:url('+item.page_icon+');width: 64rpx;height: 64rpx;background-repeat: no-repeat;'" ></view>
              <view class="grid-text">{{ item.page_title || "" }}</view>
            </u-grid-item>
          </u-grid>
        </view>
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
                {{ item.user_one.nickname || "" }}
              </view>
              <view class="time"> {{ item.created_at || "" }} </view>
            </view>
          </view>
          <u-loadmore marginTop="30" :status="status" fontSize="32" />
        </scroll-view>
        <u-toast ref="uToast"></u-toast>
      </view>
    </view>
  </view>
</template>
<script>
import { getTeamInfo, getTeamUsers, joinTeam } from "@/api/team";
import { getTeamInfoE} from "@/api/v2";
import { getInfo } from "@/api/list";
export default {
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      showHome: false,
      imgSrc: uni.getStorageSync("ceilingImg"),
      bgColor: uni.getStorageSync('color'),
      status: "loadmore",
      page: 1,
      userInfo: {},
      teamList: {},
      list: [],
      gridList: [
        {
          page_title: "我要参团",
          page_icon: '<svg width="32.000000" height="32.000000" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Invite" d="M31.9999 20.2933L31.9999 24.5599C31.9926 26.8175 30.1642 28.646 27.9066 28.6532L16.5733 28.6533L16.28 28.6533L15.9866 28.6533L14.7466 28.6533C12.489 28.646 10.6606 26.8175 10.6533 24.5599L10.6533 20.2933C10.7053 18.636 11.707 17.1567 13.2266 16.4932C18.4225 14.393 24.2309 14.393 29.4266 16.4933C30.9462 17.1567 31.9479 18.636 31.9999 20.2933ZM21.3333 12.6667C24.2788 12.6667 26.6666 10.2789 26.6666 7.33331C26.6666 4.38779 24.2788 2 21.3333 2C18.3878 2 16 4.38779 16 7.33331C16 10.2789 18.3878 12.6667 21.3333 12.6667ZM12 14C12.7363 14 13.3333 13.4031 13.3333 12.6667C13.3333 11.9302 12.7363 11.3333 12 11.3333L8 11.3333L8 7.33331C8 6.59692 7.40302 6 6.66669 6C5.9303 6 5.33331 6.59692 5.33331 7.33331L5.33331 11.3333L1.33331 11.3333C0.596985 11.3333 0 11.9302 0 12.6667C0 13.4031 0.596985 14 1.33331 14L5.33331 14L5.33331 18C5.33331 18.7364 5.9303 19.3333 6.66669 19.3333C7.40302 19.3333 8 18.7364 8 18L8 14L12 14Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Invite" d="M31.9999 24.5599C31.9926 26.8175 30.1642 28.646 27.9066 28.6532L16.5733 28.6533L16.28 28.6533L15.9866 28.6533L14.7466 28.6533C12.489 28.646 10.6606 26.8175 10.6533 24.5599L10.6533 20.2933C10.7053 18.636 11.707 17.1567 13.2266 16.4932C18.4225 14.393 24.2309 14.393 29.4266 16.4933C30.9462 17.1567 31.9479 18.636 31.9999 20.2933L31.9999 24.5599ZM26.6666 7.33331C26.6666 4.38779 24.2788 2 21.3333 2C18.3878 2 16 4.38779 16 7.33331C16 10.2789 18.3878 12.6667 21.3333 12.6667C24.2788 12.6667 26.6666 10.2789 26.6666 7.33331ZM13.3333 12.6667C13.3333 11.9302 12.7363 11.3333 12 11.3333L8 11.3333L8 7.33331C8 6.59692 7.40302 6 6.66669 6C5.9303 6 5.33331 6.59692 5.33331 7.33331L5.33331 11.3333L1.33331 11.3333C0.596985 11.3333 0 11.9302 0 12.6667C0 13.4031 0.596985 14 1.33331 14L5.33331 14L5.33331 18C5.33331 18.7364 5.9303 19.3333 6.66669 19.3333C7.40302 19.3333 8 18.7364 8 18L8 14L12 14C12.7363 14 13.3333 13.4031 13.3333 12.6667Z" stroke="#707070" stroke-opacity="0" stroke-width="1.000000"/></svg>',
        },
        {
          page_title: "团队排行",
          page_icon: '<svg width="32.000000" height="32.000000" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Infographic" d="M3.47827 29.0434C1.55725 29.0438 0 27.4864 0 25.5655L0 20C0 18.0791 1.55725 16.5217 3.47827 16.5217C5.39929 16.5217 6.95648 18.0791 6.95648 20L6.95648 25.5652C6.95648 27.4864 5.39929 29.0434 3.47827 29.0434ZM19.4782 25.5652L19.4782 15.826C19.4782 13.9052 17.921 12.3478 15.9999 12.3478C14.0789 12.3478 12.5217 13.9052 12.5217 15.826L12.5217 25.5652C12.5217 27.4864 14.0789 29.0438 15.9999 29.0438C17.921 29.0441 19.4782 27.486 19.4782 25.5652ZM31.9999 25.5652L31.9999 7.47824C32 5.5574 30.4427 4 28.5217 4C26.6008 4 25.0435 5.5574 25.0435 7.47824L25.0434 25.5652C25.0435 27.4864 26.6007 29.0438 28.5217 29.0438C30.4429 29.0441 31.9999 27.486 31.9999 25.5652Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Infographic" d="M0 25.5655L0 20C0 18.0791 1.55725 16.5217 3.47827 16.5217C5.39929 16.5217 6.95648 18.0791 6.95648 20L6.95648 25.5652C6.95648 27.4864 5.39929 29.0434 3.47827 29.0434C1.55725 29.0438 0 27.4864 0 25.5655ZM19.4782 15.826C19.4782 13.9052 17.921 12.3478 15.9999 12.3478C14.0789 12.3478 12.5217 13.9052 12.5217 15.826L12.5217 25.5652C12.5217 27.4864 14.0789 29.0438 15.9999 29.0438C17.921 29.0441 19.4782 27.486 19.4782 25.5652L19.4782 15.826ZM31.9999 7.47824C32 5.5574 30.4427 4 28.5217 4C26.6008 4 25.0435 5.5574 25.0435 7.47824L25.0434 25.5652C25.0435 27.4864 26.6007 29.0438 28.5217 29.0438C30.4429 29.0441 31.9999 27.486 31.9999 25.5652L31.9999 7.47824Z" stroke="#707070" stroke-opacity="0" stroke-width="1.000000"/></svg>',
        },
        {
          page_title: "我的团队",
          page_icon: '<svg width="32.000000" height="32.000000" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Group" d="M12.3047 28.8963C12.4399 29.0962 12.4542 29.3544 12.3419 29.5681C12.2295 29.7817 12.0088 29.9163 11.7675 29.9184L2.62085 29.9184C1.17334 29.9184 0 28.745 0 27.2976L0 21.047C0.0599365 19.9684 0.710083 19.0109 1.69043 18.5572C5.08032 17.1639 8.77197 16.6675 12.4095 17.1158C12.6538 17.1418 12.8629 17.3024 12.9513 17.5316C13.0397 17.7607 12.9923 18.0201 12.8289 18.2034C12.1965 18.8468 11.8234 19.7005 11.7805 20.6015L11.7805 27.1535C11.8015 27.77 11.9821 28.3705 12.3047 28.8963ZM9.828 2.39999C6.57129 2.39999 3.93115 5.04007 3.93115 8.29678C3.93115 11.5535 6.57129 14.1936 9.828 14.1936C13.0847 14.1936 15.7249 11.5535 15.7249 8.29678C15.7249 5.04007 13.0847 2.39999 9.828 2.39999ZM17.0352 29.9184L29.3792 29.9184C30.8267 29.9184 32 28.745 32 27.2976L32 22.056C31.9435 20.9833 31.2979 20.0299 30.3226 19.5794C25.7229 17.731 20.5867 17.7309 15.9868 19.5793C15.0524 20.0587 14.4507 21.0064 14.4144 22.056L14.4144 27.2976C14.4144 28.745 15.5878 29.9184 17.0352 29.9184ZM23.5872 5.02078C20.6924 5.02078 18.3456 7.36749 18.3456 10.2624C18.3456 13.1573 20.6924 15.504 23.5872 15.504C26.4821 15.504 28.8289 13.1573 28.8289 10.2624C28.8289 7.36749 26.4821 5.02078 23.5872 5.02078Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Group" d="M12.3419 29.5681C12.2295 29.7817 12.0088 29.9163 11.7675 29.9184L2.62085 29.9184C1.17334 29.9184 0 28.745 0 27.2976L0 21.047C0.0599365 19.9684 0.710083 19.0109 1.69043 18.5572C5.08032 17.1639 8.77197 16.6675 12.4095 17.1158C12.6538 17.1418 12.8629 17.3024 12.9513 17.5316C13.0397 17.7607 12.9923 18.0201 12.8289 18.2034C12.1965 18.8468 11.8234 19.7005 11.7805 20.6015L11.7805 27.1535C11.8015 27.77 11.9821 28.3705 12.3047 28.8963C12.4399 29.0962 12.4542 29.3544 12.3419 29.5681ZM3.93115 8.29678C3.93115 11.5535 6.57129 14.1936 9.828 14.1936C13.0847 14.1936 15.7249 11.5535 15.7249 8.29678C15.7249 5.04007 13.0847 2.39999 9.828 2.39999C6.57129 2.39999 3.93115 5.04007 3.93115 8.29678ZM29.3792 29.9184C30.8267 29.9184 32 28.745 32 27.2976L32 22.056C31.9435 20.9833 31.2979 20.0299 30.3226 19.5794C25.7229 17.731 20.5867 17.7309 15.9868 19.5793C15.0524 20.0587 14.4507 21.0064 14.4144 22.056L14.4144 27.2976C14.4144 28.745 15.5878 29.9184 17.0352 29.9184L29.3792 29.9184ZM18.3456 10.2624C18.3456 13.1573 20.6924 15.504 23.5872 15.504C26.4821 15.504 28.8289 13.1573 28.8289 10.2624C28.8289 7.36749 26.4821 5.02078 23.5872 5.02078C20.6924 5.02078 18.3456 7.36749 18.3456 10.2624Z" stroke="#707070" stroke-opacity="0" stroke-width="1.000000"/></svg>',
        },
      ],
    };
  },
  onLoad(option) {
    uni.showLoading({
      title: "加载中",
    });
    console.log(option)
    let arr =[this.svgToUrl(this.gridList[0].page_icon),this.svgToUrl(this.gridList[1].page_icon),this.svgToUrl(this.gridList[2].page_icon)]
    this.gridList[0].page_icon = this.changeColor(arr[0],uni.getStorageSync('color'))
    this.gridList[1].page_icon = this.changeColor(arr[1],uni.getStorageSync('color'))
    this.gridList[2].page_icon = this.changeColor(arr[2],uni.getStorageSync('color'))
    
    if (option.share) {
      this.showHome = true;
      uni.setStorageSync("exhibit_id", option.exhibit_id);
      uni.setStorageSync("team_id", option.team_id);
      uni.setStorageSync("share", option.share);
    }
      getTeamInfoE({
         enroll_team_id: option.team_id,
      }).then((res) => {
      this.userInfo = res.data;
      getTeamUsers({
        enroll_team_id:this.userInfo.enroll_team_id,
        page: this.page,
      }).then((res) => {
        this.list = res.data.data;
        if (this.list.length < 15) {
          this.status = "nomore";
        }
        uni.hideLoading();
      });
    });
    //获取吸顶图
    getInfo({
      exhibit_id: uni.getStorageSync("exhibit_id"),
    }).then((res) => {
      uni.setStorageSync("ceilingImg", res.data.img);
      uni.setStorageSync('color',res.data.color_main)
      uni.setStorageSync('color_d',res.data.color_deputy);
      this.dColor = res.data.color_deputy;
    });
  },
  methods: {
    svgToUrl(url) {
				var encoded = url
					.replace(/<!--(.*)-->/g, "")
					.replace(/[\r\n]/g, " ")
					.replace(/"/g, `'`)
					.replace(/%/g, "%25")
					.replace(/&/g, "%26")
					.replace(/#/g, "%23")
					.replace(/{/g, "%7B")
					.replace(/}/g, "%7D")
					.replace(/</g, "%3C")
					.replace(/>/g, "%3E");
					let res = '"' + `data:image/svg+xml,${encoded}` + '"';//需要在字符串前后加上一对引号（非常关键！）
							
					return res;
			},
			changeColor(url, color) {
				let res = url.replace(/%23[a-zA-Z0-9]{6}/g, color.replace("#","%23")); //转义后的#等于%23，利用正则表达式，替换所有%23后6位为新的十六进制六位数。
				return res;
			},
    join() {
      uni.showLoading({
        title: "加载中",
      });
      joinTeam({
        exhibit_id: uni.getStorageSync("exhibit_id"),
        enroll_team_id: this.userInfo.enroll_team_id,
      }).then((res) => {
        uni.hideLoading();
        if (res.code == 0) {
          this.$refs.uToast.show({
            message: res.msg,
          });
        } else {
          if (uni.getStorageSync("share")) {
            uni.removeStorageSync("share");
          }
        }
        this.page = 1;
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
    },

    clickGrid(name) {
      if (name == 0) {
        if (this.userInfo.self == 1) {
          uni.showToast({
            title: "不能加入自己的团队",
            icon: "",
          });
        } else {
          this.join();
        }
      } else if (name == 1) {
        uni.redirectTo({
          url: "/pages_index/mine/team/index",
        });
      } else if (name == 2) {
        uni.navigateTo({
          url: "/pages_index/mine/myTeam/index",
        });
      }
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
    back() {
      if (this.showHome == false) {
        uni.navigateBack();
      } else {
        uni.switchTab({
          url: "/pages/index/index",
        });
      }
    },
    navigate(url) {
      uni.navigateTo({
        url: url,
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
        line-height: 36rpx;
        margin-bottom: 20rpx;
        width: 400rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
      position: absolute;
      right: 32rpx;
      top: 74rpx;
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
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
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

.footer {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #fff;
  height: 90rpx;
  width: 750rpx;
}

.grid {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  overflow: hidden;

  .grid-text {
    font-size: 28rpx;
    margin-top: 16rpx;
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
}
</style>