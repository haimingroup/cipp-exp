<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar
      :fixed="true"
      placeholder
      :bgColor="themeColors"
      @leftClick="back"
    >
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">调查问卷</text>
      </view>
    </u-navbar>
    <view class="content">
      <u--form
        v-for="(formItem,index) in formlist"
        :key="formItem.question_paper_no"
        :model="all[index]"
        labelPosition="top"
        ref="uForm"
        labelWidth="500rpx"
      >
        <view class="formBox">
          <view class="title">{{ formItem.title }}</view>
          <u-form-item
            v-for="(item, key) in formItem.get_topic"
            :key="key"
            :label="item.question_topic"
            prop="name"
          >
            <!-- 单选 -->
            <u-radio-group
              v-if="item.type == 1"
              v-model="all[index].options[key].selected[0]"
              placement="row"
              size="40"
              iconSize="24"
              labelSize="32"
            >
              <u-radio
                v-for="(lable, rindex) in item.options_data"
                :key="rindex"
                :customStyle="{ marginRight: '8px', fontSize: '32rpx' }"
                labelSize="32"
                :name="lable.option_id"
                :label="lable.content"
                :value="lable.option_id"
              />
            </u-radio-group>
            <!-- 多选 -->
            <u-checkbox-group
              v-if="item.type == 2"
              v-model="all[index].options[key].selected"
              placement="col"
              size="40"
              iconSize="24"
              @change="checkboxChange"
            >
              <u-checkbox
                :customStyle="{ marginRight: '8px',marginBottom: '10rpx'}"
                v-for="(clable, cindex) in item.options_data"
                :key="cindex"
                labelSize="32"
                :label="clable.content"
                :name="clable.option_id"
              >
              </u-checkbox>
            </u-checkbox-group>
            <!-- 输入框 -->
            <u--input
              v-if="item.type == 3"
              v-model="all[index].options[key].content"
              placeholder="请输入信息"
              border="bottom"
            ></u--input>
          </u-form-item>
        </view>
      </u--form>
      <view class="subBtn" :style="'background:'+themeColors" @tap="save">
        提交问卷
      </view>
    </view>
  </view>
</template>

<script>
import { getQuestionPaper, saveQuestionRecord } from "./questionnaire";
export default {
  data() {
    return {
      themeColors: uni.getStorageSync("color"),
      pay: 0,
      enroll_user_id: "5077",
      formlist: [],
      all: [],
      check:[],
      pic:0,
    };
  },
  onLoad(options) {
    uni.showLoading({
      title: "加载中",
    });
    console.log(options);
    if (options.pay) {
      this.pay = options.pay;
    }
    this.check = options.check
    this.pic = options.pic
    getQuestionPaper({
      question_paper_no:options.question_paper_no,
    }).then((res) => {
      this.formlist = res.data;
     
      this.formlist.forEach(element => {
        let options= []
        for(let i in element.get_topic){
            options.push({'topic_id':element.get_topic[i].topic_id,'selected':[],'content':'',type:element.get_topic[i].type})
        }
        this.all.push({'question_paper_no':element.question_paper_no,'options':options})
      })
      uni.hideLoading();
    });
  },
  methods: {
    save() {
      for(let i in this.all){
        for(let j in this.all[i].options){
          if(this.all[i].options[j].type == 3){
            if(this.all[i].options[j].content==''){
              console.log('输入框',this.all[i].options[j].type,this.all)
              uni.showToast({
              title: '请填写全部问卷问题',
              icon: 'none',
              mask: true
            })
            return
            }
        }else{
              if(this.all[i].options[j].selected.length==0){
                console.log('多单选',this.all[i].options[j].type,this.all[i].options[j].selected)
                uni.showToast({
                  title: '请填写全部问卷问题',
                  icon: 'none',
                  mask: true
                })
                return
              }
          }
      }
    }
      saveQuestionRecord({question_data:JSON.stringify(this.all),enroll_user_id:uni.getStorageSync('enroll_user_id'),pay:this.pay}).then((res) => {
          if(res.code==1){
          console.log(this.pic)
            if(this.pay == 1){
              uni.navigateTo({ url: '/pages_index/pay/index?check='+this.check })
            }else if(this.pic == 1){
                uni.navigateTo({ url: '/pages_index/pay/index?pic=1&check='+this.check })
            }else{
              uni.switchTab({ url: '/pages/center/index' })
            }
          }else{
            uni.showToast({
              title: res.code,
              icon: 'none',
              mask: true
            })
          }
      });
      console.log(this.all)
    },
    checkboxChange(e) {
      console.log(e)
    },
    back() {
      uni.navigateBack({
        fail: () => {
          uni.switchTab({ url: "/pages/index/index" });
        },
      });
    },
  },
};
</script>

<style  lang="scss" scoped>
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
  font-weight: 700;
  line-height: 36rpx;
  text-align: left;
}
.content {
  padding: 32rpx;
  .formBox{
    background: #FFF;
    padding: 32rpx;
    border-radius: 20rpx;
    margin-bottom: 50rpx;
  }
  .title {
    font-weight: 700;
    font-size: 36rpx;
    margin: 10rpx auto;
  }
}
.subBtn{
    width: 200rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    border-radius: 60rpx;
    color: #FFF;
    margin: 0 auto;
}
::v-deep .u-radio-group--row{
  flex-wrap: wrap;
}
</style>