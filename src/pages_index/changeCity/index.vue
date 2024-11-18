<template>
	<view class="page">
	  <u-navbar :fixed="true" placeholder :bgColor="bgColor" @leftClick="back">
		<view class="navTitle" slot="left">
		  <u-icon name="arrow-left" color="#FFF"></u-icon>
		  <text style="margin-left: 10rpx">展会选择</text>
		</view>
	  </u-navbar>
  
	  <view class="content">
		<view class="title">
		  <image src="../../static/path.png" class="icon" mode=""></image>
		  <view class="text">
			当前选择:{{ " " + " " }} <text>{{ checkInfo.name || "" }}</text>
		  </view>
		</view>
		<view class="tabs">
		  <u-tabs
			:list="tabList"
			lineWidth="70rpx"
			keyName="name"
			:scrollable="false"
			lineHeight="3px"
			:activeStyle="activeStyle"
			:inactiveStyle="inactiveStyle"
			:lineColor="themeColors"
			@click="clickTabs"
		  ></u-tabs>
		</view>
		<view class="List">
		  <view
			class="box"
			v-for="(item, index) in list"
			:key="index"
			@tap="change(item, index)"
			:class=" current == item.exhibit_id ? 'checkBox' : ''"
			:style="current == item.exhibit_id ? 'border-color:' + themeColors: ''
			"
		  >
			<view class="boxTitle"> {{ item.name }} </view>
			<view class="info">
			  <u-icon :name="timeIcon" size="26"></u-icon>
			  <text>{{
				item.start_time.slice(0, 16) + "-" + item.end_time.slice(0, 16)
			  }}</text>
			</view>
			<view class="info">
			  <u-icon name="map" size="26"></u-icon>
			  <text>{{ item.city_name }}</text>
			</view>
			<view
			  v-if="current == item.exhibit_id "
			  class="isCheck"
			  :style="
				'background: linear-gradient(-45deg,' +
				themeColors +
				',' +
				themeColors +
				' 50%,transparent 50%,transparent 100%);'
			  "
			>
			  <u-icon
				top="28rpx"
				name="checkbox-mark"
				color="#FFF"
				size="32"
			  ></u-icon>
			</view>
		  </view>
		</view>
	  </view>
	</view>
  </template>
  
  <script>
  import config from "@/utils/config.js";
  import { exhibitList } from "@/api/list.js";
  export default {
	data() {
	  return {
		themeColors: uni.getStorageSync("color"),
		current: -1,
		//顶部标题栏背景色
		bgColor: uni.getStorageSync("color"),
		list: [],
		tabList: [
		  { id: 1, name: "进行中" },
		  { id: 0, name: "已完成" },
		],
		checkInfo: {},
		timeIcon: require("../../static/time.svg"),
		inactiveStyle: {
		  color: "rgb(185, 185, 185)",
		  fontSize: "32rpx",
		  lineHeight: "46rpx",
		  paddingRight: "10rpx",
		},
		activeStyle: {
		  color: uni.getStorageSync("color"),
		  fontSize: "32rpx",
		  lineHeight: "46rpx",
		  paddingRight: "10rpx",
		},
	  };
	},
	onLoad() {
	  exhibitList({
		obj_id: config.obj_id,
		open_status: "1",
	  }).then((res) => {
		this.list = res.data;
		for (let i = 0; i < this.list.length; i++) {
		  if (this.list[i].exhibit_id == uni.getStorageSync("exhibit_id")) {
			this.current = this.list[i].exhibit_id;
			this.checkInfo = this.list[i];
			return;
		  }
		}
	  });
	},
	methods: {
	  change(item, index) {
		  this.current = index
		  this.checkInfo = item
		  uni.setStorageSync("exhibit_id", this.checkInfo.exhibit_id),
		  uni.switchTab({
			url: "/pages/index/index",
		  });
	  },
	  clickTabs(e) {
		this.tabCurrent = e.id;
		exhibitList({
		  obj_id: config.obj_id,
		  open_status: e.id,
		}).then((res) => {
		  this.list = res.data;
		  for (let i = 0; i < this.list.length; i++) {
			if (this.list[i].exhibit_id == uni.getStorageSync("exhibit_id")) {
			  this.current = this.list[i].exhibit_id;
			  this.checkInfo = this.list[i];
			  return;
			}
		  }
		});
	  },
	  back() {
		uni.switchTab({
		  url: "/pages/index/index",
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
	line-height: 36rpx;
	text-align: left;
  }
  
  .content {
	padding: 30rpx;
  
	.title {
	  display: flex;
	  align-items: center;
  
	  .icon {
		width: 18px !important;
		height: 24px;
		margin-right: 20rpx;
	  }
  
	  .text {
		color: rgb(0, 0, 0);
		font-size: 32rpx;
		font-weight: 400;
		width: 600rpx;
  
		text {
		  font-size: 32rpx;
		  font-weight: 600;
		}
	  }
	}
  
	.List {
	  margin-top: 30rpx;
  
	  .box {
		padding: 30rpx;
		position: relative;
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		border: 2rpx solid rgba(224, 8, 75, 0);
  
		.boxTitle {
		  color: rgb(0, 0, 0);
		  font-size: 34rpx;
		  font-weight: 500;
		  margin-bottom: 15rpx;
		}
  
		.info {
		  display: flex;
		  align-items: center;
		  margin-bottom: 15rpx;
  
		  text {
			color: rgb(153, 153, 153);
			font-size: 24rpx;
			font-weight: 500;
			margin-left: 10rpx;
		  }
		}
  
		.isCheck {
		  padding: 0 0 0rpx 20rpx;
		  width: 40rpx;
		  height: 60rpx;
		  position: absolute;
		  bottom: -2rpx; //因为边框宽2px 但右侧没有影响
		  right: 0;
		  border-radius: 0 0 20rpx 0;
		}
	  }
  
	  .checkBox {
		border: 2rpx solid $theme-color;
	  }
	}
  }
  </style>