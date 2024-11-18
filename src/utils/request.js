import config from './config.js'
const hostName = config.apiUrl;
const zzUrl = config.zzUrl
const testUrl = config.testUrl
export function zzPost (params){
	const pid = uni.getStorageSync('pid');
	const siteToken = uni.getStorageSync('siteToken');
	return new Promise((relove, reject) => {
		uni.request({
			url: zzUrl + params.url,
			method: 'post',
			data: params.data,
			header: {
				'pid':pid,
				'siteToken':siteToken,
				'content-type':'application/x-www-form-urlencoded'
			},
			success(res){
				relove(res)
			},
			fail(error) {
				reject(error)
			}
	})
})
}


export function apiPost(params) {
	const token = uni.getStorageSync('token');
	return new Promise((relove, reject) => {
		uni.request({
			url: hostName + params.url,
			method: 'post',
			data: params.data,
			header: {
				'Authorization': token
			},
			success(res) {
				if (res.data.code == -1) {
					uni.showToast({
						title: '用户登录信息过期，或未登录',
						icon: 'none'
					})
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/login/index'
						})
					}, 1000)
				}
				else if (res.data.code == 2) {
					console.log('新用户绑定手机号')
				} else if (res.data.code == 3) {
					uni.showToast({
						title: '未成团，请先开团',
						icon: 'none'
					})
				} else if (res.data.code == 22) {
					uni.showToast({
						title: '请登记后查看',
						icon: 'none'
					})
					uni.navigateTo({
						url: '/pages_index/register/index'
					})
				}else if(res.data.code == 23){
					uni.setStorageSync('webviewUrl', res.data.data.url)
					uni.navigateTo({
						url: "/pages_index/webview/index"
					})
				}else if(res.data.code == 24){
					uni.navigateTo({
						url: "/pages_index/pay/index"
					})
				}
				if(res.data.code == 26){
					uni.navigateTo({
						url: "/pages_index/register/audit"
					})
				}
				relove(res.data)
			},
			fail(error) {
				reject(error)
			}
		})
	})
}

export function apiGet(params) {
	const token = uni.getStorageSync('token');
	return new Promise((relove, reject) => {
		uni.request({
			url: hostName + params.url,
			method: 'get',
			data: params.data,
			header: {
				'Authorization': token
			},
			success(res) {
				// console.log(res.data.data.no_need_login);
				// if (res.data.data.no_need_login) {
				// 	// console.log('if');
				// } else {
				// console.log('else');
				if (res.data.code === 2) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
				}
				// }

				relove(res.data)
			},
			fail(error) {
				reject(error)
			}
		})
	})
}