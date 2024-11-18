import {apiPost} from '@/utils/request.js'


//获取展会的活动
export function getExhibitActivities(data) {
    return apiPost({
        url: '/v2/ticket/getExhibitActivities',
        data: data
    })
}

//获取套票支付前数据
export function getExhibitTicketInfo(data) {
    return apiPost({
        url: '/v2/ticket/getExhibitTicketInfo',
        data: data
    })
}

//报名免费的活动
export function enrollActivities(data) {
    return apiPost({
        url: '/v2/ticket/enrollActivities',
        data: data
    })
}
//门票微信支付数据
export function ticketByWxPay(data) {
    return apiPost({
        url: '/v2/ticket/ticketByWxPay',
        data: data
    })
}
//获取核销门票记录
export function getVerifyTicketList(data) {
    return apiPost({
        url: '/staff/getVerifyTicketList',
        data: data
    })
}
//获取观众二维码门票套票内容
export function getVerifyTicketInfo(data) {
    return apiPost({
        url: '/staff/getVerifyTicketInfo',
        data: data
    })
}
//核销门票
export function verifyTicketInfo(data) {
    return apiPost({
        url: '/staff/verifyTicketInfo',
        data: data
    })
}
//自我核销门票
export function verifyTicketBySelf(data) {
    return apiPost({
        url: '/v2/ticket/verifyTicketBySelf',
        data: data
    })
}