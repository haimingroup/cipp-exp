import {apiPost} from '@/utils/request.js'
// 根据问卷号获取试卷内容
export function getZzExhibitPoll(data) {
    return apiPost({
        url: '/v3/question/getZzExhibitPoll',
        data: data
    })
}
// 填写问卷 
export function saveZzExhibitPoll(data) {
    return apiPost({
        url: '/v3/question/saveZzExhibitPoll',
        data: data
    })
}