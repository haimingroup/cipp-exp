<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <u-navbar :fixed="true" :bgColor="bgColor" @leftClick="back">
      <view class="navTitle" slot="left">
        <u-icon name="arrow-left" color="#FFF"></u-icon>
        <text style="margin-left: 10rpx">观众预登记</text>
      </view>
    </u-navbar>
    <view>
      <image class="headerImg" :src="imgSrc" mode="scaleToFill" />
    </view>
    <view class="title"> 立即登记 </view>
    <view class="content">
      <view class="from">
        <u--form
          labelPosition="left"
          :model="from"
          ref="uForm"
          labelWidth="130rpx"
        >
          <u-form-item
            v-for="(item, key) in showList"
            :key="key"
            :label="item.exhibit_field_one.field_label"
            prop="name"
            required
          >
            <!-- 输入框 -->
            <u--input
              v-if="item.exhibit_field_one.type == 1"
              v-model="from[item.exhibit_field_one.field_name]"
              :disabled="
                item.exhibit_field_one.field_name == 'phone' ? true : false
              "
              placeholder="请输入信息"
              border="bottom"
            ></u--input>
            <!-- 单选 -->
            <u-radio-group
              v-if="item.exhibit_field_one.type == 2"
              v-model="from[item.exhibit_field_one.field_name]"
              placement="row"
              iconSize="24"
              labelSize="32"
            >
              <u-radio
                v-for="(lable, rindex) in JSON.parse(
                  item.exhibit_field_one.options
                )"
                :key="rindex"
                :customStyle="{ marginRight: '8px', fontSize: '32rpx' }"
                iconSize="24"
                labelSize="32"
                :name="rindex"
                :label="lable"
                :value="rindex"
              />
            </u-radio-group>
            <!-- 多选 -->
            <u-checkbox-group
              v-if="item.exhibit_field_one.type == 3"
              v-model="from[item.exhibit_field_one.field_name]"
              placement="row"
              @change="checkboxChange"
            >
              <u-checkbox
                :customStyle="{ marginRight: '8px' }"
                v-for="(clable, cindex) in JSON.parse(
                  item.exhibit_field_one.options
                )"
                :key="cindex"
                iconSize="24"
                labelSize="32"
                :label="clable"
                :name="cindex"
              >
              </u-checkbox>
            </u-checkbox-group>

            <!-- 问答 文本域 -->
            <u--textarea
              v-if="item.exhibit_field_one.type == 4"
              v-model="from[item.exhibit_field_one.field_name]"
              placeholder="请输入内容"
              border="bottom"
            ></u--textarea>
          </u-form-item>
          <u-form-item label="所在地" v-if="showArea" prop="phone" required>
            <text @tap="show = true">{{ locationText }}</text>
            <u-picker
              :show="show"
              ref="uPicker"
              visibleItemCount="7"
              closeOnClickOverlay
              :columns="columns"
              keyName="name"
              @confirm="confirm"
              @cancel="show = false"
              @change="changeHandler"
            ></u-picker>
          </u-form-item>
          <u-form-item label="国家" v-if="showcountry" prop="phone" required>
            <text @tap="showC = true">{{ countryText }}</text>
            <u-picker
              :show="showC"
              closeOnClickOverlay
              visibleItemCount="7"
              :columns="country"
              keyName="cn_name"
              @cancel="showC = false"
              @confirm="confirmCoun"
            ></u-picker>
          </u-form-item>
            <!-- 单选 -->
            <u-form-item label="观众身份" prop="phone" required>
              <u-radio-group
                v-model="from.type"
                placement="row"
                iconSize="24"
                labelSize="32"
                @change="radChange"
              >
                <u-radio
                  :customStyle="{ marginRight: '8px', fontSize: '32rpx' }"
                  iconSize="24"
                  labelSize="32"
                  :name="0"
                  label="普通观众"
                  value="0"
                />
                <u-radio
                  :customStyle="{ marginRight: '8px', fontSize: '32rpx' }"
                  iconSize="24"
                  labelSize="32"
                  :name="1"
                  label="专业观众"
                  value="1"
                />
              </u-radio-group>
            
            </u-form-item>
            <text v-if="showUPload" style="margin-left: 130rpx;color: #7d7d7d;font-size: 20rpx;">执照，名片二选一上传即可</text>
            <u-form-item v-if="showUPload" label="营业执照" prop="phone" required>
              <u-upload
                  :fileList="fileList1"                          
                  @afterRead="afterRead1"
                  @delete="deletePic"
                  name="1"
                  width="144"
                  height="144"
                  :maxCount="1"
                  :previewFullImage="true"
              ></u-upload>
            </u-form-item>
              <u-form-item  v-if="showUPload" label="名片图片" prop="phone" required>
                <u-upload
                    :fileList="fileList2"                          
                    @afterRead="afterRead2"
                    @delete="deletePic"
                    name="2"
                    width="144"
                    height="144"
                    :maxCount="1"
                    :previewFullImage="true"
                ></u-upload>
              </u-form-item>

        </u--form>
      </view>
      <view class="subBtn" :style="'background:'+ themeColors" @tap="submit"> 提交 </view>
    </view>
    <u-modal :show="showModal" buttonReverse showCancelButton confirmText="找回门票" :content='content' @confirm="modalConfirm" @cancel="showModal = false"></u-modal>
  </view>
