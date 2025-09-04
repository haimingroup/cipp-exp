<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" :bgColor="bgColor">
      <view class="navTitle" slot="left" :style="'color:' + titleColor">
        我的
      </view>
    </u-navbar>
    <view class="header">
      <image
        style="width: 750rpx; height: 532rpx; display: flex"
        :src="imgSrc"
        mode="aspectFill"
      />
    </view>
    <view class="content">
      <!-- 用户名称 -->
      <view class="userInfo">
        <u-avatar
          size="168"
          :src="userInfo.avatar"
          @tap="
            navigator('/pages/login/userInfo?info=' + JSON.stringify(userInfo))
          "
        ></u-avatar>
        <!-- <img v-if="userInfo.type == 1" :src="levelList[userInfo.grade-1]" alt="" class="levBox"> -->
        <view class="name">
          <view class="userName" @tap="getInfo">
            <text v-if="userInfo.nickname">{{ userInfo.nickname }}</text>
            <text v-else >登录/注册</text>
          </view>
          <view class="userLevel">
            <text
              v-if="userInfo.type == 0"
              :style="
                userInfo.type == 0
                  ? `background-color: rgba(153, 153, 153, 0.7)`
                  : `background-color: #FF2E2E`
              "
              >观众</text
            >
            <text
              v-if="userInfo.type == 1"
              :style="
                userInfo.type == 0
                  ? `background-color: rgba(153, 153, 153, 0.7)`
                  : `background-color: #FF2E2E`
              "
              >展商</text
            >
            <text v-if="userInfo.type == 2" style="background-color: #01d410"
              >主办方</text
            >
            <text
              v-if="userInfo.store_exhibit"
              :style="
                userInfo.type == 0
                  ? `background-color: rgba(153, 153, 153, 0.7)`
                  : `background-color: #FF2E2E`
              "
              >参展商</text
            >
          </view>
        </view>
        <view
          v-if="userInfo.type == 1"
          class="task"
          @tap="navigator('/pages_platform/test/index')"
        >
          <u-icon name="bell-fill" color="#FFED00" size="60"></u-icon>
          <u-badge
            v-if="userInfo.task_num != 0"
            :value="userInfo.task_num"
            :type="`error`"
          ></u-badge>
        </view>
        <!-- 核销功能 -->
        <!-- <view v-if="userInfo.type == 1" class="task" @tap="navigator('/pages_host/verification/index')">
					<u-icon name="scan" color="#7d7d7d" size="60"></u-icon>
				</view> -->
        <view
          v-if="userInfo.type == 2"
          class="task"
          @tap="navigator('/pages_index/pay/list')"
        >
          <u-icon name="scan" color="#7d7d7d" size="60"></u-icon>
        </view>
      </view>

      <!-- 暂时隐藏 -->
      <view v-if="userInfo.type !== 2" class="functionality">
        <u-grid :border="false" col="4" @click="clickGrid">
          <u-grid-item v-for="(item, index) in jglist" :key="index">
            <view
              :style="
                'background-image:url(' +
                item.src +
                ');width: 80rpx;height: 80rpx;background-repeat:no-repeat'
              "
            ></view>
            <view class="grid-text">{{ item.name }}</view>
          </u-grid-item>
        </u-grid>
      </view>
      <view v-else class="functionality">
        <u-grid :border="false" col="4" @click="zbfGrid">
          <u-grid-item v-for="(item, index) in zblist" :key="index">
            <view
              :style="
                'background-image:url(' +
                item.src +
                ');width: 80rpx;height: 80rpx;background-repeat:no-repeat'
              "
            ></view>
            <view class="grid-text">{{ item.name }}</view>
          </u-grid-item>
        </u-grid>
      </view>
      <view class="footer" v-if="userInfo.type == 1">
        <view>平台信息</view>
        <u-cell-group :border="false">
          <!-- <u-cell  @tap="navigator('/pages_platform/level/index?current='+userInfo.grade-1)" title="会员权益" :isLink="true">
						<view slot="icon">
							<view :style="'background-image:url('+mebSrc+');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-position: center center;background-repeat:no-repeat'" ></view>
						</view>
					</u-cell> -->
          <u-cell
            @tap="navigator('/pages_platform/certification/index')"
            title="资质信息"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  cerSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-position: center center;background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell>
          <u-cell
            @tap="navigator('/pages_platform/certification/upData')"
            title="上传资质"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  upSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-position: center center;background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell>
          <u-cell
            @tap="navigator('/pages_platform/store/index')"
            title="展商信息"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  storeSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-position: center center;background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell>
          <u-cell
            @tap="navigator('/pages_platform/exhibit/index')"
            title="展品信息"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  exhSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-position: center center;background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell>
          <u-cell
            @tap="navigator('/pages_platform/relation/index')"
            title="联系信息"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  relSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-position: center center; background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell>
          <!-- <u-cell
            @tap="toMatch"
            title="参赛信息"
            :border="false"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  matSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-position: center center; background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell> -->
        </u-cell-group>
      </view>
      <view class="footer" v-if="userInfo.store_exhibit">
        <view>参展服务</view>
        <u-cell-group :border="false">
          <u-cell
            @tap="navigator('/pages_platform/meiban/index')"
            title="楣板提报"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  mSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-position: center center;background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell>
          <!-- navigator('/pages_platform/certificate/index') -->
          <u-cell
            @tap="navigator('/pages_platform/certificate/index')"
            title="展商证件"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  cersSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-position: center center;background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell>
          <u-cell
            @tap="toexques"
            title="展商问卷"
			:isLink="true"
            :border="false"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  quesSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-position: center center;background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell>
        </u-cell-group>
      </view>

      <view class="footer" v-if="showToken">
        <u-cell-group :border="false">
          <u-cell
            v-if="userInfo.type !== 2"
            @tap="navigator('/pages_index/mine/team/index')"
            title="团队排行"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  cupSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-repeat:no-repeat'
                "
              >
              </view>
            </view>
          </u-cell>
          <u-cell
            title="我的积分"
            v-if="userInfo.type !== 2"
            @tap="navigator('/pages_platform/integral/index')"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  levelSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell>
          <u-cell
            v-if="userInfo.type !== 2"
            @tap="navigator('/pages_index/mine/contact/index')"
            title="联系我们"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  callSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell>
          <!-- <u-cell
            @tap="showCheck = true"
            title="切换账号"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  exitSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell> -->
          <u-modal
            :show="showCheck"
            :title="title"
            confirmColor="red"
            :showConfirmButton="false"
            @confirm="changeId"
            @cancel="showCheck = false"
          >
            <view>
              <view>确认切换账号?</view>
              <view>
                <view>取消</view>
                <button>确认</button>
              </view>
            </view>
          </u-modal>
          <u-cell
            @tap="showExit = true"
            title="退出登录"
            :border="false"
            :isLink="true"
          >
            <view slot="icon">
              <view
                :style="
                  'background-image:url(' +
                  exitSrc +
                  ');width: 48rpx;height: 48rpx;margin-right: 40rpx;background-repeat:no-repeat'
                "
              ></view>
            </view>
          </u-cell>
          <u-modal
            :show="showExit"
            :title="title"
            confirmColor="red"
            showCancelButton
            @confirm="exit"
            @cancel="showExit = false"
          >
            <view>确认退出?</view>
          </u-modal>
        </u-cell-group>
      </view>
    </view>
	<!-- 底部导航栏 数据读取自pages.json tarbar -->
		<m-tabbar name="new" ref="tabbar" native :beforeChange="onBeforeChange">
			<template v-slot:tabbar_index_2>
				<view class="custom_style">
					<image class="btnImg" src="../../static/tarBar/center.png" mode=""></image>
					<text>{{ cneterTitle }}</text>
				</view>
			</template>                                                                                                                                                             
		</m-tabbar>
  </view>
</template>
<script>
import { getInfo, getMyTeamInfoE } from "@/api/v2";
import { getMyTeamInfo } from "@/api/team";
import { getMyTicket } from "@/api/register";
import { getConfig } from "@/api/match";
import config from "@/utils/config.js";
import { homeData, getSlider } from "@/api/list";
import { getPhone, login } from "@/api/user";

