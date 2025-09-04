<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" placeholder :bgColor="themeColors" @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">调查问卷</text>
      </view>
    </u-navbar>
    <view class="content">
      <u-form labelPosition="top" ref="uForm" labelWidth="500rpx">
        <view class="formBox">
          <u-form-item v-for="(item, key) in formlist" :key="key" :required="item.required" :label="item.question_topic"
            prop="name">
            <!-- 单选 -->
            <u-radio-group v-if="item.type == 1" v-model="all[key].answers[0].answerId" placement="column" size="40"
              iconSize="24" labelSize="32">
              <view v-for="(lable, rindex) in item.options" :key="rindex"
                style="display: flex; align-items: center; margin: 10rpx 0;">
                <u-radio :customStyle="{ fontSize: '32rpx' }" labelSize="32" :name="lable.answerId" 
                  :value="lable.answerId" @change="radioChange(lable, key)">
                </u-radio>
                <text @tap="selectRadio(lable, key)" style="margin-left: 10rpx; flex: 1;">
                  {{ lable.options }}
                </text>
                <u-input v-if="
                  lable.is_input == 1 &&
                  all[key].answers[0].answerId === lable.answerId
                " v-model="all[key].answers[0].otherAnswer" placeholder="请输入信息" border="bottom"
                  style="margin-left: 20rpx; flex: 1;"></u-input>
              </view>
            </u-radio-group>

            <!-- 多选 -->
            <u-checkbox-group v-if="item.type == 2" placement="col" size="40" iconSize="24"
              @change="(e) => checkboxChange(e, key)">
              <view v-for="(clable, cindex) in item.options" :key="cindex">
                <view style="display: flex; align-items: center; margin: 10rpx 0;">
                  <u-checkbox :key="cindex" labelSize="32"  :name="clable.answerId">
                  </u-checkbox>
                  <text @tap="selectCheckbox(clable, key)" style="margin-left: 10rpx; flex: 1;">
                    {{ clable.options }}
                  </text>
                </view>
                <u-input v-if="clable.is_input == 1 && all[key].answers.some(a => a.answerId === clable.answerId)"
                  v-model="all[key].answers.find(a => a.answerId === clable.answerId).otherAnswer" placeholder="请输入信息"
                  border="bottom" style="margin: 10rpx 0 20rpx 50rpx; width: 80%"
                  @change="(e) => { inpChange(e, key, clable) }"></u-input>
              </view>
            </u-checkbox-group>
            <!-- 输入框 -->
            <u-input v-if="item.type == 3" v-model="all[key].questAnswer" placeholder="请输入信息"
              border="bottom"></u-input>
          </u-form-item>
        </view>
      </u-form>
      <view class="subBtn" :style="'background:' + themeColors" @tap="save">
        提交问卷
      </view>
    </view>
  </view>
</template>

<script>
import { getZzExhibitPoll, saveZzExhibitPoll } from "./zzquestionnaire";
export default {
  data() {
    return {
      themeColors: uni.getStorageSync("color"),
      pay: 0,
      enroll_user_id: "",
      formlist: [],
      all: [],
      showInp: false,
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
    if (options.enroll_user_id) {
      this.enroll_user_id = options.enroll_user_id;
    }
    getZzExhibitPoll({
      exhibit_id: uni.getStorageSync('exhibit_id'),
    }).then((res) => {
      this.formlist = res.data;
      this.formlist.forEach(element => {
        if (element.type == 3) {
          this.all.push({ questId: element.questId, questAnswer: '' })
        } else if (element.type == 1) {
          this.all.push({ questId: element.questId, answers: [{ answerId: '', otherAnswer: '' }] })
        } else if (element.type == 2) {
          this.all.push({ questId: element.questId, answers: [] })
        }
      })
      uni.hideLoading();
    });
  },
  methods: {
    save() {
      saveZzExhibitPoll({ question_data: this.all, enroll_user_id: this.enroll_user_id, pay: this.pay }).then(res => {
        if (res.code == 1) {
          uni.showToast({
            title: '提交成功',
            icon: '',
            duration: 2000,
            success: () => {
              if (this.pay == 1) {
                uni.navigateTo({ url: '/pages_index/pay/index' })
              } else {
                uni.switchTab({ url: '/pages/center/index' })
              }
            },
          });
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none',
            mask: true
          })
        }

      })
    },
    inpChange(e, key, clable) {
      this.all[key].answers.find(a => a.answerId === clable.answerId).otherAnswer = e
    },
    checkboxChange(selectedIds, key) {
      // 生成带otherAnswer字段的答案数组
      const newAnswers = selectedIds.map(id => ({
        answerId: id,
        otherAnswer: this.all[key].answers.find(a => a.answerId === id)?.otherAnswer || ''
      }));

      // 更新对应问题的答案数组
      this.all[key].answers = newAnswers;
    },
    selectRadio(lable, key) {
      // 设置单选值
      this.all[key].answers[0].answerId = lable.answerId;
      this.radioChange(lable, key);
    },
    selectCheckbox(clable, key) {
      // 获取当前选中的答案ID数组
      const currentAnswers = this.all[key].answers.map(a => a.answerId);

      // 判断是否已选中
      const isSelected = currentAnswers.includes(clable.answerId);

      if (isSelected) {
        // 如果已选中，则取消选择
        this.all[key].answers = this.all[key].answers.filter(a => a.answerId !== clable.answerId);
      } else {
        // 如果未选中，则添加选择
        this.all[key].answers.push({
          answerId: clable.answerId,
          otherAnswer: ''
        });
      }

      // 触发checkbox组件的change事件
      const selectedIds = this.all[key].answers.map(a => a.answerId);
      this.checkboxChange(selectedIds, key);
    },
    radioChange(e, num) {
      console.log(e, this.all[num].answers[0].answerId)
      if (e.is_input == 1) {
        this.showInp = true
      } else {
        this.showInp = false
      }
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
  font-weight: 700;
  line-height: 36rpx;
  text-align: left;
}

.content {
  padding: 32rpx;

  .formBox {
    background: #fff;
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

.subBtn {
  width: 200rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 60rpx;
  color: #fff;
  margin: 0 auto;
}

::v-deep .u-radio-group--row {
  flex-wrap: wrap;
}
</style>