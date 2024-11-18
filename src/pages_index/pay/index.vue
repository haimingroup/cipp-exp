<template>
  <view class="page">
    <u-navbar :fixed="true" placeholder :bgColor="themeColors" @leftClick="back">
        <view class="navTitle" slot="left">
            <u-icon name="arrow-left" color="#FFF"></u-icon>
            <text style="margin-left: 20rpx">确认订单</text>
        </view>
	</u-navbar>
    <view class="content">
        <!-- 展会信息 -->
        <view class="title" >
            <view class="colorBox" :style="`background:`+themeColors"></view>
            <view class="titleStr">展会信息</view>
        </view>
        <view class="ticketInfo" style="margin-bottom:40rpx">
            <p class="test">
                {{info.name}}
            </p>
            <view class="time">
                <u-icon :name="timeIcon" size="26"></u-icon>
                <span>{{info.start_time}}-{{info.end_time}}</span>
            </view>
            <view class="time">
                <u-icon name="map" size="26"></u-icon>
                <span>{{info.lab_name}}</span>
            </view>
        </view>
        <!-- 票务信息 -->
        <view class="title" style="margin-bottom:40rpx"  v-if="!info.many_tickets">
            <view class="colorBox" :style="`background:`+themeColors"></view>
            <view class="titleStr">票务信息</view>
        </view>
        <view class="title" style="margin:40rpx 0" v-if="info.many_tickets">
                <view class="colorBox" :style="`background:`+themeColors"></view>
                <view class="titleStr">多人票选择</view>
        </view>
        <view class="ticketInfo" v-if="!info.many_tickets ">
            <view style="display: flex;justify-content: space-between;margin-bottom: 20rpx;" v-if="showPic">
                <p class="test">
                    {{ info.name}}门票  
                </p>
                <p class="money">
                     ¥{{info.price}}
                </p>
            </view>
           
            <view  v-for="checkItem in checkList" :key="checkItem.activity_id" style="display: flex;justify-content: space-between;margin-bottom: 20rpx;">
            <p class="test">
                {{ checkItem.title}} 
            </p>
            <p class="money">
                ¥{{checkItem.price||0}}
            </p>
        </view>
        </view>
        <!-- 没想好怎么写，先简单显示，等后期简化代码再更改 -->
        <view class="ticketInfo" v-if="info.many_tickets" :style="current == 1? 'border-color:'+ themeColors : ''" @tap="check(1,Number(info.price))">
            <view style="display: flex;justify-content: space-between" >
                <p class="test">
                    单人门票  
                </p>
                <p class="money">
                     ¥{{Number(info.price)}}
                </p>
            </view>
        </view>
        <view class="ticketInfo" 
            v-for="ticket,indextic in info.many_tickets" 
            :key="indextic"
            :style="current == ticket.people_num? 'border-color:'+ themeColors : ''"
            style="margin-top: 20rpx;" 
            @tap="check(ticket.people_num,ticket.price )">
            <view style="display: flex;justify-content: space-between" v-if="showPic">
                <p class="test">
                    {{ ticket.people_num}}人门票  
                </p>
                <p class="money">
                    ¥{{Number(ticket.price)}}
                </p>
            </view>
        </view>
    </view>
    <view class="footer" >
        <view class="discounts">
                <view class="left" :style="`background:`+themeColors">
                    <image
                        class="icon"
                        src="../static/Vector.png"
                        mode="scaleToFill"
                    />
                </view>
                <view class="right" :style="`background:`+themeColors+`33;color:`+themeColors"   @click="showPop = true">
                    <text>{{textd_code}}</text> 
                    <u-icon name="arrow-right" :color="themeColors"></u-icon>
                </view>
            </view>
            <u-modal 
                :show="showPop" 
                title="请输入优惠码"
                confirmColor="#566788"
                @cancel="showPop=false" 
                @confirm="confirm"
                :closeOnClickOverlay="true" 
                :showCancelButton="true">
                <view>
                    <form>
                        <from-item>
                            <input
                                style="background-color:#EDEDED;border-radius: 10rpx;height:80rpx;margin-top: 56rpx;padding: 5rpx 20rpx"
                                placeholder="请输入券码"
                                v-model="discount_code"
                            />
                            <span v-if="showRule" style="color:red;font-size: 28rpx;margin-top: 10rpx;">无效优惠码</span>
                        </from-item>
                    </form>
                    
                </view>
	        </u-modal>
        <view class="down">
            <view class="left">
                <view style="margin-bottom:10rpx" ><text>实付款：</text> <text style="color:#FF0000">¥{{totalPrices}}</text></view>
            <view style="font-size: 28rpx;color: #7F7F7F;"><text>优惠-</text> <text>¥{{dmoney}}</text></view>
        </view>
        <view class="right">
            <view class="subBtn" :style="`background:`+themeColors" @click="topay">
                确认支付
            </view>
        </view>
        </view>
       
    </view>
    
  </view>