export default {
  data() {
    return {
      themeColors: "",
      imgSrc: uni.getStorageSync("ceilingImg"),
      cneterTitle: config.center,
      homeList: {},
      slider: [],
      levelList: [
        "https://qdhaiming.oss-cn-qingdao.aliyuncs.com/XCX/VIP/1.png",
        "https://qdhaiming.oss-cn-qingdao.aliyuncs.com/XCX/VIP/2.png",
        "https://qdhaiming.oss-cn-qingdao.aliyuncs.com/XCX/VIP/3.png",
        "https://qdhaiming.oss-cn-qingdao.aliyuncs.com/XCX/VIP/4.png",
      ],
      showCheck: false,
      showExit: false,
      titleColor: "rgb(255,255,255)",
      //元素滚动值
      scrollTop: 0,
      //顶部标题栏背景色
      bgColor: "rgba(0,0,0,0)",
      userInfo: {},
      mebSrc:
        '<svg width="24.000000" height="24.000000" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M21.68 2.45L19.87 2.45L19.87 0.89C19.87 0.78 19.85 0.66 19.8 0.55C19.75 0.44 19.68 0.34 19.59 0.26C19.5 0.17 19.39 0.1 19.27 0.06C19.15 0.02 19.02 -0.01 18.89 0L5.43 0C5.17 0 4.92 0.09 4.73 0.26C4.55 0.43 4.45 0.66 4.45 0.89L4.45 2.45L2.57 2.45C1.98 2.44 1.4 2.63 0.96 3C0.52 3.37 0.27 3.89 0.24 4.43L0.24 8.31C0.24 8.58 0.31 8.85 0.43 9.1C0.56 9.34 0.74 9.56 0.96 9.74L5.77 13.65C6.38 14.46 7.19 15.13 8.11 15.63C9.04 16.13 10.08 16.44 11.15 16.53L11.15 18.46L7.95 18.46C7.38 18.47 6.82 18.67 6.4 19.02C5.97 19.38 5.7 19.87 5.65 20.39L5.45 21.59C5.41 21.9 5.44 22.21 5.54 22.5C5.63 22.79 5.8 23.06 6.02 23.29C6.23 23.51 6.5 23.69 6.8 23.82C7.1 23.94 7.43 24 7.76 24L16.56 24C16.89 23.99 17.21 23.93 17.51 23.8C17.81 23.68 18.08 23.5 18.3 23.27C18.52 23.04 18.68 22.78 18.78 22.49C18.87 22.2 18.9 21.89 18.86 21.59L18.66 20.39C18.59 19.88 18.31 19.42 17.89 19.08C17.46 18.74 16.92 18.55 16.36 18.55L13.14 18.55L13.14 16.56C14.25 16.46 15.33 16.14 16.28 15.61C17.24 15.08 18.05 14.36 18.66 13.51L23.27 9.75C23.5 9.57 23.68 9.35 23.8 9.1C23.93 8.85 23.99 8.58 24 8.31L24 4.43C23.98 4.17 23.92 3.9 23.79 3.66C23.67 3.41 23.5 3.19 23.28 3C23.07 2.82 22.82 2.68 22.54 2.58C22.26 2.49 21.97 2.45 21.68 2.45ZM2.21 8.31L2.21 4.43C2.21 4.37 2.35 4.26 2.57 4.26L4.45 4.26L4.45 9.76C4.45 9.91 4.45 10.04 4.45 10.17L2.21 8.31ZM15.3 7.83L14.44 8.61L14.63 9.7C14.66 9.87 14.65 10.04 14.58 10.2C14.51 10.35 14.4 10.49 14.25 10.59C14.09 10.71 13.9 10.78 13.69 10.79C13.53 10.79 13.38 10.76 13.24 10.69L12.12 10.14L11.04 10.65C10.88 10.73 10.7 10.77 10.52 10.76C10.33 10.75 10.16 10.69 10.01 10.59C9.86 10.49 9.75 10.35 9.68 10.2C9.61 10.04 9.59 9.87 9.62 9.7L9.83 8.61L8.95 7.83C8.82 7.71 8.73 7.56 8.68 7.4C8.64 7.24 8.64 7.07 8.7 6.91C8.76 6.75 8.86 6.6 9.01 6.5C9.15 6.39 9.32 6.32 9.5 6.29L10.81 6.13L11.35 5.13C11.44 4.99 11.57 4.88 11.72 4.8C11.88 4.72 12.05 4.68 12.23 4.68C12.41 4.68 12.58 4.72 12.74 4.8C12.89 4.88 13.02 4.99 13.11 5.13L13.65 6.13L14.86 6.29C15.04 6.32 15.2 6.39 15.34 6.5C15.48 6.61 15.58 6.75 15.64 6.91C15.69 7.07 15.69 7.25 15.63 7.41C15.58 7.58 15.47 7.72 15.33 7.83L15.3 7.83ZM16.35 20.29C16.44 20.29 16.52 20.32 16.58 20.37C16.65 20.42 16.69 20.5 16.7 20.58L16.9 21.77C16.9 21.82 16.9 21.87 16.88 21.92C16.87 21.96 16.84 22 16.81 22.04C16.77 22.08 16.73 22.11 16.68 22.13C16.64 22.15 16.58 22.16 16.53 22.16L7.76 22.16C7.71 22.16 7.66 22.15 7.61 22.13C7.57 22.11 7.53 22.08 7.5 22.04C7.46 22.01 7.43 21.96 7.41 21.92C7.4 21.87 7.39 21.82 7.4 21.77L7.59 20.58C7.6 20.5 7.65 20.42 7.71 20.37C7.78 20.32 7.87 20.29 7.95 20.29L16.35 20.29ZM21.96 8.39L19.86 10.12C19.86 10 19.86 9.88 19.86 9.76L19.86 4.26L21.68 4.26C21.9 4.26 22.03 4.37 22.03 4.43L21.96 8.39Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
      //资质上传
      upSrc:
        '<svg width="18.470573" height="20.000000" viewBox="0 0 18.4706 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M9.22 0C4.76 0 1.13 3.63 1.13 8.09C1.13 9.69 1.59 11.17 2.39 12.42C2.68 12.89 3.01 13.31 3.39 13.7L3.7 14.01C3.8 14.09 3.89 14.17 3.99 14.27C4.44 14.65 4.94 14.98 5.47 15.26C5.6 15.33 5.73 15.39 5.86 15.45C5.99 15.51 6.12 15.56 6.26 15.62C6.73 15.8 7.23 15.96 7.74 16.04C8.22 16.14 8.71 16.18 9.22 16.18C9.74 16.18 10.24 16.14 10.73 16.04C11.25 15.95 11.74 15.8 12.21 15.62L12.21 15.61C12.34 15.55 12.48 15.5 12.61 15.43C12.74 15.38 12.87 15.31 13 15.25C13.03 15.23 13.05 15.22 13.08 15.21C13.43 15.01 13.76 14.79 14.07 14.58C14.2 14.47 14.32 14.38 14.44 14.28C14.55 14.18 14.66 14.09 14.77 13.99C14.87 13.89 14.98 13.78 15.08 13.67C15.45 13.29 15.78 12.87 16.08 12.41C16.86 11.16 17.32 9.68 17.32 8.09C17.32 3.63 13.69 0 9.22 0ZM13.06 7.48L11.47 9.05C11.4 9.1 11.37 9.2 11.39 9.31L11.77 11.5C11.81 11.74 11.56 11.92 11.34 11.81L9.37 10.77C9.28 10.73 9.18 10.73 9.09 10.77L7.12 11.81C6.9 11.92 6.65 11.74 6.69 11.5L7.07 9.31C7.08 9.2 7.05 9.12 6.99 9.05L5.39 7.48C5.22 7.31 5.31 7.03 5.55 6.98L7.76 6.67C7.85 6.66 7.93 6.59 7.98 6.51L8.96 4.51C9.07 4.29 9.38 4.29 9.49 4.51L10.47 6.51C10.52 6.59 10.6 6.66 10.69 6.67L12.9 6.98C13.14 7.03 13.23 7.31 13.06 7.48Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M2.87 14.58C2.49 14.21 2.14 13.81 1.84 13.37L0.1 16.39C-0.04 16.63 -0.04 16.92 0.11 17.16C0.25 17.39 0.49 17.53 0.79 17.51L3.25 17.38L4.37 19.58C4.49 19.82 4.74 19.98 5.02 19.99C5.02 19.99 5.03 19.99 5.04 19.99C5.3 19.99 5.55 19.85 5.69 19.61L7.22 16.95C6.72 16.84 6.23 16.69 5.76 16.49C4.67 16.04 3.69 15.39 2.87 14.58Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M18.37 16.04L16.61 13C16.3 13.43 15.96 13.85 15.57 14.21C14.75 15.03 13.77 15.68 12.69 16.12C12.22 16.33 11.74 16.48 11.24 16.59L12.78 19.26C12.91 19.5 13.16 19.64 13.43 19.64C13.43 19.64 13.44 19.64 13.45 19.64C13.72 19.62 13.97 19.46 14.09 19.23L15.21 17.03L17.68 17.16C17.97 17.18 18.21 17.04 18.36 16.81C18.5 16.57 18.5 16.28 18.37 16.04Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
      //资质信息
      cerSrc:
        '<svg width="20.000000" height="17.000000" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M15.27 2.43L14.88 2.43C14.55 0.52 12.99 -0.94 11.12 -0.94L1.29 -0.94C0.03 -0.94 -1 0.16 -1 1.5C-1 1.59 -0.98 1.67 -0.97 1.76C-0.98 1.8 -1 1.84 -1 1.89L-1 13.19C-1 15.25 0.68 16.93 2.73 16.93L15.27 16.93C17.32 16.93 19 15.25 19 13.19L19 6.16C19 4.1 17.32 2.43 15.27 2.43ZM14.71 10.94C14.02 10.94 13.45 10.38 13.45 9.68C13.45 8.98 14.02 8.41 14.71 8.41C15.41 8.41 15.98 8.98 15.98 9.68C15.98 10.38 15.41 10.94 14.71 10.94ZM1.29 0.56L11.12 0.56C12.17 0.56 13.05 1.35 13.34 2.43L1.29 2.43C0.85 2.43 0.5 2.01 0.5 1.5C0.5 0.98 0.85 0.56 1.29 0.56Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
      //店铺信息
      storeSrc:
        '<svg width="24.000000" height="24.000000" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M18.47 13.34C18.04 13.43 17.6 13.47 17.17 13.48C16.08 13.49 15 13.19 14.08 12.62C13.15 13.18 12.08 13.47 11 13.47C9.91 13.47 8.84 13.18 7.92 12.62C6.99 13.19 5.92 13.49 4.83 13.48C4.39 13.47 3.95 13.43 3.53 13.34C3.08 13.24 2.64 13.1 2.23 12.9L2 12.79L2 18C2 18.74 2.29 19.45 2.82 19.98C3.34 20.51 4.05 20.8 4.8 20.8L8.19 20.8L8.19 15.91C8.19 15.71 8.26 15.52 8.41 15.37C8.55 15.23 8.74 15.16 8.94 15.16L13.06 15.16C13.25 15.16 13.45 15.23 13.59 15.37C13.73 15.52 13.81 15.71 13.81 15.91L13.81 20.77L17.17 20.77C17.91 20.77 18.62 20.48 19.15 19.96C19.68 19.44 19.99 18.74 20 18L20 12.79L19.8 12.9C19.37 13.1 18.93 13.25 18.47 13.34Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M4.52 3.23L7.39 3.23L7.39 11.16C6.65 11.71 5.75 12 4.83 12C4.39 12 3.95 11.93 3.53 11.81C3.31 11.75 3.09 11.67 2.89 11.57C2.55 11.41 2.25 11.19 2 10.92C1.62 10.52 1.35 10.04 1.2 9.52C1.05 9 1.03 8.45 1.15 7.92L1.73 5.19C1.9 4.59 2.27 4.07 2.78 3.71C3.28 3.36 3.9 3.18 4.52 3.23Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M8.39 3.22L13.61 3.22L13.61 11.11C12.85 11.67 11.94 11.98 11 11.98C10.05 11.98 9.14 11.67 8.39 11.11L8.39 3.22Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M20 10.91C19.75 11.17 19.46 11.39 19.14 11.55C18.93 11.65 18.72 11.73 18.5 11.79C18.07 11.91 17.64 11.98 17.2 11.98C16.28 11.99 15.38 11.7 14.64 11.16L14.64 3.22L17.51 3.22C18.12 3.19 18.72 3.36 19.22 3.72C19.72 4.07 20.09 4.58 20.27 5.17L20.85 7.87C20.85 7.9 20.85 7.94 20.85 7.97C20.95 8.5 20.93 9.03 20.78 9.54C20.63 10.06 20.36 10.52 20 10.91Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
      //展品信息
      exhSrc:
        '<svg width="20.000000" height="20.000000" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M18.25 8.51L16.43 8.51L11.17 3.06C11.24 2.83 11.29 2.59 11.29 2.33C11.29 1.05 10.26 0 9 0C7.74 0 6.71 1.05 6.71 2.33C6.71 2.56 6.75 2.79 6.81 3L1.49 8.51L-0.25 8.51C-0.66 8.51 -1 8.84 -1 9.26C-1 9.68 -0.66 10.01 -0.25 10.01L-0.01 10.01L0.58 16.96C0.75 18.68 1.98 20 3.44 20L14.56 20C16.02 20 17.25 18.68 17.42 16.95L17.92 10.01L18.25 10.01C18.66 10.01 19 9.68 19 9.26C19 8.84 18.66 8.51 18.25 8.51ZM9 1.5C9.44 1.5 9.79 1.88 9.79 2.33C9.79 2.81 9.44 3.18 9 3.18C8.56 3.18 8.21 2.81 8.21 2.33C8.21 1.88 8.56 1.5 9 1.5ZM7.68 4.26C8.05 4.53 8.51 4.68 9 4.68C9.47 4.68 9.91 4.54 10.27 4.29L14.34 8.51L3.57 8.51L7.68 4.26ZM4.08 15.31L4.08 13.18C4.08 12.77 4.42 12.43 4.83 12.43C5.25 12.43 5.58 12.77 5.58 13.18L5.58 15.31C5.58 15.73 5.25 16.06 4.83 16.06C4.42 16.06 4.08 15.73 4.08 15.31ZM8.19 15.31L8.19 13.18C8.19 12.77 8.53 12.43 8.94 12.43C9.36 12.43 9.69 12.77 9.69 13.18L9.69 15.31C9.69 15.73 9.36 16.06 8.94 16.06C8.53 16.06 8.19 15.73 8.19 15.31ZM13.8 15.31C13.8 15.73 13.47 16.06 13.05 16.06C12.64 16.06 12.3 15.73 12.3 15.31L12.3 13.18C12.3 12.77 12.64 12.43 13.05 12.43C13.47 12.43 13.8 12.77 13.8 13.18L13.8 15.31Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
      //联系信息
      relSrc:
        '<svg width="24.000000" height="24.000000" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M21.01 12C21.01 6.48 16.52 2 11.01 2C5.49 2 1.01 6.48 1.01 12C1.01 17.51 5.49 22 11.01 22C12.51 22 13.96 21.67 15.32 21.01L20.1 21.72C20.33 21.75 20.57 21.67 20.74 21.5C20.9 21.34 20.98 21.1 20.95 20.86L20.21 15.89C20.74 14.64 21.01 13.34 21.01 12ZM6.89 13.03C6.33 13.03 5.87 12.56 5.87 12C5.87 11.43 6.33 10.97 6.89 10.97C7.46 10.97 7.92 11.43 7.92 12C7.92 12.56 7.46 13.03 6.89 13.03ZM11 13.03C10.44 13.03 9.98 12.56 9.98 12C9.98 11.43 10.44 10.97 11 10.97C11.57 10.97 12.03 11.43 12.03 12C12.03 12.56 11.57 13.03 11 13.03ZM15.12 13.03C14.55 13.03 14.09 12.56 14.09 12C14.09 11.43 14.55 10.97 15.12 10.97C15.68 10.97 16.14 11.43 16.14 12C16.14 12.56 15.68 13.03 15.12 13.03Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
      //参赛信息
      matSrc:
        '<svg width="18.245117" height="20.000000" viewBox="0 0 18.2451 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M9.22 0C4.76 0 1.13 3.63 1.13 8.1C1.13 9.68 1.59 11.17 2.39 12.42C2.68 12.88 3.01 13.31 3.39 13.7L3.7 14.01C3.8 14.09 3.89 14.17 3.99 14.27C4.44 14.64 4.94 14.98 5.47 15.26C5.6 15.33 5.73 15.38 5.86 15.45C5.99 15.51 6.12 15.57 6.26 15.62C6.73 15.81 7.23 15.96 7.74 16.04C8.22 16.13 8.71 16.18 9.22 16.18C9.74 16.18 10.24 16.13 10.73 16.04C11.25 15.95 11.74 15.81 12.21 15.62L12.21 15.6C12.34 15.56 12.48 15.5 12.61 15.43C12.74 15.37 12.87 15.31 13 15.25C13.03 15.23 13.05 15.22 13.08 15.21C13.43 15.01 13.76 14.8 14.07 14.58C14.2 14.47 14.32 14.37 14.44 14.28C14.55 14.17 14.66 14.09 14.77 13.99C14.87 13.88 14.98 13.78 15.08 13.67C15.45 13.29 15.78 12.87 16.08 12.4C16.86 11.15 17.32 9.67 17.32 8.1C17.32 3.63 13.69 0 9.22 0ZM13.06 7.48L11.47 9.05C11.4 9.11 11.37 9.2 11.39 9.31L11.77 11.5C11.81 11.74 11.56 11.91 11.34 11.81L9.37 10.77C9.28 10.73 9.18 10.73 9.09 10.77L7.12 11.81C6.9 11.91 6.65 11.74 6.69 11.5L7.07 9.31C7.08 9.2 7.05 9.11 6.99 9.05L5.39 7.48C5.22 7.32 5.31 7.03 5.55 6.98L7.76 6.66C7.85 6.65 7.93 6.6 7.98 6.51L8.96 4.51C9.07 4.29 9.38 4.29 9.49 4.51L10.47 6.51C10.52 6.6 10.6 6.65 10.69 6.66L12.9 6.98C13.14 7.03 13.23 7.32 13.06 7.48Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M2.87 14.58C2.49 14.22 2.14 13.81 1.84 13.37L0.1 16.39C-0.04 16.63 -0.04 16.92 0.11 17.16C0.25 17.39 0.49 17.53 0.79 17.51L3.25 17.38L4.37 19.58C4.49 19.82 4.74 19.99 5.02 20C5.02 20 5.03 20 5.04 20C5.3 20 5.55 19.85 5.69 19.61L7.22 16.95C6.72 16.84 6.23 16.7 5.76 16.5C4.67 16.04 3.69 15.39 2.87 14.58Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M18.15 16.2L16.44 13C16.14 13.46 15.81 13.89 15.43 14.27C14.64 15.14 13.69 15.82 12.64 16.29C12.19 16.51 11.72 16.66 11.24 16.78L12.73 19.59C12.86 19.85 13.1 20 13.36 20C13.36 20 13.37 20 13.38 20C13.64 19.98 13.88 19.82 14 19.56L15.09 17.24L17.48 17.38C17.76 17.4 17.99 17.25 18.14 17.01C18.27 16.76 18.27 16.45 18.15 16.2Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
      //参展服务
	    quesSrc:'<svg width="20.000000" height="20.000000" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M17.19 0L15.14 0L10 0L2.81 0C1.25 0 0 1.25 0 2.8L0 17.18C0 18.74 1.25 20 2.81 20L13.08 20C14.63 20 15.89 18.74 15.89 17.18L15.89 10.75L17.19 10.75C18.74 10.75 20 9.48 20 7.93L20 2.8C20 1.25 18.74 0 17.19 0ZM12.06 10.79L7.94 10.79C7.53 10.79 7.19 10.46 7.19 10.04C7.19 9.63 7.53 9.29 7.94 9.29L12.06 9.29C12.47 9.29 12.81 9.63 12.81 10.04C12.81 10.46 12.47 10.79 12.06 10.79ZM12.81 15.18C12.81 15.6 12.47 15.93 12.06 15.93L7.94 15.93C7.53 15.93 7.19 15.6 7.19 15.18C7.19 14.77 7.53 14.43 7.94 14.43L12.06 14.43C12.47 14.43 12.81 14.77 12.81 15.18ZM4.85 5.65L3.82 5.65C3.41 5.65 3.07 5.31 3.07 4.9C3.07 4.48 3.41 4.15 3.82 4.15L4.85 4.15C5.27 4.15 5.6 4.48 5.6 4.9C5.6 5.31 5.27 5.65 4.85 5.65ZM5.6 10.04C5.6 10.46 5.27 10.79 4.85 10.79L3.82 10.79C3.41 10.79 3.07 10.46 3.07 10.04C3.07 9.63 3.41 9.29 3.82 9.29L4.85 9.29C5.27 9.29 5.6 9.63 5.6 10.04ZM3.82 14.43L4.85 14.43C5.27 14.43 5.6 14.77 5.6 15.18C5.6 15.6 5.27 15.93 4.85 15.93L3.82 15.93C3.41 15.93 3.07 15.6 3.07 15.18C3.07 14.77 3.41 14.43 3.82 14.43ZM12.06 5.65L7.94 5.65C7.53 5.65 7.19 5.31 7.19 4.9C7.19 4.48 7.53 4.15 7.94 4.15L12.06 4.15C12.47 4.15 12.81 4.48 12.81 4.9C12.81 5.31 12.47 5.65 12.06 5.65ZM18.5 7.93C18.5 8.66 17.91 9.25 17.19 9.25L15.89 9.25L15.89 2.8L15.89 1.5L17.19 1.5C17.91 1.5 18.5 2.07 18.5 2.8L18.5 7.93Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
      //楣板提交
      mSrc: '<svg width="20.000000" height="18.110107" viewBox="0 0 20 18.1101" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M17.63 8.42L12.16 2.97C12.24 2.76 12.28 2.53 12.28 2.29C12.28 1.03 11.25 0 10 0C8.74 0 7.71 1.03 7.71 2.29C7.71 2.51 7.75 2.7 7.8 2.9L2.27 8.43C2.26 8.43 2.26 8.43 2.26 8.43C0.98 8.68 0 9.83 0 11.2L0 15.31C0 16.85 1.25 18.11 2.81 18.11L17.18 18.11C18.74 18.11 20 16.85 20 15.31L20 11.2C20 9.8 18.97 8.64 17.63 8.42ZM10 1.5C10.43 1.5 10.78 1.85 10.78 2.29C10.78 2.72 10.43 3.08 10 3.08C9.56 3.08 9.21 2.72 9.21 2.29C9.21 1.85 9.56 1.5 10 1.5ZM8.67 4.15C9.05 4.41 9.5 4.58 10 4.58C10.47 4.58 10.91 4.43 11.26 4.19L15.47 8.38L4.44 8.38L8.67 4.15Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
      //展商证件
      cersSrc:
        '<svg width="20.000000" height="20.000000" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M10 0C4.49 0 0 4.48 0 10C0 15.51 4.49 20 10 20C15.5 20 20 15.51 20 10C20 4.48 15.5 0 10 0ZM9.8 4.77C11.58 4.77 13.01 6.2 13.01 7.98C13.01 9.76 11.58 11.21 9.8 11.21C8.02 11.21 6.58 9.76 6.58 7.98C6.58 6.2 8.02 4.77 9.8 4.77ZM15.92 16.08C15.48 16.53 14.97 16.91 14.42 17.25C13.14 18.04 11.61 18.5 10 18.5C8.38 18.5 6.85 18.04 5.57 17.25C5.02 16.91 4.51 16.53 4.07 16.08L4.07 15.88C4.07 13.84 5.74 12.16 7.77 12.16L12.22 12.16C14.25 12.16 15.92 13.84 15.92 15.88L15.92 16.08Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
      //下方单元格svg
      cupSrc:
        '<svg width="24.000000" height="24.000000" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Cup" d="M1.99957 11.995C1.44751 11.995 1 11.5474 1 10.9954L1 5.9975C1 5.44548 1.44751 4.99792 1.99957 4.99792C2.55164 4.99792 2.99915 5.44548 2.99915 5.9975L2.99915 10.9954C2.99915 11.5474 2.55164 11.995 1.99957 11.995ZM22.9908 10.9954L22.9908 5.9975C22.9908 5.44548 22.5433 4.99792 21.9913 4.99792C21.4391 4.99792 20.9916 5.44548 20.9916 5.9975L20.9916 10.9954C20.9916 11.5474 21.4391 11.995 21.9913 11.995C22.5433 11.995 22.9908 11.5474 22.9908 10.9954ZM16.9933 0L6.9975 0C5.34131 0 3.99878 1.3427 3.99878 2.99875L3.99878 10.9954C4.00012 14.8632 6.76965 18.1758 10.576 18.8623C10.8167 18.9013 10.9941 19.1082 10.9959 19.352L10.9958 21.501C10.9958 21.7771 10.772 22.0008 10.496 22.0008L8.99664 22.0008C8.44458 22.0008 7.99707 22.4484 7.99707 23.0004C7.99707 23.5524 8.44458 24 8.99664 24L14.9941 24C15.5463 24 15.9938 23.5524 15.9938 23.0004C15.9938 22.4484 15.5463 22.0008 14.9941 22.0008L13.4948 22.0008C13.2188 22.0008 12.995 21.7771 12.995 21.501L12.995 19.352C12.9967 19.1082 13.1742 18.9013 13.4148 18.8623C17.2212 18.1758 19.9907 14.8632 19.9921 10.9954L19.9921 2.99875C19.9921 1.3427 18.6495 0 16.9933 0Z" fill-rule="nonzero" fill="#ACD41D"/></svg>',
      callSrc:
        '<svg width="24.000000" height="24.000000" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Call" d="M18.5016 19.4554C18.8054 19.8116 18.9414 20.2811 18.8752 20.7445C18.809 21.2079 18.5469 21.6206 18.1556 21.8774L15.8423 23.558C13.5389 25.2287 8.37848 22.0158 4.30548 16.4007C0.232483 10.7855 -1.20093 4.87375 1.09259 3.20304L3.40588 1.52243C3.77191 1.22955 4.24634 1.1083 4.70807 1.18966C5.1698 1.27103 5.57416 1.54714 5.81805 1.94755L7.36023 4.96269C7.73206 5.69031 7.68683 6.56115 7.24158 7.24632L6.34198 8.64023C5.88263 9.37865 5.88263 10.3139 6.34192 11.0524L6.83624 11.8828C7.58807 13.1384 8.44812 14.3259 9.40662 15.4318L10.0393 16.1634C10.6109 16.8233 11.5088 17.0996 12.3525 16.8751L13.9541 16.4501C14.7439 16.2424 15.5844 16.4724 16.1586 17.0531L18.5016 19.4554ZM16.4454 10.7558C17.1115 11.0017 17.8507 10.6608 18.0963 9.99462C18.5359 8.80963 18.3732 7.48502 17.66 6.44162C16.9467 5.39821 15.7715 4.76578 14.5078 4.74523C13.7979 4.74523 13.2225 5.32062 13.2225 6.03038C13.2225 6.74017 13.7979 7.31553 14.5077 7.31553C14.9395 7.3203 15.3419 7.53522 15.5859 7.89146C15.83 8.2477 15.8851 8.70051 15.7336 9.1049C15.4824 9.75722 15.7986 10.4907 16.4454 10.7558ZM21.2993 3.74675C19.6245 1.42363 16.9464 0.033247 14.0827 0C13.3729 -3.05176e-05 12.7975 0.575357 12.7975 1.28512C12.7975 1.99491 13.3729 2.57027 14.0826 2.57027C16.2007 2.60427 18.1705 3.66448 19.3654 5.41366C20.5604 7.16284 20.8317 9.38327 20.0933 11.3688C19.8476 12.0349 20.1884 12.774 20.8545 13.0197C21.5206 13.2654 22.2598 12.9245 22.5054 12.2585C23.5543 9.39826 23.1015 6.20292 21.2993 3.74675Z" fill-rule="nonzero" fill="#ACD43D"/></svg>',
      levelSrc:
        '<svg width="24.000000" height="18.372375" viewBox="0 0 24 18.3724" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Crown" d="M0 15.3736L0 3.83839C-0.00244141 3.42962 0.244141 3.06057 0.622803 2.90652C1.00134 2.7524 1.43561 2.84435 1.71924 3.13866L6.41736 7.96669C6.67145 8.25917 7.06165 8.39474 7.44238 8.32269C7.82306 8.25069 8.13684 7.982 8.26654 7.61692L11.0754 0.619743C11.2294 0.244774 11.5947 0 12 0C12.4053 0 12.7706 0.244774 12.9246 0.619743L15.7335 7.61686C15.8632 7.98194 16.177 8.25069 16.5576 8.32269C16.9384 8.39474 17.3286 8.25917 17.5826 7.96669L22.2808 3.13866C22.5644 2.84435 22.9987 2.7524 23.3772 2.90652C23.7559 3.06057 24.0024 3.42962 24 3.83839L24 15.3736C24 17.0298 22.6574 18.3724 21.0012 18.3724L2.99878 18.3724C1.34259 18.3724 0 17.0298 0 15.3736Z" fill-rule="nonzero" fill="#ACD41D"/></svg>',
      exitSrc:
        '<svg width="24.000000" height="24.000000" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Exit " d="M5.93781 0L16.6209 0C18.2434 0 19.5587 1.56894 19.5587 3.50435L19.5587 4.56636C19.5587 5.3288 19.0406 5.94688 18.4014 5.94688C17.7623 5.94688 17.2441 5.3288 17.2441 4.56636L17.2441 3.50441C17.2441 3.09387 16.9651 2.76103 16.6209 2.76103L5.93781 2.76103C5.59369 2.76103 5.31464 3.09387 5.31464 3.50449L5.31464 20.4956C5.31464 20.9061 5.59369 21.239 5.93787 21.239L16.6209 21.239C16.9651 21.239 17.2441 20.9061 17.2441 20.4955L17.2441 19.4336C17.2441 18.6712 17.7623 18.0531 18.4014 18.0531C19.0406 18.0531 19.5587 18.6712 19.5587 19.4336L19.5587 20.4956C19.5587 22.431 18.2435 23.9999 16.621 24L5.93781 24C4.31531 24 3 22.4311 3 20.4957L3 3.50441C3 1.56901 4.31531 0 5.93781 0ZM21.6954 11.8301L18.3214 7.90089C18.193 7.75092 18.0016 7.70761 17.8361 7.79123C17.6707 7.87477 17.5636 8.06883 17.5646 8.28319L17.5646 11.2779L11.9026 11.2779C11.4109 11.2779 11.0123 11.7533 11.0123 12.3398C11.0123 12.9263 11.4109 13.4018 11.9026 13.4018L17.5379 13.4018L17.5379 16.3328C17.5368 16.5499 17.6466 16.7459 17.8152 16.8278C17.9838 16.9096 18.1772 16.8608 18.3035 16.7044L21.6776 12.5734C21.8522 12.3728 21.8601 12.0423 21.6954 11.8301Z" fill-rule="nonzero" fill="#ACD41D"/></svg>',
      lock: false,
      jglist: [
        {
          name: "我的门票",
          src: '<svg width="40.000000" height="40.000000" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Card" d="M0 12L0 28.6667C0 31.4281 2.23859 33.6667 5 33.6667L35 33.6667C37.7614 33.6667 40 31.4281 40 28.6667L40 12C40 9.23857 37.7614 7 35 7L5 7C2.23859 7 0 9.23857 0 12ZM35 25.3333L28.3333 25.3333C27.4128 25.3333 26.6667 24.5871 26.6667 23.6667C26.6667 22.7463 27.4128 22 28.3333 22L35 22C35.9205 22 36.6667 22.7463 36.6667 23.6667C36.6667 24.5871 35.9205 25.3333 35 25.3333ZM35 18.6667L5 18.6667C4.07953 18.6667 3.33331 17.9204 3.33331 17C3.33331 16.0796 4.07953 15.3333 5 15.3333L35 15.3333C35.9205 15.3333 36.6667 16.0796 36.6667 17C36.6667 17.9204 35.9205 18.6667 35 18.6667Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Card" d="M0 28.6667C0 31.4281 2.23859 33.6667 5 33.6667L35 33.6667C37.7614 33.6667 40 31.4281 40 28.6667L40 12C40 9.23857 37.7614 7 35 7L5 7C2.23859 7 0 9.23857 0 12L0 28.6667ZM28.3333 25.3333C27.4128 25.3333 26.6667 24.5871 26.6667 23.6667C26.6667 22.7463 27.4128 22 28.3333 22L35 22C35.9205 22 36.6667 22.7463 36.6667 23.6667C36.6667 24.5871 35.9205 25.3333 35 25.3333L28.3333 25.3333ZM5 18.6667C4.07953 18.6667 3.33331 17.9204 3.33331 17C3.33331 16.0796 4.07953 15.3333 5 15.3333L35 15.3333C35.9205 15.3333 36.6667 16.0796 36.6667 17C36.6667 17.9204 35.9205 18.6667 35 18.6667L5 18.6667Z" stroke="#707070" stroke-opacity="0" stroke-width="1.000000"/></svg>',
          url: "/pages_index/mine/tickets/index",
        },
        {
          name: "我的收藏",
          src: '<svg width="40.000000" height="40.000000" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M27.08 3.33L12.91 3.33C10.38 3.33 8.33 5.38 8.33 7.91L8.33 33.73C8.33 34.9 9 35.93 10.06 36.4C11.13 36.86 12.33 36.68 13.2 35.9C14 35.18 14.79 34.45 15.61 33.7C16.98 32.43 18.36 31.18 19.73 30C19.88 29.86 20.09 29.86 20.25 30C21.61 31.18 22.98 32.43 24.34 33.68C25.16 34.43 25.98 35.18 26.81 35.91C27.36 36.4 28.04 36.66 28.75 36.66C29.14 36.66 29.56 36.58 29.95 36.4C31.01 35.91 31.68 34.9 31.68 33.73L31.68 7.9C31.66 5.38 29.61 3.33 27.08 3.33Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
          url: "/pages_platform/collect/index",
        },
        {
          name: "我的活动",
          src: '<svg width="40.000000" height="40.000000" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M6.05 36.66C6.73 36.66 7.3 36.09 7.3 35.41L7.3 30.06L7.3 24.68L16.83 24.68C17.75 24.68 18.5 23.93 18.5 23.01L18.5 22.18L18.5 5.83L18.5 4.99C18.5 4.08 17.75 3.33 16.83 3.33L6.05 3.33C5.36 3.33 4.8 3.89 4.8 4.58L4.8 18.28L4.8 23.43L4.8 30.06L4.8 35.41C4.8 36.09 5.35 36.66 6.05 36.66Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M22.66 28.1L32.06 28.1C33.43 28.1 34.59 27.33 35.03 26.14C35.14 25.85 35.2 25.53 35.2 25.21C35.2 24.45 34.86 23.71 34.21 23.16L29.2 18.88C28.66 18.41 28.36 17.83 28.36 17.21C28.36 16.6 28.66 16.01 29.2 15.54L34.21 11.26C35.11 10.49 35.43 9.34 35.03 8.28C34.59 7.09 33.43 6.33 32.06 6.33L22.66 6.33C21.75 6.33 21 7.08 21 7.99L21 8.83L21 25.6L21 26.43C21 27.35 21.75 28.1 22.66 28.1Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
          url: "/pages_index/mine/activity/index",
        },
        {
          name: "我的团队",
          src: '<svg width="40.000000" height="40.000000" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M14.73 19.31C18.2 19.31 21.01 16.5 21.01 13.03C21.01 9.56 18.2 6.75 14.73 6.75C11.26 6.75 8.44 9.56 8.44 13.03C8.44 16.5 11.26 19.31 14.73 19.31Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M26.93 29.13L26.93 32C26.93 32.68 26.38 33.25 25.68 33.25L4.58 33.25C3.89 33.25 3.33 32.68 3.33 32L3.33 29.13C3.33 25.11 6.59 21.85 10.61 21.85L19.64 21.85C20.46 21.85 21.25 21.98 21.98 22.25C21.98 22.25 21.98 22.23 22 22.25C24.86 23.21 26.93 25.93 26.93 29.13Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M26.93 29.13L26.93 32C26.93 32.68 26.38 33.25 25.68 33.25L4.58 33.25C3.89 33.25 3.33 32.68 3.33 32L3.33 29.13C3.33 25.11 6.59 21.85 10.61 21.85L19.64 21.85C20.46 21.85 21.25 21.98 21.98 22.25C21.98 22.25 21.98 22.23 22 22.25C24.86 23.21 26.93 25.93 26.93 29.13Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M36.66 27.7L36.66 30.05C36.66 30.6 36.21 31.05 35.66 31.05L29.43 31.05L29.43 29.13C29.43 27.45 29 25.85 28.25 24.46C27.93 23.9 27.58 23.36 27.18 22.88C26.89 22.56 26.61 22.25 26.31 21.98L30.95 21.98C31.13 21.98 31.3 21.98 31.46 22.01C31.68 22.03 31.89 22.06 32.11 22.11C33.38 22.38 34.48 23.08 35.3 24.01C35.43 24.16 35.56 24.33 35.68 24.51C35.7 24.51 35.7 24.51 35.68 24.53C36 25 36.25 25.5 36.41 26.05C36.46 26.23 36.51 26.41 36.55 26.6C36.63 26.95 36.66 27.31 36.66 27.7Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M32.28 14.1C32.28 16.85 30.05 19.08 27.3 19.08C24.54 19.08 22.31 16.85 22.31 14.1C22.31 11.34 24.54 9.11 27.3 9.11C30.05 9.11 32.28 11.34 32.28 14.1Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="evenodd"/></svg>',
          url: "/pages_index/mine/myTeam/index",
        },
      ],
      zblist: [
        {
          name: "我的客户",
          src: '<svg width="40.000000" height="40.000000" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Card" d="M0 12L0 28.6667C0 31.4281 2.23859 33.6667 5 33.6667L35 33.6667C37.7614 33.6667 40 31.4281 40 28.6667L40 12C40 9.23857 37.7614 7 35 7L5 7C2.23859 7 0 9.23857 0 12ZM35 25.3333L28.3333 25.3333C27.4128 25.3333 26.6667 24.5871 26.6667 23.6667C26.6667 22.7463 27.4128 22 28.3333 22L35 22C35.9205 22 36.6667 22.7463 36.6667 23.6667C36.6667 24.5871 35.9205 25.3333 35 25.3333ZM35 18.6667L5 18.6667C4.07953 18.6667 3.33331 17.9204 3.33331 17C3.33331 16.0796 4.07953 15.3333 5 15.3333L35 15.3333C35.9205 15.3333 36.6667 16.0796 36.6667 17C36.6667 17.9204 35.9205 18.6667 35 18.6667Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Card" d="M0 28.6667C0 31.4281 2.23859 33.6667 5 33.6667L35 33.6667C37.7614 33.6667 40 31.4281 40 28.6667L40 12C40 9.23857 37.7614 7 35 7L5 7C2.23859 7 0 9.23857 0 12L0 28.6667ZM28.3333 25.3333C27.4128 25.3333 26.6667 24.5871 26.6667 23.6667C26.6667 22.7463 27.4128 22 28.3333 22L35 22C35.9205 22 36.6667 22.7463 36.6667 23.6667C36.6667 24.5871 35.9205 25.3333 35 25.3333L28.3333 25.3333ZM5 18.6667C4.07953 18.6667 3.33331 17.9204 3.33331 17C3.33331 16.0796 4.07953 15.3333 5 15.3333L35 15.3333C35.9205 15.3333 36.6667 16.0796 36.6667 17C36.6667 17.9204 35.9205 18.6667 35 18.6667L5 18.6667Z" stroke="#707070" stroke-opacity="0" stroke-width="1.000000"/></svg>',
          url: "/pages_host/client/client",
        },
        {
          name: "资料审核",
          src: '<svg width="40.000000" height="40.000000" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M27.08 3.33L12.91 3.33C10.38 3.33 8.33 5.38 8.33 7.91L8.33 33.73C8.33 34.9 9 35.93 10.06 36.4C11.13 36.86 12.33 36.68 13.2 35.9C14 35.18 14.79 34.45 15.61 33.7C16.98 32.43 18.36 31.18 19.73 30C19.88 29.86 20.09 29.86 20.25 30C21.61 31.18 22.98 32.43 24.34 33.68C25.16 34.43 25.98 35.18 26.81 35.91C27.36 36.4 28.04 36.66 28.75 36.66C29.14 36.66 29.56 36.58 29.95 36.4C31.01 35.91 31.68 34.9 31.68 33.73L31.68 7.9C31.66 5.38 29.61 3.33 27.08 3.33Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
          url: "/pages_host/check/index",
        },
        {
          name: "楣板确定",
          src: '<svg width="40.000000" height="40.000000" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M6.05 36.66C6.73 36.66 7.3 36.09 7.3 35.41L7.3 30.06L7.3 24.68L16.83 24.68C17.75 24.68 18.5 23.93 18.5 23.01L18.5 22.18L18.5 5.83L18.5 4.99C18.5 4.08 17.75 3.33 16.83 3.33L6.05 3.33C5.36 3.33 4.8 3.89 4.8 4.58L4.8 18.28L4.8 23.43L4.8 30.06L4.8 35.41C4.8 36.09 5.35 36.66 6.05 36.66Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M22.66 28.1L32.06 28.1C33.43 28.1 34.59 27.33 35.03 26.14C35.14 25.85 35.2 25.53 35.2 25.21C35.2 24.45 34.86 23.71 34.21 23.16L29.2 18.88C28.66 18.41 28.36 17.83 28.36 17.21C28.36 16.6 28.66 16.01 29.2 15.54L34.21 11.26C35.11 10.49 35.43 9.34 35.03 8.28C34.59 7.09 33.43 6.33 32.06 6.33L22.66 6.33C21.75 6.33 21 7.08 21 7.99L21 8.83L21 25.6L21 26.43C21 27.35 21.75 28.1 22.66 28.1Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
          url: "/pages_host/cmeiban/index",
        },
        {
          name: "我的邀请",
          src: '<svg width="40.000000" height="40.000000" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M14.73 19.31C18.2 19.31 21.01 16.5 21.01 13.03C21.01 9.56 18.2 6.75 14.73 6.75C11.26 6.75 8.44 9.56 8.44 13.03C8.44 16.5 11.26 19.31 14.73 19.31Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M26.93 29.13L26.93 32C26.93 32.68 26.38 33.25 25.68 33.25L4.58 33.25C3.89 33.25 3.33 32.68 3.33 32L3.33 29.13C3.33 25.11 6.59 21.85 10.61 21.85L19.64 21.85C20.46 21.85 21.25 21.98 21.98 22.25C21.98 22.25 21.98 22.23 22 22.25C24.86 23.21 26.93 25.93 26.93 29.13Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M26.93 29.13L26.93 32C26.93 32.68 26.38 33.25 25.68 33.25L4.58 33.25C3.89 33.25 3.33 32.68 3.33 32L3.33 29.13C3.33 25.11 6.59 21.85 10.61 21.85L19.64 21.85C20.46 21.85 21.25 21.98 21.98 22.25C21.98 22.25 21.98 22.23 22 22.25C24.86 23.21 26.93 25.93 26.93 29.13Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M36.66 27.7L36.66 30.05C36.66 30.6 36.21 31.05 35.66 31.05L29.43 31.05L29.43 29.13C29.43 27.45 29 25.85 28.25 24.46C27.93 23.9 27.58 23.36 27.18 22.88C26.89 22.56 26.61 22.25 26.31 21.98L30.95 21.98C31.13 21.98 31.3 21.98 31.46 22.01C31.68 22.03 31.89 22.06 32.11 22.11C33.38 22.38 34.48 23.08 35.3 24.01C35.43 24.16 35.56 24.33 35.68 24.51C35.7 24.51 35.7 24.51 35.68 24.53C36 25 36.25 25.5 36.41 26.05C36.46 26.23 36.51 26.41 36.55 26.6C36.63 26.95 36.66 27.31 36.66 27.7Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M32.28 14.1C32.28 16.85 30.05 19.08 27.3 19.08C24.54 19.08 22.31 16.85 22.31 14.1C22.31 11.34 24.54 9.11 27.3 9.11C30.05 9.11 32.28 11.34 32.28 14.1Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="evenodd"/></svg>',
          url: "/pages_host/invite/index",
        },
      ],
      showToken:true,
    };
  },
  onShow() {
    this.themeColors = uni.getStorageSync("color");
    this.themeColors = uni.getStorageSync("color")
    this.imgSrc = uni.getStorageSync("ceilingImg")
    const timestamp = new Date().getTime();
    if(uni.getStorageSync('token') == ""){
      this.showToken = false;
    }else{
      this.showToken = true;
      getInfo({exhibit_id:uni.getStorageSync('exhibit_id')}).then((res) => {
        this.userInfo = res.data;
        this.userInfo.avatar = this.userInfo.avatar +"?"+ timestamp
        uni.setStorageSync("phone", this.userInfo.phone);
      });
    }
    homeData({
      exhibit_id: uni.getStorageSync("exhibit_id"),
    }).then((res1) => {
      this.homeList = res1.data;
    });
  },
  onPageScroll(event) {
    //顶部导航渐变 从无到有
    this.scrollTop = event.scrollTop; // 更新页面滚动高度
    if (this.scrollTop * 0.0082 > 1) {
      this.scrollTop = 1 / 0.0082;
    }
    if (this.scrollTop * 0.0082 > 0.3) {
      this.titleColor = "rgb(0,0,0)";
    } else {
      this.titleColor = "rgb(255,255,255)";
    }
    this.bgColor = "rgba(255,255,255," + this.scrollTop * 0.0082 + ")";
  },
  onLoad(options) {
    uni.showLoading({
      title: "加载中",
    });
    let sources = [this.cupSrc,this.callSrc,this.levelSrc,
      this.exitSrc,this.cerSrc,this.storeSrc,this.exhSrc,
      this.relSrc,this.matSrc,this.mSrc,		
      this.cersSrc,this.mebSrc,this.upSrc,this.quesSrc
    ];
    let arr = sources.map((src) => this.svgToUrl(src));
    let storageColor = uni.getStorageSync("color");
    let sourceNames = [
      "cupSrc",
      "callSrc",
      "levelSrc",
      "exitSrc",
      "cerSrc",
      "storeSrc",
      "exhSrc",
      "relSrc",
      "matSrc",
      "mSrc",
      "cersSrc",
      "mebSrc",
      "upSrc",
	  'quesSrc'
    ];

    sourceNames.forEach((name, index) => {
      this[name] = this.changeColor(arr[index], storageColor);
    });
    // ... existing code ...

    //金刚区
    let jarr = [
      this.svgToUrl(this.jglist[0].src),
      this.svgToUrl(this.jglist[1].src),
      this.svgToUrl(this.jglist[2].src),
      this.svgToUrl(this.jglist[3].src),
    ];
    for (let i = 0; i < 4; i++) {
      this.jglist[i].src = this.changeColor(
        jarr[i],
        uni.getStorageSync("color")
      );
    }
    for (let i = 0; i < 4; i++) {
      this.zblist[i].src = this.changeColor(
        jarr[i],
        uni.getStorageSync("color")
      );
    }
    getSlider({
      exhibit_id: uni.getStorageSync("exhibit_id"),
    }).then((res) => {
      this.slider = res.data;
      uni.hideLoading();
    });
    this.$nextTick(() => {
				this.$refs.tabbar.reload();
			});
  },
  methods: {
    toMatch() {
      getConfig({ exhibit_id: uni.getStorageSync("exhibit_id") }).then(
        (res) => {
          if (res.code == 0) {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          } else {
            this.navigator("/pages_platform/match/index");
          }
        }
      );
    },
		//点击底部自定义导航栏触发事件，
			onBeforeChange(next, index) {
				if (index == 2) {
					if (!uni.getStorageSync("token")) {
						uni.redirectTo({
							url: "/pages/login/index",
						});
						return;
					}
					if (this.lock) {
						return;
					} else {
						this.lock = true;
							getMyTicket({
								exhibit_id: uni.getStorageSync("exhibit_id"),
							}).then((res) => {
								if (res.code == -1) {
									this.lock = false;
									return;
								}
								if (res.code == 1) {
									uni.setStorageSync("tickerInfo", JSON.stringify(res.data));
									this.lock = false;
									uni.switchTab({
										url: "/pages/center/index",
									});
								}
								if (res.code == 25){
									uni.navigateTo({
										url: "/pages_index/exhibitorTicket/index"
									})
								}
								this.lock = false;
							});
					}
				} else {
					next();
				}
			},
			
    toexques() {
		if(this.homeList.exhibit.wj_store_id){
			uni.navigateTo({
              url:'/pages_host/questionnaire/index?question_paper_no='+this.homeList.exhibit.wj_store_id+'&backMine=1'
            })
		}else{
			uni.showToast({
				title: '暂无问卷或您已经完成问卷',
				icon: '',
				mask: true
			})
		}
	},
    zbfGrid(name) {
      this.navigator(this.zblist[name].url);
    },
    clickGrid(name) {
      console.log(name);
      switch (name) {
        case 0:
          this.getTicket();
          break;
        case 1:
          this.navigator("/pages_platform/collect/index");
          break;
        case 2:
          this.navigator("/pages_index/mine/activity/index");
          break;
        case 3:
          if (this.userInfo.type == 1) {
            getMyTeamInfoE({
              exhibit_id: uni.getStorageSync("exhibit_id"),
            }).then((res) => {
              if (res.code !== 22) {
                this.navigator("/pages_index/mine/myTeam/index?type=1");
              }
            });
          } else if (this.userInfo.type == 0) {
            getMyTeamInfo({
              exhibit_id: uni.getStorageSync("exhibit_id"),
            }).then((res) => {
              if (res.code !== 22) {
                this.navigator("/pages_index/mine/myTeam/index");
              }
            });
          }

          break;
      }
    },
    getTicket() {
      if (this.lock) {
        return;
      } else {
        this.lock = true;
        if(this.userInfo.store_exhibit){
          uni.showToast({
            title: '参展商请领取展商证！',
            icon: 'none',
            mask: true
          })
          return
        }
        getMyTicket({
          exhibit_id: uni.getStorageSync("exhibit_id"),
        }).then((res) => {
          if (res.code == -1) {
            this.lock = false;
            return;
          }
          if (res.code == 1) {
            this.lock = false;
            uni.navigateTo({
              url: "/pages/center/index",
            });
          }
          if (res.code == 24) {
            uni.navigateTo({
              url: "/pages_index/pay/index",
            });
          }
          this.lock = false;
        });
      }
    },
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
      let res = '"' + `data:image/svg+xml,${encoded}` + '"'; //需要在字符串前后加上一对引号（非常关键！）
      return res;
    },
    changeColor(url, color) {
      let res = url.replace(/%23[a-zA-Z0-9]{6}/g, color.replace("#", "%23")); //转义后的#等于%23，利用正则表达式，替换所有%23后6位为新的十六进制六位数。
      return res;
    },
    getInfo(e) {
      if (!this.showToken){
        uni.navigateTo({
          url: "/pages/login/index?data=pages/index/index",
        });
      }
    },
    getphonenumber(e) {
      uni.login({
        provider: "weixin",
        scopes: "auth_user",
        success: (loginRes) => {
          uni.getInfo({
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
                  uni.setStorageSync("defaultTime", timestamp + 259200000);
                } else {
                  this.isNew = true;
                }
                this.lock = true;
              });
            },
          });
        },
      });
      const detail = e.detail;
      getPhone({
        unionid: uni.getStorageSync("uniond"),
        iv: detail.iv,
        code: config.project,
        encrypted_data: detail.encryptedData,
        type: 0,
      }).then((res) => {
        uni.showToast({
          title: res.msg,
          icon: "none",
        });
      });
    },
    exit() {
      uni.removeStorageSync("token");
      this.showExit = false;
      this.userInfo = null;
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
    onBeforeChange(next, index) {
      //点击底部自定义导航栏触发事件，
      if (index == 2) {
        if (!uni.getStorageSync("token")) {
          uni.redirectTo({
            url: "/pages/login/index",
          });
          return;
        }
        if (this.lock) {
          return;
        } else {
          this.lock = true;
          if (uni.getStorageSync("exhibit_id") == 4) {
            uni.setStorageSync(
              "webviewUrl",
              "https://c.zzhaiming.com/web-reg-server/mobile/vistor-register-m.html?EID=E0000000528&target=1&orgnum=1250&pid=1393&version=1&cid=4326&ctid=86"
            );
            uni.navigateTo({
              url: "/pages_index/webview/index",
            });
            this.lock = false;
          } else {
            getMyTicket({
              exhibit_id: uni.getStorageSync("exhibit_id"),
            }).then((res) => {
              if (res.code == -1) {
                this.lock = false;
                return;
              }
              if (res.code == 1) {
                this.lock = false;
                uni.navigateTo({
                  url: "/pages/center/index",
                });
              }
              if (res.code == 25) {
                uni.navigateTo({
                  url: "/pages_index/exhibitorTicket/index",
                });
              }
              this.lock = false;
            });
          }
        }
      } else {
        next();
      }
    },
    clickTabs(e) {
      console.log(e);
    },
    showToust() {
    uni.showToast({
      title: '展商证件提报已截止，请联系您的业务人员处理',
      icon: 'none',
      mask: true 
    })
    },
    navigator(url) {
      if(this.showToken){
					uni.navigateTo({
						url: url,
					});
				}else{
					uni.showToast({
						title: '请登录后使用',
						icon: 'none',
						mask: true
					})
				}
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 90vh;
  background: rgb(239, 239, 239);
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
}

.navTitle {
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

  .userInfo {
    background-color: #fff;
    padding: 20rpx 40rpx;
    border-radius: 20rpx;
    position: relative;
    top: -60rpx;
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 50rpx;
    .levBox {
      width: 176rpx;
      height: 176rpx;
      position: absolute;
      left: 36rpx;
    }
    .name {
      margin-left: 34rpx;
      width: auto;

      .userName {
        word-wrap: break-word;
        width: 370rpx;
        color: rgb(0, 0, 0);
        font-size: 40rpx;
        font-weight: 500;
        line-height: 45rpx;
        margin-bottom: 40rpx;
      }

      .userLevel {
        color: #fff;
        font-size: 24rpx;
        display: flex;
        text {
          width: fit-content;
          margin-right: 20rpx;
          border-radius: 10rpx;
          padding: 4rpx 8rpx;
          display: block;
        }
      }
    }

    .right {
      position: absolute;
      right: 58rpx;
    }
  }

  .functionality {
    margin: -60rpx 0 30rpx 0;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx 20rpx;

    .grid-text {
      font-family: Songti SC;
      font-size: 32rpx;
      font-weight: 500;
      line-height: 46rpx;
      letter-spacing: 0px;
      margin-top: 16rpx;
    }
  }

  .footer {
    margin-top: 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 20rpx 28rpx;
  }
}

//中间按钮
.custom_style {
  margin-top: -92rpx;
  font-size: 24rpx;
  text-align: center;
  color: #999999;

  .btnImg {
    border: 14rpx solid #fff;
    border-radius: 50%;
    width: 112rpx;
    height: 112rpx;
  }
}
.task {
  position: relative;
  left: -40rpx;
}
::v-deep .u-badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
}
</style>