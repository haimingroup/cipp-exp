export default {
    channel(channel,click_id) {
        uni.showModal({
            title: '提示',
            content: 'channel='+channel+'click_id'+click_id,
            showCancel: true,
            success: ({ confirm, cancel }) => {}
        })
        let date= Date.now()
        let logger = wx.getRealtimeLogManager()
        if(channel =='xhs'){
            uni.request({
                url:"https://adapi.xiaohongshu.com/api/open/conversion",
                method:'POST',
                header:{'Content-Type' : 'application/json' ,'cache-control': 'no-cache'},
                data:{
                    "app_id":'haiming123',
                    "access_token":'xhs1718694762156',
                    "event_type":"123",
                    "timestamp":date,
                    "click_id":click_id,
                    "platform":'名宠汇小程序'
                    },
                success(res){
                    if(res.data.code == 0){
                        console.log(1,res.data)
                        logger.info(res.data)
                    }else{
                        console.log(res)
                        logger.info(res.data)
                    }
                },
                fail(err){
                    logger.error(err)
                }

            })
        }else if(channel =='wx'){

        }
    },
  }