</template>
   <script>
import { getFields, addTicket, getAreaJson, getCountry,proUserUp } from "@/api/register";
import {findTicket} from '@/api/v2'
import {verifyTicketBySelf} from '@/api/v2'
import config from '@/utils/config.js'
export default {
  data() {
    return {
      content:'如若您在其他渠道登记过信息,请选择找回门票,否则请点击取消继续登记。',
      themeColors: uni.getStorageSync('color'),
      imgSrc: uni.getStorageSync("ceilingImg"),
      show: false,
      showModal:true,
      showC: false,
      showcountry: false,
      showArea: false,
      bgColor:uni.getStorageSync('color'),
      from: {},
      showList: [],
      columns: [],
      country: [],
      countryCode: "",
      pcode: "",
      cityCode: "",
      areaCode: "",
      locationText: "请选择",
      countryText: "请选择",
      areaList: [],
      fileList1: [],
      fileList2: [],
      showUPload: false,
    };
  },
  async onLoad(options) {

    uni.showLoading({
      title: "加载中",
    });
    await getFields({
      exhibit_id: uni.getStorageSync("exhibit_id"),
    }).then((res) => {
      uni.showToast({
        title: "请登记后查看",
        icon: "none",
      });
      this.showList = res.data
      this.showList.map((item, index) => {
        this.from[item.exhibit_field_one.field_name] = "";
        if (item.exhibit_field_one.field_name == "area_code") {
          this.showArea = true;
          this.showList.splice(index, 1);
        }
        if (item.exhibit_field_one.field_name == "country") {
          this.showcountry = true;
          this.showList.splice(index, 1);
        }
        if (item.exhibit_field_one.field_name == "phone") {
          this.from["phone"] = uni.getStorageSync("phone");
        }
      });
      this.from['type'] = 0
      uni.hideLoading();
    });
    await getCountry().then((res) => {
      this.country = [res.data];
    });
    if (this.showArea) {
      await getAreaJson().then((res) => {
        this.areaList = res.data;
      });
      this.columns[0] = this.areaList.map((e) => {
        return e;
      });
      this.columns[1] = this.areaList[0].child.map((e) => {
        return e;
      });
      this.columns[2] = this.areaList[0].child[0].child.map((e) => {
        return e;
      });
      const picker = this.$refs.uPicker;
      picker.setColumns(this.columns, "this.columns");
    }
  },
  methods: {
    modalConfirm(){
      findTicket({exhibit_id:uni.getStorageSync('exhibit_id'),obj_id:config.obj_id}).then((res)=>{
        if(res.code == 0){
          uni.showToast({
              title: res.msg,
              icon: "none",
            });
            this.showModal =false
        }else{
          uni.switchTab({ url: '/pages/center/index' })
        } 
      })
    },
    radChange(n){
        if(n ==1){
          this.showUPload =true
        }else{
          this.showUPload =false
        }
    },
    recursionCompressWechat(url, count, isReturnBase64, callback) {
        // 在递归五次后结束递归
        if (count > 5) {
          if (isReturnBase64) {
            WechatTobase4(url)
          } else {
            callback && callback(url);
          }
          return;
        }
        // 将图片进行压缩
        uni.compressImage({
          src: url, // 图片路径
          quality: 40, // 压缩质量
          success: (resCompress) => {
            console.log(resCompress, "压缩后");
            // 先获取压缩后的体积，大于1M就继续压缩
            uni.getFileInfo({
              filePath: resCompress.tempFilePath,
              success: (resFileInfo) => {
                if (resFileInfo.size > 1024 * 1024) {
                  //压缩后大于1M就继续压缩
                  count++;
                  recursionCompressWechat(resCompress.tempFilePath, count, isReturnBase64, callback);
                  return;
                } else {
                  if (isReturnBase64) {
                    WechatTobase4(resCompress.tempFilePath)
                  } else {
                    callback && callback(resCompress.tempFilePath)
                  }
                }
              },
            });
          },
          fail: (resCompress) => {
            callback(url);
          },
        })
    },
    afterRead1(event){
            console.log(event)
            // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
            let fileListLen = this[`fileList${event.name}`].length
            this[`fileList${event.name}`].push({
              file:event.file,
              status: 'uploading',
              message: '上传中'
            })
          let url = "data:image/jpeg;base64," + uni.getFileSystemManager().readFileSync(event.file.url, "base64");
          proUserUp({type:0,img:url}).then(res=>{
            this.from.company_lintel = res.data.url
            this[`fileList${event.name}`].splice(fileListLen, 1)
            this[`fileList${event.name}`].push({
                status: 'success',
                message: '',
                url: res.data.url
            })
          })
          
        },
    afterRead2(event){
       // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
       let fileListLen = this[`fileList${event.name}`].length
       this[`fileList${event.name}`].push({
              file:event.file,
              status: 'uploading',
              message: '上传中'
            })
          let url = "data:image/jpeg;base64," + uni.getFileSystemManager().readFileSync(event.file.url, "base64");
          proUserUp({type:0,img:url}).then(res=>{
            this.from.business_card = res.data.url
            this[`fileList${event.name}`].splice(fileListLen, 1)
            this[`fileList${event.name}`].push({
                status: 'success',
                message: '',
                url: res.data.url
            })
          })
          },
    deletePic(event) {
        this[`fileList${event.name}`].splice(event.index, 1)
		},
    //省市区多列选择器
    changeHandler(e) {
      const {
        columnIndex,
        value,
        values,
        index,
        indexs,
        picker = this.$refs.uPicker,
      } = e;
      // 改变第一项
      if (columnIndex === 0) {
        let items = this.areaList[index].child.map((e) => {
          return e;
        });
        picker.setColumnValues(1, items);
        items = this.areaList[index].child[0].child.map((e) => {
          return e;
        });
        picker.setColumnValues(2, items);
      }
      // 改变第二项
      if (columnIndex === 1) {
        let items = this.areaList[indexs[0]].child[index].child.map((e) => {
          return e;
        });
        picker.setColumnValues(2, items);
      }
    },
    //省市区提交
    confirm(e) {
      this.locationText = "";
      for (let i = 0; i < e.value.length; i++) {
        this.locationText = this.locationText + " " + e.value[i].name;
      }
      this.from["area_code"] = e.value[e.value.length - 1].code;
      this.show = false;
    },
    //国家选择器提交
    confirmCoun(e) {
      console.log(e.value);
      this.countryText = e.value[0].cn_name;
      this.from["country"] = e.value[0].id;
      this.showC = false;
    },
    checkboxChange(e) {},
    back() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
    submit() {
      uni.showLoading({
        title: "加载中",
      });
      if (uni.getStorageSync("team_id")) {
        this.from["enroll_team_id"] = uni.getStorageSync("team_id");
      }
      this.from.exhibit_id = uni.getStorageSync("exhibit_id");
      this.from.openid = uni.getStorageSync("openid");
      addTicket(this.from).then((res) => {
        if (res.code == 0) {
          uni.hideLoading();
          uni.showToast({
            title:res.msg,
            icon:'none',
          })
          return;
        }else if(res.code == 1){
          if(uni.getStorageSync("team_id")){
            uni.removeStorageSync("team_id");
            uni.removeStorageSync('toexinfo')
            uni.hideLoading();
          }
          if(res.data.url){
            uni.setStorageSync('webviewUrl', res.data.url)
								uni.navigateTo({
									url: "/pages_index/webview/index"
							})
          }else if(res.data.act == 1){
            uni.navigateTo({
              url:'/pages_index/pay/list'
            })
          }else if(res.data.pay == 1){
            uni.navigateTo({
              url:'/pages_index/pay/index'
            })
          }else if(uni.getStorageSync("self_write_off")){
            verifyTicketBySelf({exhibit_id:uni.getStorageSync('exhibit_id')}).then(((res)=>{
                uni.removeStorageSync('self_write_off')
                uni.switchTab({ url: '/pages/center/index' })
            }))
          }
      }
      }).catch();
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

.title {
  margin: 32rpx 0;
  text-align: center;
  font-size: 32rpx;
  width: 750rpx;
}

.headerImg {
  width: 750rpx;
  height: 532rpx;
}

.from {
  margin: 32rpx;
  padding: 32rpx;
  background: #fff;
  border-radius: 20rpx;

  .fromTitle {
    font-size: 32rpx;
  }

  .hint {
    color: rgb(153, 153, 153);
    font-size: 20rpx;
  }
}
::v-deep .u-radio-group--row{
  flex-wrap: wrap;
}
::v-deep .u-radio__icon-wrap{
  width: 24rpx!important;
  height: 24rpx!important;
}
.subBtn {
  width: 360rpx;
  text-align: center;
  margin: 40rpx auto;
  padding: 16rpx 0;
  color: rgb(255, 255, 255);
  font-size: 36rpx;
  border-radius: 50px;
}
::v-deep .u-upload__button{
        .u-icon{
            text{
                font-size: 40rpx !important;
            }
        }
    }
    ::v-deep .u-upload__deletable__icon{
        .u-icon{
            text{
                font-size: 24rpx !important;
                top: 3rpx !important;
                right: 3rpx !important;
            }
        }
    }
</style>