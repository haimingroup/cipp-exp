<script>
import {getInfo} from "@/api/list.js";
	export default {
		onLaunch: function(options) {
			if(options.channel){
				let logger = wx.getRealtimeLogManager()
				uni.setStorageSync('channel',options.channel)
				uni.setStorageSync('click_id',options.click_id)	
				logger.info(options.click_id)
			}
			if(uni.getStorageSync('token')){
				if(uni.getStorageSync('defaultTim '!==false)){
					
					 uni.clearStorageSync();
				}else{
					let timestamp = Date.now();
				  if(uni.getStorageSync('defaultTime') < timestamp){					
					uni.clearStorageSync();
				  }
				}
			}else{
				  uni.clearStorageSync();
			}
			
			if(options.query.scene){
				uni.removeStorageSync('self_write_off')
				uni.removeStorageSync('team_id')
				uni.removeStorageSync('store_id')
				uni.removeStorageSync('goods_id')
				uni.removeStorageSync('toexinfo')
				uni.removeStorageSync('score_id')
				const scene = decodeURIComponent(options.query.scene)
				console.log(scene)
				let arr = scene.split(',')
				getInfo({exhibit_id:arr[1]}).then((res)=>{
					uni.setStorageSync("ceilingImg", res.data.img);
					uni.setStorageSync('color', res.data.color_main);
					uni.setStorageSync('color_d', res.data.color_deputy);
				})
				if(arr[0] == 's'){
					//展商海报
					uni.setStorageSync('exhibit_id',arr[1])
					uni.setStorageSync('store_id',arr[2])
					uni.setStorageSync('team_id',arr[3])
					uni.setStorageSync('toexinfo',1)
				}else if(arr[0] == 'g'){
					//产品海报
					uni.setStorageSync('exhibit_id',arr[1])
					uni.setStorageSync('store_id',arr[2])
					uni.setStorageSync('goods_id',arr[3])
				}else if(arr[0] == 'f'){
					//积分扫码
					uni.setStorageSync('exhibit_id',arr[1])
					uni.setStorageSync('score_id',arr[2])
				}else if(arr[0] == 'v'){
					//自我核销
					uni.setStorageSync('exhibit_id',arr[1])
					uni.setStorageSync('self_write_off','1')
				}
				else{
					uni.setStorageSync('scene', scene)
				}
				
			}
			if(options.query.exhibit_id){
				uni.setStorageSync('exhibit_id',options.query.exhibit_id)
				getInfo({exhibit_id:options.query.exhibit_id}).then((res)=>{
					uni.setStorageSync("ceilingImg", res.data.img);
					uni.setStorageSync('color', res.data.color_main);
					uni.setStorageSync('color_d', res.data.color_deputy);
				})
			}
			const updateManager = uni.getUpdateManager() // 小程序版本更新管理器
		  	updateManager.onCheckForUpdate(res => { // 检测新版本后的回调
		      if(res.hasUpdate) { // 如果有新版本提醒并进行强制升级
		          uni.showModal({
		              content: '新版本已经准备好，是否重启应用？',
		              showCancel: false,
		              confirmText: '确定',
		              success: res => {
		                  if (res.confirm) {
		                      updateManager.onUpdateReady(res => { // 新版本下载完成的回调
		                          updateManager.applyUpdate() // 强制当前小程序应用上新版本并重启
		                      })
		
		                      updateManager.onUpdateFailed(res => { // 新版本下载失败的回调
		                          // 新版本下载失败，提示用户删除后通过冷启动重新打开
		                          uni.showModal({
		                              content: '下载失败，请删除当前小程序后重新打开',
		                              showCancel: false,
		                              confirmText: '知道了'
		                          })
		                      })
		                  }
		              }
		          })
		      }
		  }) 
		},
		
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";

	/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
	@font-face {
		font-family: "阿里妈妈数黑体 Bold";
		font-weight: 700;
		src: url("@/static/font/xTCVc9ituNuo.woff2") format("woff2"),
 		url("@/static/font/xTCVc9ituNuo.woff") format("woff");
  		font-display: swap;
	}
</style>