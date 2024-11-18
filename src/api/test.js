import {
	apiPost
} from '@/utils/request.js'

// 获取任务列表 
export function getList(data) {
	return apiPost({
		url: '/v2/task/getList',
		data: data
	})
}

// 任务详情 
export function getInfo(data) {
	return apiPost({
		url: '/v2/task/getInfo',
		data: data
	})
}
