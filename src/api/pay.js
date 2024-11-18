import {
	apiPost
} from '@/utils/request.js'

// 获取open_id 
export function getOpenid(data) {
    return apiPost({
        url: '/v1/auth/getOpenid',
        data: data
    })
}
// 门票支付&优惠码 
export function ticket(data) {
    return apiPost({
        url: '/v1/pay/ticket',
        data: data
    })
}
// 门票订单详情 
export function getTicketOrderInfo(data) {
    return apiPost({
        url: '/v1/order/getTicketOrderInfo',
        data: data
    })
}

// 优惠码校验 
export function verifyDisCode(data) {
    return apiPost({
        url: '/v1/pay/verifyDisCode',
        data: data
    })
}
