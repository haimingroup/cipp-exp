<template>
	<view>
		<web-view :webview-styles="webviewStyles" :title="title" :src="Websrc"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Websrc: "",
				title: "",
			};
		},
		onLoad(option) {
			if (option.url) {
				this.Websrc = option.url;
				this.title = option.title;
				uni.setNavigationBarTitle({
					title: option.title,
				});
			} else {
				this.Websrc = uni.getStorageSync('webviewUrl')
			}

		},
	};
</script>

<style>
</style>