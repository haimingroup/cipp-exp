import {
	zzPost
} from '@/utils/request.js'

//根据项目ID获取项目详情
export function queryProjectDetail(data) {
	return zzPost({
		url: '/eip-web-business/api/project/queryProjectDetail',
		data: data
	})
}
//展商列表
export function getMorePageFocusCata(data) {
	return zzPost({
		url: '/eip-web-business/api/set/serveCatalogue/selectByTypeFocusCata',
		data: data
	})
}
//推荐商家
export function selectRecommendExhibitor(data) {
	return zzPost({
		url: '/eip-web-business/api/set/serveCatalogue/getHotComAndProduct',
		data: data
	})
}
//根据Id查询展商详情
export function getMoreByIdFocusCata(data) {
	return zzPost({
		url: '/eip-web-business/api/set/serveCatalogue/getMoreByIdFocusCata',
		data: data
	})
}
//查询单个展商名下的展品
export function getByServeCatalogueId(data) {
	return zzPost({
		url: '/eip-web-business/api/set/serveProduct/getByServeCatalogueId',
		data: data
	})
}
//商品列表
export function getListByType(data) {
	return zzPost({
		url: '/eip-web-business/api/set/serveProduct/getListByType',
		data: data
	})
}
//根据产品id查询产品
export function getProductById(data) {
	return zzPost({
		url: '/eip-web-business/api/set/serveProduct/getOneFocusCata',
		data: data
	})
}

//商品列表关键词查询
export function selectByKeyword(data) {
	return zzPost({
		url: '/eip-web-business/api/set/serveProduct/selectByKeyword',
		data: data
	})
}
//按关键词获取展商列表
export function exSelectByKeyword(data) {
	return zzPost({
		url: '/eip-web-business/api/set/serveCatalogue/selectByKeyword',
		data: data
	})
}