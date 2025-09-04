<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" bgColor="#FFFFFF00" placeholder  @leftClick="back">
			<view class="navTitle" slot="left" :style="'color:' + titleColor"> 
          <u-icon name="arrow-left" color="#000"></u-icon>
      </view>
		</u-navbar>
    <view class="logo">
      <image
        class="logoImg"
        src="../../static/tarBar/center.png"
        mode="aspectFit"
      ></image>
    </view>
    <!-- 使用三元判断是否触发新用户获取手机号 -->
    <button
      class="btn"
      @getphonenumber="getphonenumber"
      @tap="clickBtn"
      :open-type="checkbox && isNew ? 'getPhoneNumber' : ''"
    >
      快速登录
    </button>
    <view class="userNotice">
      <u-checkbox-group
        v-model="checkbox"
        placement="circle"
        shape="circle"
        size="40"
        iconSize="40"
        @change="checkboxChange"
      >
        <u-checkbox name=""></u-checkbox>
      </u-checkbox-group>
      <view>
        <text>我已阅读并同意</text>
        <text style="color: #3c8dff" @tap="show = true">《用户隐私政策》</text>
      </view>
      <u-popup
        :show="show"
        :safeAreaInsetBottom="true"
        :round="10"
        closeIconPos="top-right"
        mode="bottom"
        @close="close"
        @open="open"
        :customStyle="{ ' width': '100%' }"
      >
        <view>
          <view
            style="
              padding: 40rpx 44rpx;
              display: flex;
              flex-direction: column;
              align-items: center;
              height: 503rpx;
              overflow: auto;
            "
          >
            <p style="font-weight: Bold; font-size: 28rpx">
              请阅读并同意用户协议
            </p>
            <rich-text :nodes="userNotice"></rich-text>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>
<script>
import { getPhone, getAgreement, login } from "@/api/user";
import config from "@/utils/config";
export default {
  data() {
    return {
      themeColors: uni.getStorageSync('color'),
      checkbox: false,
      show: false,
      lock: false,
      isNew: false,
      userNotice: "",
      localUrl:'',
    };
  },
  onShow() {
    this.getUserInfo();
    //获取协议请求
    getAgreement({
      obj_id: config.obj_id,
      type: 1,
    }).then((res) => {
      this.userNotice = res.data.content;
    });
  },
  onLoad(options){
    this.localUrl = options.data
    console.log(options)
  },
  methods: {
    //获取用户js-code等信息，在onShow生命周期触发
    getUserInfo() {
      uni.login({
        provider: "weixin",
        scopes: "auth_user",
        success: (loginRes) => {
          uni.getUserInfo({
            provider: "weixin",
            success: (infoRes) => {
              login({
                js_code: loginRes.code,
                iv: infoRes.iv,
                encrypted_data: infoRes.encryptedData,
                code: config.project,
              }).then(async (res) => {
                uni.setStorageSync("uniond", res.data.unionid);
                if (res.data.token) {
                  uni.setStorageSync("token", res.data.token);
                  let timestamp = Date.now();
                  uni.setStorageSync('defaultTime',timestamp + 259200000)
                  } else {
                  this.isNew = true;
                }
              //  getOpenid({
              //   js_code: loginRes.code,
              //   iv: infoRes.iv,
              //   encrypted_data: infoRes.encryptedData,
              //   code: config.project,
              //   }).then((res)=>{
              //       uni.setStorageSync('openid',res.data.openid)
              //   })
                this.lock = true;
              });
              
            },
          });
        },
      });
    },
    //点击手机号快捷登录按钮触发事件
    clickBtn() {
      if (!this.lock) {
        return;
      }
      if (this.checkbox == false) {
        uni.showToast({
          title: "请阅读并勾选用户协议",
          icon: "none",
        });
      } else {
        if (!this.isNew) {
          if(uni.getStorageSync('scene')){
				    uni.navigateTo({
					    url: '/pages/agreement/index?scene='+uni.getStorageSync('scene')
			      })
          }else if(uni.getStorageSync("toexinfo")){
              uni.navigateTo({
									url: '/pages_index/exhibitorInfo/index?store_id'+uni.getStorageSync("store_id")
								})
          }else{
            if (this.localUrl) {
              if (this.localUrl.substring(0, 6) == "pages/") {
                if (this.localUrl == "pages/mine/index") {
                  uni.switchTab({ url: "/pages/index/index" });
                } else if (this.localUrl == "pages/navigation/index") {
                  uni.redirectTo({ url: "/" + this.localUrl });
                } else {
                  uni.switchTab({ url: "/" + this.localUrl });
                }
              } else {
                uni.redirectTo({ url: "/" + this.localUrl });
              }
            } else {
              uni.switchTab({ url: "/pages/index/index" });
            }
          }
        }
      }
    },
    //点击允许手机号触发回调
    getphonenumber(e) {
      if (this.checkbox) {
        const detail = e.detail;
        getPhone({
          unionid: uni.getStorageSync("uniond"),
          iv: detail.iv,
          code: config.project,
          encrypted_data: detail.encryptedData,
          type: 0,
        }).then((res) => {
          if (res.code == "0") {
            uni.showToast({
              title: "手机号授权失败",
              icon: "none",
            });
          } else {
            uni.hideLoading();
            uni.setStorageSync("token", res.data.token);
            uni.redirectTo({
              url: "/pages/login/userInfo",
            });
          }
        });
      }
    },
    //协议打勾 改变值
    checkboxChange(e) {
      if (e.length !== 0) {
        this.checkbox = e[0];
      } else {
        this.checkbox = false;
      }
    },
    back() {
      uni.removeStorageSync('token')
      uni.removeStorageSync('uniond')
      uni.removeStorageSync('openid')
      if (this.localUrl) {
        if (this.localUrl.substring(0, 6) == "pages/") {
          if (this.localUrl == "pages/mine/index") {
            uni.switchTab({ url: "/pages/index/index" });
          } else if (this.localUrl == "pages/navigation/index") {
            uni.redirectTo({ url: "/" + this.localUrl });
          } else {
            uni.switchTab({ url: "/" + this.localUrl });
          }
        } else {
          uni.redirectTo({ url: "/" + this.localUrl });
        }
      } else {
        uni.switchTab({ url: "/pages/index/index" });
      }
      },
    close() {
      this.show = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.navTitle {
        display: flex;
        font-size: 36rpx;
        font-weight: 700;
        line-height: 36rpx;
        text-align: left;
    }
.logo {
  width: 256rpx;
  height: 256rpx;
  position: fixed;
  top: 177px;
}

.logoImg {
  width: 256rpx;
  height: 256rpx;
}

.btn {
  background: #004098;
  border-radius: 100px;
  position: fixed;
  padding: 0 180rpx;
  bottom: 300px;
  margin: 0 auto;
  color: #fff;
  button::after {
    border: none;
  }
}

.userNotice {
  position: fixed;
  bottom: 250px;
  display: flex;
  align-items: center;
}
</style>