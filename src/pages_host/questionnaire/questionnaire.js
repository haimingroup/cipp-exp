import {apiPost} from '@/utils/request.js'
// 根据问卷号获取试卷内容
export function getQuestionPaper(data) {
    return apiPost({
        url: '/v2/question/getQuestionPaper',
        data: data
    })
}
// 填写问卷 
export function saveQuestionRecord(data) {
    return apiPost({
        url: '/v2/question/saveQuestionRecord',
        data: data
    })
}
// 获取问卷内容 
export function getQuestionData(data) {
    return apiPost({
        url: '/v2/question/getQuestionData',
        data: data
    })
}