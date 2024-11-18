import {
    apiGet,
    apiPost
} from '@/utils/request.js'

// 团队排行
export function getTopTeam(data) {
    return apiPost({
        url: '/v1/team/getTopTeam',
        data: data
    })
}

// 团队详情
export function getTeamInfo(data) {
    return apiPost({
        url: '/v1/team/getTeamInfo',
        data: data
    })
}

// 我的团队
export function getMyTeamInfo(data) {
    return apiPost({
        url: '/v1/team/getMyTeamInfo',
        data: data
    })
}

// 团员列表
export function getTeamUsers(data) {
    return apiPost({
        url: '/v1/team/getTeamUsers',
        data: data
    })
}
// 团队创建
export function createTeam(data) {
    return apiPost({
        url: '/v1/team/createTeam',
        data: data
    })
}
// 加入团队
export function joinTeam(data) {
    return apiPost({
        url: '/v1/team/joinTeam',
        data: data
    })
}
