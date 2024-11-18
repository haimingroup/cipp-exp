import {
	apiGet,
	apiPost
} from '@/utils/request.js'

// 微信用户登陆接口 
export function login(data) {
	return apiPost({
		url: '/v1/auth/miniLogin',
		data: data
	})
}
// 微信用户绑定手机号 
export function getPhone(data) {
	return apiPost({
		url: '/v1/auth/bindPhone',
		data: data
	})
}
// 微信用户绑定手机号 
export function getInfo(data) {
	return apiPost({
		url: '/v1/user/getInfo',
		data: data
	})
}
// 微信用户绑定手机号 
export function editInfo(data) {
	return apiPost({
		url: '/v1/user/editInfo',
		data: data
	})
}
// 获取协议 
export function getAgreement(data) {
	return apiPost({
		url: '/v1/system/getAgreement',
		data: data
	})
}

// 展之siteToken
export function getZZToken(data) {
	return apiPost({
		url: '/v1/exhibit/getZZToken',
		data: data
	})
}


//电子签文档
export function getExhibitSign(data) {
	return apiPost({
		url: '/v1/system/getExhibitSign',
		data: data
	})
}

//电子签文档
export function saveExhibitSign(data) {
	return apiPost({
		url: '/v1/system/saveExhibitSign',
		data: data
	})
}