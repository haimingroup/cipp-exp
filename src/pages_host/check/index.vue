<template>
	<view class="page">
	  <!-- 顶部标题栏 -->
	  <u-navbar :fixed="true" :bgColor="themeColors" placeholder @leftClick="back">
		<view class="navTitle" slot="left">
		  <u-icon name="arrow-left" color="#FFF"></u-icon>
		  <text style="margin-left: 10rpx">资料审核</text>
		</view>
	  </u-navbar>
	  <view class="content">
		<view class="box" v-for="item,index in list" :key="index" @tap="navigator(item.url)">
			<view :style="'background-image:url('+item.src+');width: 80rpx;height: 80rpx;background-repeat:no-repeat'" ></view>
			<view style="margin-top: 8rpx;">{{ item.name }}</view>
			<view class="btn" :style="'background:'+ themeColors">去审核</view>
		</view>
	  </view>
	</view>
  </template>
  
  <script>
  export default {
	  data() {
		  return {
			  themeColors: uni.getStorageSync('color'),
			  list:[
				{
					name:'店铺信息',
					src:'<svg width="39.680176" height="35.171387" viewBox="0 0 39.6802 35.1714" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M34.78 20.23C33.93 20.41 33.06 20.5 32.18 20.51C30 20.53 27.86 19.93 26 18.79C24.14 19.91 22.01 20.5 19.84 20.5C17.67 20.5 15.54 19.91 13.68 18.79C11.83 19.93 9.68 20.53 7.5 20.51C6.63 20.5 5.76 20.41 4.9 20.23C4 20.04 3.13 19.75 2.3 19.35L1.84 19.13L1.84 29.55C1.84 31.03 2.43 32.46 3.48 33.51C4.53 34.57 5.96 35.16 7.44 35.17L14.22 35.17L14.22 25.37C14.22 24.97 14.38 24.59 14.66 24.31C14.94 24.02 15.32 23.87 15.72 23.87L23.96 23.87C24.36 23.87 24.74 24.02 25.02 24.31C25.3 24.59 25.46 24.97 25.46 25.37L25.46 35.09L32.18 35.09C33.67 35.1 35.09 34.52 36.15 33.48C37.21 32.45 37.82 31.03 37.84 29.55L37.84 19.13L37.44 19.35C36.6 19.75 35.7 20.05 34.78 20.23Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M6.88 0.01L12.62 0.01L12.62 15.87C11.14 16.97 9.35 17.56 7.5 17.55C6.62 17.55 5.75 17.42 4.9 17.17C4.46 17.05 4.03 16.89 3.62 16.69C2.95 16.37 2.35 15.93 1.84 15.39C1.09 14.6 0.54 13.64 0.25 12.6C-0.05 11.55 -0.09 10.45 0.14 9.39L1.3 3.93C1.65 2.73 2.39 1.7 3.4 0.98C4.42 0.27 5.65 -0.07 6.88 0.01Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M14.62 0.01L25.06 0.01L25.06 15.77C23.56 16.9 21.73 17.51 19.84 17.51C17.96 17.51 16.13 16.9 14.62 15.77L14.62 0.01Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/><path id="Vector" d="M37.84 15.37C37.35 15.9 36.77 16.33 36.12 16.65C35.71 16.85 35.28 17.01 34.84 17.13C34 17.38 33.12 17.51 32.24 17.51C30.4 17.53 28.61 16.95 27.12 15.87L27.12 0.01L32.86 0.01C34.08 -0.06 35.29 0.28 36.3 0.99C37.3 1.69 38.03 2.71 38.38 3.89L39.54 9.29C39.55 9.36 39.55 9.43 39.54 9.51C39.76 10.55 39.71 11.63 39.42 12.65C39.12 13.67 38.58 14.6 37.84 15.37Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
					url:'/pages_host/check/stone',
					
				},
				{
					name:'展品信息',
					src:'<svg width="40.000000" height="40.000000" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M36.5 18.5L30.7 18.5C30.72 18.32 30.75 18.15 30.75 18L30.75 3.5C30.75 1.56 29.18 0 27.24 0L12.75 0C10.81 0 9.24 1.56 9.24 3.5L9.24 18C9.24 18.15 9.27 18.32 9.29 18.5L3.5 18.5C1.58 18.5 0 20.06 0 22L0 36.5C0 38.41 1.58 40 3.5 40L18 40C18.74 40 19.43 39.75 20 39.36C20.56 39.75 21.25 40 22 40L36.5 40C38.41 40 40 38.41 40 36.5L40 22C40 20.06 38.41 18.5 36.5 18.5ZM18.5 36.5C18.5 36.75 18.27 37 18 37L3.5 37C3.22 37 3 36.75 3 36.5L3 22C3 21.72 3.22 21.5 3.5 21.5L5.72 21.5L5.72 27.6C5.72 28.12 6 28.6 6.43 28.87C6.87 29.13 7.41 29.15 7.89 28.93L10.77 27.5L13.6 28.93C13.79 29.04 14.04 29.1 14.27 29.1C14.54 29.1 14.81 29.02 15.06 28.87C15.5 28.6 15.77 28.12 15.77 27.6L15.77 21.5L18 21.5C18.27 21.5 18.5 21.72 18.5 22L18.5 36.5ZM12.75 18.5C12.48 18.5 12.24 18.26 12.24 18L12.24 3.5C12.24 3.21 12.48 3 12.75 3L14.98 3L14.98 9.1C14.98 9.62 15.24 10.1 15.68 10.37C16.12 10.63 16.68 10.67 17.14 10.43L20.04 9L22.83 10.43C23.06 10.54 23.29 10.6 23.52 10.6C23.79 10.6 24.06 10.52 24.29 10.37C24.75 10.1 25.02 9.62 25.02 9.1L25.02 3L27.24 3C27.52 3 27.75 3.21 27.75 3.5L27.75 18C27.75 18.26 27.52 18.5 27.24 18.5L12.75 18.5ZM37 36.5C37 36.75 36.77 37 36.5 37L22 37C21.72 37 21.5 36.75 21.5 36.5L21.5 22C21.5 21.72 21.72 21.5 22 21.5L24.22 21.5L24.22 27.6C24.22 28.12 24.5 28.6 24.93 28.87C25.37 29.13 25.91 29.15 26.39 28.93L29.27 27.5L32.1 28.93C32.29 29.04 32.54 29.1 32.77 29.1C33.04 29.1 33.31 29.02 33.56 28.87C34 28.6 34.27 28.12 34.27 27.6L34.27 21.5L36.5 21.5C36.77 21.5 37 21.72 37 22L37 36.5Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
					url:'/pages_host/check/product',

				},
				{
					name:'参赛信息',
					src:'<svg width="40.000000" height="40.000000" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="Vector" d="M32.1 2.06L31.77 2.06L31.77 1.5C31.77 0.67 31.1 0 30.27 0C29.46 0 28.77 0.67 28.77 1.5L28.77 2.06L11.22 2.06L11.22 1.5C11.22 0.67 10.56 0 9.72 0C8.89 0 8.22 0.67 8.22 1.5L8.22 2.06L7.89 2.06C3.54 2.06 0 5.6 0 9.95L0 32.1C0 36.46 3.54 40 7.89 40L32.1 40C36.46 40 40 36.46 40 32.1L40 9.95C40 5.6 36.46 2.06 32.1 2.06ZM8 33.93C6.89 33.93 6 33.06 6 31.93C6 30.84 6.89 29.93 8 29.93C9.1 29.93 10 30.84 10 31.93C10 33.06 9.1 33.93 8 33.93ZM8 26.98C6.89 26.98 6 26.08 6 24.98C6 23.86 6.89 22.98 8 22.98C9.1 22.98 10 23.86 10 24.98C10 26.08 9.1 26.98 8 26.98ZM8 20C6.89 20 6 19.1 6 18C6 16.89 6.89 16 8 16C9.1 16 10 16.89 10 18C10 19.1 9.1 20 8 20ZM16 33.93C14.89 33.93 14 33.06 14 31.93C14 30.84 14.89 29.93 16 29.93C17.1 29.93 18 30.84 18 31.93C18 33.06 17.1 33.93 16 33.93ZM16 26.98C14.89 26.98 14 26.08 14 24.98C14 23.86 14.89 22.98 16 22.98C17.1 22.98 18 23.86 18 24.98C18 26.08 17.1 26.98 16 26.98ZM16 20C14.89 20 14 19.1 14 18C14 16.89 14.89 16 16 16C17.1 16 18 16.89 18 18C18 19.1 17.1 20 16 20ZM24 33.93C22.89 33.93 22 33.06 22 31.93C22 30.84 22.89 29.93 24 29.93C25.1 29.93 26 30.84 26 31.93C26 33.06 25.1 33.93 24 33.93ZM24 26.98C22.89 26.98 22 26.08 22 24.98C22 23.86 22.89 22.98 24 22.98C25.1 22.98 26 23.86 26 24.98C26 26.08 25.1 26.98 24 26.98ZM24 20C22.89 20 22 19.1 22 18C22 16.89 22.89 16 24 16C25.1 16 26 16.89 26 18C26 19.1 25.1 20 24 20ZM32 26.98C30.89 26.98 30 26.08 30 24.98C30 23.86 30.89 22.98 32 22.98C33.1 22.98 34 23.86 34 24.98C34 26.08 33.1 26.98 32 26.98ZM32 20C30.89 20 30 19.1 30 18C30 16.89 30.89 16 32 16C33.1 16 34 16.89 34 18C34 19.1 33.1 20 32 20ZM37 10.3L3 10.3L3 9.95C3 7.26 5.2 5.06 7.89 5.06L8.22 5.06L8.22 5.62C8.22 6.45 8.89 7.12 9.72 7.12C10.56 7.12 11.22 6.45 11.22 5.62L11.22 5.06L28.77 5.06L28.77 5.62C28.77 6.45 29.46 7.12 30.27 7.12C31.1 7.12 31.77 6.45 31.77 5.62L31.77 5.06L32.1 5.06C34.79 5.06 37 7.26 37 9.95L37 10.3Z" fill="#ACD41D" fill-opacity="1.000000" fill-rule="nonzero"/></svg>',
					url:'/pages_host/check/match',

				},
			  ]
		  }
	  },
	  onLoad(){
			let jarr =[this.svgToUrl(this.list[0].src),this.svgToUrl(this.list[1].src),this.svgToUrl(this.list[2].src)];
			for(let i=0;i<jarr.length;i++){
				this.list[i].src =this.changeColor(jarr[i],this.themeColors)
			}		
	  },
	  methods:{
		svgToUrl(url) {
				let encoded = url
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
			navigator(url) {
				uni.navigateTo({
					url: url,
				});
			},
		  back() {
				  uni.navigateBack();
			  },
	  }
  }
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
		display: flex;
		align-items: center;
		color: rgb(255, 255, 255);
		font-size: 36rpx;
		font-weight: 700;
		line-height: 36rpx;
		text-align: left;
	}
	.content{
		display: flex;
		justify-content: center;
		align-items: center;
		padding:48rpx 30rpx;
		.box{
			height: 268rpx;
			border-radius: 20rpx;
			background: #FFF;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.btn{
				padding: 6rpx 28rpx;
				color: #FFF;
				border-radius: 25rpx;
				margin-top: 24rpx;
			}
		}
		.box:nth-child(2){
			margin: 0 46rpx;
		}
	}
  </style>