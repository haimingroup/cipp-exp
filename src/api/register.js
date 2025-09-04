import {
    apiGet,
    apiPost
} from '@/utils/request.js'

// 联系我们 
export function contact(data) {
    return apiPost({
        url: '/v1/exhibit/contact',
        data: data
    })
}
// 联系询盘 
export function inquiry(data) {
    return apiPost({
        url: '/v1/exhibit/inquiry',
        data: data
    })
}

// 观众登记字段 
export function getFields(data) {
    return apiPost({
        url: '/v1/exhibit/getFields',
        data: data
    })
}
// 观众登记 
export function addTicket(data) {
    return apiPost({
        url:'/v3/ticket/addTicket',
        data: data
    })
}

// 门票详情 
export function getMyTicket(data) {
    return apiPost({
        url: '/v2/user/getMyTicket',
        data: data
    })
}
// 门票详情 
export function getMyTicketList(data) {
    return apiPost({
        url: '/v1/user/getMyTicketList',
        data: data
    })
}
// 登记信息 
export function getUserFieldInfo(data) {
    return apiPost({
        url: '/v1/user/getUserFieldInfo',
        data: data
    })
}
// 获取省市区 
export function getArea(data) {
    return apiPost({
        url: '/v1/system/getArea',
        data: data
    })
}
// 获取国家
export function getCountry(data) {
    return apiPost({
        url: '/v1/system/getCountry',
        data: data
    })
}
// 获取省市区
export function getAreaJson(data) {
    return apiPost({
        url: '/v1/system/getAreaJson',
        data: data
    })
}
// 专业观众-上传图片（base64）
export function proUserUp(data) {
    return apiPost({
        url: '/v2/system/proUserUp',
        data: data
    })
}
// 专业观众修改状态
export function editProStatus(data) {
    return apiPost({
        url: '/v2/ticket/editProStatus',
        data: data
    })
}