</template>

<script>
import {getOpenid,verifyDisCode} from '@/api/pay.js';
import {getExhibitTicketInfo,ticketByWxPay,verifyTicketBySelf} from "@/api/combination"
import {getMyTicket} from "@/api/register";
import {getInfo} from "@/api/list.js";
import config from "@/utils/config";
export default {
    data() {
			return {
                themeColors: uni.getStorageSync("color"),
                timeIcon: require("../../static/time.svg"),
                showList:[],
                open_id:'',
                info:{},
                showPop:false,
                showRule:false,
                showPic:true,
                haveDiscount:false,
                discount_code:'',
                totalPrices:0,
                textd_code:'使用优惠码',
                dmoney :0,
                orderInfo:'',
                ticketInfo:{},
                checkList:[],
                actprice:0,
                current:1,
            }
        },
        async onLoad(options) {
            uni.showLoading({
					title: "加载中",
				});
                console.log( options)
            if(options.pic){
                this.showPic = false
            }
           if(options.check){
            await getExhibitTicketInfo({exhibit_id: uni.getStorageSync("exhibit_id"), activity_ids:options.check}).then((res)=>{
                this.checkList = res.data.exhibitActivities
                this.checkList.map(item=>{
                    console.log(item.price)
                    if(item.price!=null){
                        this.actprice =  Number(item.price) + this.actprice
                    }
                })
            })
           }
          
           await getInfo({
				exhibit_id: uni.getStorageSync("exhibit_id"),
			}).then((res) => {
					this.info = res.data
                    this.info.many_tickets = JSON.parse(res.data.many_tickets)
                    if(this.showPic == false){
                        this.totalPrices = Number(this.actprice)
                    }else{
                        this.totalPrices = Number(this.actprice) + Number(this.info.price)
                    }
					uni.hideLoading();
			});
        },  
        methods:{
            check(num,money){
                this.current = num 
                this.totalPrices = money
                if(this.dmoney != 0){
                    if(Number(this.totalPrices)-Number(this.dmoney)<0){
                        this.totalPrices = 0
                    }else{
                        this.totalPrices = this.totalPrices - this.dmoney
                    }
                }
            },
            back() {
                uni.navigateBack();
             },
             //优惠码确认是有有效
             confirm(){
                if(!this.info.many_tickets){
                    this.totalPrices = Number(this.actprice) + Number(this.info.price)
                }else{
                    if(this.current == 1){
                        this.totalPrices = Number(this.info.price)
                    }else{
                        console.log(this.current-2,this.info.many_tickets,this.info.many_tickets[this.current-2])
                        this.totalPrices = Number(this.info.many_tickets[this.current-2].price)
                    }
                   
                }
                verifyDisCode({discount_code:this.discount_code,exhibit_id: uni.getStorageSync("exhibit_id")}).then((res)=>{
                    if(res.code ==1){
                        this.showPop =false
                        this.dmoney  = res.data.discount_price
                        
                        if(Number(this.totalPrices)-Number(this.dmoney)<0){
                            this.totalPrices = 0
                        }else{
                            this.totalPrices = this.totalPrices - this.dmoney
                        }
                        this.textd_code = this.discount_code
                        this.haveDiscount = true
                    }else{
                        this.showRule = true
                    }
                })
             },
             topay() { 
                uni.showLoading({
					title: "加载中",
				});
                let that = this;
                uni.login({
                provider: "weixin",
                scopes: "auth_user",
                success: (loginRes) => {
                     uni.getUserInfo({
                        provider: "weixin",
                        success: (infoRes) => {
                            //拉取openid
                             getOpenid({
                                js_code: loginRes.code,
                                iv: infoRes.iv,
                                encrypted_data: infoRes.encryptedData,
                                code: config.project,
                            }).then((res)=>{
                                let obj = {
                                    exhibit_id:that.info.exhibit_id,
                                    trade_type:1,
                                    openid:res.data.openid,
                                    activity_ids:[],
                                    type:''
                                }
                                //判断优惠券 更改pay_type
                                if(that.haveDiscount){
                                    obj.discount_code = that.discount_code
                                }
                                if(that.info.many_tickets && that.current !==1){
                                    obj.people_num = that.current
                                    obj.type = 0
                                }else if(that.info.many_tickets && that.current ==1){
                                    obj.type = 0
                                }else if(that.checkList.length){
                                    obj.type = 1
                                    obj.activity_ids.push(that.checkList.map(res=>{
                                        return res.activity_id
                                    }))
                                }else{
                                    obj.type = 0
                                }
                                obj.activity_ids = obj.activity_ids.join()
                                //支付
                                ticketByWxPay(obj).then((res)=>{
                                    that.orderInfo = res.data
                                    //优惠券抵扣
                                    if(that.totalPrices == 0 ){
                                        uni.showLoading({
                                            title: "加载中",
                                        });
                                        this.getTicketInfo()
                                        return
                                    }
                                   //微信支付
                                    uni.getProvider({
                                        service:'payment',
                                        success:(loginRes)=>{
                                            uni.requestPayment({
                                                "provider":loginRes.provider[0],
                                                appid:that.orderInfo.appId,
                                                timeStamp:that.orderInfo.timeStamp,
                                                nonceStr:that.orderInfo.nonceStr,
                                                package: that.orderInfo.package,
                                                signType:that.orderInfo.signType,
                                                paySign:that.orderInfo.paySign,
                                            success:()=>{
                                                uni.showLoading({
                                                    title: "加载中",
                                                });
                                                that.getTicketInfo()
                                            },
                                            fail: function (err) {
                                                console.log(that)
                                                uni.hideLoading();
                                                uni.showToast({
                                                    title: '支付失败',
                                                    icon:"none",
                                                })
                                            }
                                            })
                                        }
                                    })
                                    
                                })
                            })
                        }
                        })
                        }
                    })
                

             
             },
             toCenter(){
                getMyTicket({
							exhibit_id: uni.getStorageSync("exhibit_id"),
						}).then((res) => {
                            uni.setStorageSync("tickerInfo", JSON.stringify(res.data));
                            uni.switchTab({
                                url: "/pages/center/index",
                            });
						})
             },
             getTicketInfo(){
                uni.hideLoading();
                if(uni.getStorageSync("self_write_off")){
                    verifyTicketBySelf({exhibit_id:uni.getStorageSync('exhibit_id')}).then(((res)=>{
                        uni.removeStorageSync('self_write_off')
                    }))
                }
                uni.navigateTo({ url: '/pages_index/pay/info' })
            }
             }
        }
