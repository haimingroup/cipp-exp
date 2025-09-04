import {
	apiGet,
	apiPost
} from '@/utils/request.js'

// 参展店铺列表 
export function getStoreList(data) {
	return apiPost({
		url: '/v2/store/getStoreList',
		data: data
	})
}

// 店铺详情
export function getStoreInfo(data) {
	return apiPost({
		url: '/v2/store/getStoreInfo',
		data: data
	})
}

// 所有参展店铺展品列表
export function getGoodList(data) {
	return apiPost({
		url: '/v2/goods/getGoodList',
		data: data
	})
}

// 展品详情
export function getGoodInfo(data) {
	return apiPost({
		url: '/v2/goods/getGoodInfo',
		data: data
	})
}

// 当前店铺的展品列表
export function getStoreGoods(data) {
	return apiPost({
		url: '/v2/store/getStoreGoods',
		data: data
	})
}
// 店铺收藏&取消收藏
export function storeCollection(data) {
	return apiPost({
		url: '/v2/store/collection',
		data: data
	})
}
// 展品收藏&取消收藏
export function goodsCollection(data) {
	return apiPost({
		url: '/v2/goods/collection',
		data: data
	})
}

// 收藏的店铺列表
export function getCollectionStore(data) {
	return apiPost({
		url: '/v2/user/getCollectionStore',
		data: data
	})
}
// 收藏的展品列表
export function getCollectionGoods(data) {
	return apiPost({
		url: '/v2/user/getCollectionGoods',
		data: data
	})
}
// 个人中心的数据
export function getInfo(data) {
	return apiPost({
		url: '/v2/user/getInfo',
		data: data
	})
}
// 店铺资质信息
export function getCompanyInfo(data) {
	return apiPost({
		url: '/v2/user/store/getCompanyInfo',
		data: data
	})
}
// 我的店铺资质
export function getStoreExtInfo(data) {
	return apiPost({
		url: '/v2/user/store/getStoreExtInfo',
		data: data
	})
}
// 保存我的店铺资质
export function saveStoreExtInfo(data) {
	return apiPost({
		url: '/v2/user/store/saveStoreExtInfo',
		data: data
	})
}
// 我的店铺信息
export function getMyStore(data) {
	return apiPost({
		url: '/v2/user/store/getMyStore',
		data: data
	})
}
// 修改店铺信息
export function saveMyStore(data) {
	return apiPost({
		url: '/v2/user/store/saveMyStore',
		data: data
	})
}
// 我的店铺联系人列表
export function getMyStoreUser(data) {
	return apiPost({
		url: '/v2/user/store/getMyStoreUser',
		data: data
	})
}
// 联系人详情
export function getMyStoreUserInfo(data) {
	return apiPost({
		url: '/v2/user/store/getMyStoreUserInfo',
		data: data
	})
}
// 添加联系人信息
export function addMyStoreUser(data) {
	return apiPost({
		url: '/v2/user/store/addMyStoreUser',
		data: data
	})
}
// 修改联系人信息
export function editMyStoreUser(data) {
	return apiPost({
		url: '/v2/user/store/editMyStoreUser',
		data: data
	})
}
// 我的展品列表
export function getMyGoodList(data) {
	return apiPost({
		url: '/v2/user/goods/getMyGoodList',
		data: data
	})
}
// 添加展品
export function addMyGood(data) {
	return apiPost({
		url: '/v2/user/goods/addMyGood',
		data: data
	})
}
// 我的展品详情
export function getMyGoodInfo(data) {
	return apiPost({
		url: '/v2/user/goods/getMyGoodInfo',
		data: data
	})
}
// 修改展品
export function editMyGood(data) {
	return apiPost({
		url: '/v2/user/goods/editMyGood',
		data: data
	})
}
// 操作展品
export function opMyGood(data) {
	return apiPost({
		url: '/v2/user/goods/opMyGood',
		data: data
	})
}
// 我的团队
export function getMyTeamInfoE(data) {
	return apiPost({
		url: '/v2/team/getMyTeamInfo',
		data: data
	})
}

// 开团
export function createTeamE(data) {
	return apiPost({
		url: '/v2/team/createTeam',
		data: data
	})
}
// 团队排行
export function getTopTeamE(data) {
	return apiPost({
		url: '/v2/team/getTopTeam',
		data: data
	})
}

// 团队详情
export function getTeamInfoE(data) {
	return apiPost({
		url: '/v2/team/getTeamInfo',
		data: data
	})
}

// 店铺分享数据
export function getStorePost(data) {
	return apiPost({
		url: '/v2/store/getStorePost',
		data: data
	})
}

// 上传
export function fileUp(data) {
	return apiPost({
		url: '/v1/system/fileUp',
		data: data
	})
}
// 获取展品标签集
export function getGoodTags(data) {
	return apiPost({
		url: '/v1/system/getGoodTags',
		data: data
	})
}
// 获取店铺标签集
export function getStoreTags(data) {
	return apiPost({
		url: '/v1/system/getStoreTags',
		data: data
	})
}
 /*--------展商服务--------*/
 // 获取店铺楣版
export function getLintel(data) {
	return apiPost({
		url: '/v2/serve/getLintel',
		data: data
	})
}
 // 保存楣版信息
 export function saveLintel(data) {
	return apiPost({
		url: '/v2/serve/saveLintel',
		data: data
	})
}

 // 获取本届展商证件列表
 export function getStoreExhibitCards(data) {
	return apiPost({
		url: '/v2/serve/getStoreExhibitCards',
		data: data
	})
}

 // 获取可选店铺联系人列表
 export function getStoreUserList(data) {
	return apiPost({
		url: '/v2/serve/getStoreUserList',
		data: data
	})
}

 // 添加本届展商证
 export function addStoreExhibitCards(data) {
	return apiPost({
		url: '/v2/serve/addStoreExhibitCards',
		data: data
	})
}

 // 取消展商证
 export function delStoreExhibitCards(data) {
	return apiPost({
		url: '/v2/serve/delStoreExhibitCards',
		data: data
	})
}
/*--------- 积分---------*/
 // 积分码详情
 export function getScoreCodeDetail(data) {
	return apiPost({
		url: '/v2/score/getScoreCodeDetail',
		data: data
	})
}
 // 积分记录列表
 export function getScoreLog(data) {
	return apiPost({
		url: '/v2/score/getScoreLog',
		data: data
	})
}
 // 用户积分余额
 export function getBalance(data) {
	return apiPost({
		url: '/v2/score/getBalance',
		data: data
	})
}
 // 扫码-消费积分码
 export function consumptionScoreCode(data) {
	return apiPost({
		url: '/v2/score/consumptionScoreCode',
		data: data
	})
}

 // 展商证
 export function getExTicket(data) {
	return apiPost({
		url: '/v2/user/getMyTicket',
		data: data
	})
}
// 找回门票
export function findTicket(data) {
	return apiPost({
		url: '/v2/user/findTicket',
		data: data
	})
}
