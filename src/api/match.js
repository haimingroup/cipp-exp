import {apiPost} from '@/utils/request.js'

// 获取爆品赛配置 
export function getConfig(data) {
    return apiPost({
        url: '/v2/contest/getConfig',
        data: data
    })
}
// 报名参赛
export function addContest(data) {
    return apiPost({
        url: '/v2/contest/addContest',
        data: data
    })
}
// 获取已上架展品（分页）    
export function getMyUpGoods(data) {
    return apiPost({
        url: '/v2/contest/getMyUpGoods',
        data: data
    })
}
// 展品提交参赛 
export function addMyContestGoods(data) {
    return apiPost({
        url: '/v2/contest/addMyContestGoods',
        data: data
    })
}
// 获取我的参赛展品 
export function getMyContestGoods(data) {
    return apiPost({
        url: '/v2/contest/getMyContestGoods',
        data: data
    })
}
// 展品取消参赛 
export function cancel(data) {
    return apiPost({
        url: '/v2/contest/cancelMyContestGoods',
        data: data
    })
}
// 获取爆品赛列表&排名（分页 
export function getContestGoods(data) {
    return apiPost({
        url: '/v2/contest/getContestGoods',
        data: data
    })
}
// 爆品赛投票
export function addVote(data) {
    return apiPost({
        url: '/v2/contest/addVote',
        data: data
    })
}
// 爆品赛展品海报数据
export function getStoreGoodsPost(data) {
    return apiPost({
        url: '/v2/contest/getStoreGoodsPost',
        data: data
    })
}