</script>

<style lang="scss" scoped> 
    .page {
        min-height: 92vh;
        background: rgb(239, 239, 239);
        padding-bottom: 0;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
    }

    .navTitle {
        display: flex;
        color: rgb(255, 255, 255);
        font-size: 36rpx;
        line-height: 36rpx;
        text-align: left;
    }
    .content{
        padding:48rpx 32rpx;
        .title{
            display: flex;
            align-items: center;
            margin-bottom: 24rpx;
            .colorBox{
                width: 12rpx;
                height: 32rpx;
                margin-right:24rpx;
            }
            .titleStr{
                font-size: 32rpx;
            }
        }
        .ticketInfo{
            background: #FFF;
            border: 2rpx solid #FFF;
            border-radius: 20rpx;
            padding: 24rpx 32rpx;
            .money{
                color: rgba(255, 0, 0, 0.85);
                font-size: 28rpx;
            }
        
            .time{
                display: flex;
                color: rgb(153, 153, 153);
                font-size: 24rpx;
                font-weight: 500;
                margin-left: 10rpx;
                margin-top:20rpx ;
            }
            .cell {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(210, 210, 210, 0.25);
                padding: 30rpx 0;

                .cellTitle {
                    font-size: 28rpx;
                    color: #000;
                    width: 260rpx;
                    margin-left: 20rpx;
                }

                .cellCon {
                    font-size: 24rpx;
                    color: rgba(0, 0, 0, 0.45);
                }
	        }
        }
        .checkBtn{
            width: 246rpx;
            height: 70rpx;
            color: #FFF;
            font-size: 28rpx;
            margin: 96rpx auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius:70rpx;
        }
    }
    .footer{
        position: fixed;
        bottom: 0;
        width: 100%;
        box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
        background: rgb(255, 255, 255);
        padding-top: 12rpx;
        padding-bottom: 0;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: calc(env(safe-area-inset-bottom));
        .discounts{
                display: flex;
                align-content: center;
                border-radius: 20rpx;
                overflow: hidden;
                margin: 12rpx 38rpx;
                .left{
                    padding: 0 20rpx;
                    height: 64rpx;
                    display: flex;
                    align-items: center;
                    .icon{
                        width: 48rpx;
                        height: 48rpx;
                    }
                }
                .right{
                    width: 80%;
                    font-size: 24rpx;
                    height: 64rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 40rpx;
                   
                }
            }
        .down{
            display: flex;
             align-items: center;
             justify-content: space-between;
            .left{
                margin-left:38rpx ;
            }
            .right{
                margin-right: 38rpx;
            }
        }

    }
    .subBtn{
            padding: 24rpx 44rpx;
            color: #FFF;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20rpx;
        }
</style>