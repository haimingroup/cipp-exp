import {
    apiGet,
    apiPost
} from '@/utils/request.js'


// 展会列表 
export function exhibitList(data) {
    return apiPost({
        url: '/v1/exhibit/index',
        data: data
    })
}
//默认展会
export function getDefault(data) {
    return apiPost({
        url: '/v1/exhibit/getDefault',
        data: data
    })
}
// 展会详情 
export function getInfo(data) {
    return apiPost({
        url: '/v1/exhibit/getInfo',
        data: data
    })
}
// 首页数据 
export function homeData(data) {
    return apiPost({
        url: '/v1/index',
        data: data
    })
}
// 新闻分类 
export function newsGetCate(data) {
    return apiPost({
        url: '/v1/news/getCate',
        data: data
    })
}
// 新闻列表
export function newsGetList(data) {
    return apiPost({
        url: '/v1/news/getList',
        data: data
    })
}
// 新闻详情
export function newsGetInfo(data) {
    return apiPost({
        url: '/v1/news/getInfo',
        data: data
    })
}
// 本展咨询
export function getExhibitNews(data) {
    return apiPost({
        url: '/v1/news/getExhibitNews',
        data: data
    })
}
// 活动列表
export function activeList(data) {
    return apiPost({
        url: '/v1/active/index',
        data: data
    })
}
// 活动详情
export function activeGetInfo(data) {
    return apiPost({
        url: '/v1/active/getInfo',
        data: data
    })
}
// 活动收藏
export function activeCollect(data) {
    return apiPost({
        url: '/v1/active/collect',
        data: data
    })
}
// 活动报名
export function activeEnroll(data) {
    return apiPost({
        url: '/v1/active/enroll',
        data: data
    })
}

// 活动收藏列表
export function getCollectList(data) {
    return apiPost({
        url: '/v1/active/getCollectList',
        data: data
    })
}

// 活动报名列表
export function getEnrollList(data) {
    return apiPost({
        url: '/v1/active/getEnrollList',
        data: data
    })
}
// 页面详情
export function getPageInfo(data) {
    return apiPost({
        url: '/v1/exhibit/getPageInfo',
        data: data
    })
}

// 获取轮播
export function getSlider(data) {
    return apiPost({
        url: '/v1/getSlider',
        data: data
    })
}