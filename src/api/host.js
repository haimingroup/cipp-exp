import {
    apiGet,
    apiPost
} from '@/utils/request.js'


// 我的客户列表
export function getStoreList(data) {
    return apiPost({
        url: '/staff/getStoreList',
        data: data
    })
}
// 展商身份登录
export function loginStore(data) {
    return apiPost({
        url: '/staff/loginStore',
        data: data
    })
}
// 邀请观众统计
export function getStaffTeamUserTotal(data) {
    return apiPost({
        url: '/staff/getStaffTeamUserTotal',
        data: data
    })
}
// 我的渠道观众列表 
export function getStaffTeamUserList(data) {
    return apiPost({
        url: '/staff/getStaffTeamUserList',
        data: data
    })
}
// 获取展商楣版列表
export function getLintelList(data) {
    return apiPost({
        url: '/staff/getLintelList',
        data: data
    })
}
 // 审核展商楣版
export function verifyLintel(data) {
    return apiPost({
        url: '/staff/verifyLintel',
        data: data
    })
}
//获取店铺详情
export function getStoreInfo(data) {
    return apiPost({
        url: '/staff/getStoreInfo',
        data: data
    })
}
// 审核店铺名称
export function verifyStoreInfo(data) {
    return apiPost({
        url: '/staff/verifyStoreInfo',
        data: data
    })
}
// 获取待审核的展品列表
export function getVerifyStoreGoods(data) {
    return apiPost({
        url: '/staff/getVerifyStoreGoods',
        data: data
    })
}
// 获取待审核展品详情
export function getVerifyStoreGoodInfo(data) {
    return apiPost({
        url: '/staff/getVerifyStoreGoodInfo',
        data: data
    })
}
// 审核展商展品
export function verifyStoreGood(data) {
    return apiPost({
        url: '/staff/verifyStoreGood',
        data: data
    })
}
// 获取待审核参赛展品
export function getVerifyStoreContestGoods(data) {
    return apiPost({
        url: '/staff/getVerifyStoreContestGoods',
        data: data
    })
}
// 审核爆品赛展品
export function VerifyStoreContestGood(data) {
    return apiPost({
        url: '/staff/VerifyStoreContestGood',
        data: data
    })
}

// 分享团队码
export function getTeamShare(data) {
    return apiPost({
        url: '/v2/team/getTeamShare',
        data: data
    })
}