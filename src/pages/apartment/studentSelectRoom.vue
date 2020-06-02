<template>
  <div id="student-select-room">
    <div class="select-room-head">
      <label class="head-title">学生选房</label>
    </div>
    <div class="operating-area">
      <div class="pull-left">
        <div class="form-group">
          <label class="input-label form-label">可选范围</label>
          <v-select
            class="btn-block form-select-style building-select-style"
            :value="select.defaultValue.buildingId"
            :options="select.options.building"
            optionsLabel="name"
            optionsValue="buildingId"
            @afterSelected="_buildingSelected"
            :disabled="isSelectedRoom"
            search
            :multiple="false">
          </v-select>
        </div>
        <div class="form-group">
          <label class="input-label form-label">楼层</label>
          <v-select
            class="btn-block form-select-style floors-select-style"
            :value="select.defaultValue.floorId"
            :options="select.options.floors"
            optionsLabel="label"
            optionsValue="value"
            @afterSelected="_floorsSelected"
            :disabled="isSelectedRoom"
            search
            :multiple="false">
          </v-select>
        </div>
      </div>
      <div class="pull-right" v-if="!isSelectedRoom">
        <button type="button" class="btn cancel-btn sumbit-btn" @click="sumbitSelect">提交</button>
      </div>
    </div>
    <div class="select-room-content" v-if="!isSelectedRoom">
      <GeminiScrollbar :scrollX="false">
        <div class="tips">使用说明：点击空床可选择床位，选床后点击姓名右侧删除按钮可取消选择，最后请点击提交按钮，提交后才算选房成功。</div>
        <div class="room-list" v-if="roomDataSetting.roomList.length > 0">
          <div class="room-member-container" v-for="(roomCell, rcIndex) in roomDataSetting.roomList" :key="rcIndex">
            <div class="room-card">
              <div class="room-card-head">{{roomCell.roomNo}}</div>
              <div class="room-card-body">
                <div
                  class="user-name" 
                  v-for="(bedCell, bcIndex) in roomCell.beds" 
                  :key="bcIndex" 
                  v-if="bedCell.user" 
                  @mouseover="_showInfoBox(roomCell, bedCell)" 
                  @mouseout="_hideInfoBox(roomCell)">{{bedCell.user.name}}</div>
                <div class="select-bed" :class="bedCell.canSelect?'':'no-select'" v-else>
                  <div class="empty-bed" v-if="!bedCell.isSelected" @click="_selectBed(roomCell.roomId, bedCell)">空床</div>
                  <div v-else>
                    <span class="name">{{roomDataSetting.selectBed.userName}}</span>
                    <i class="maticon pull-right" v-html="icons('clear')" @click="_cancelSelected(bedCell)">clear</i>
                  </div>
                </div>
              </div>
            </div>
            <div class="member-info-box" @mouseover="_showInfoBox(roomCell)" @mouseout="_hideInfoBox(roomCell)" v-show="roomCell.isShowInfo">
              <div class="originPlace" v-if="roomDataSetting.selectUserInfo.originPlace" :title="roomDataSetting.selectUserInfo.originPlace">{{roomDataSetting.selectUserInfo.originPlace}}</div>
              <div v-if="roomDataSetting.selectUserInfo.department" :title="roomDataSetting.selectUserInfo.department">{{roomDataSetting.selectUserInfo.department}}</div>
              <div :title="roomDataSetting.selectUserInfo.grade+'级'+roomDataSetting.selectUserInfo.collegeShortName+roomDataSetting.selectUserInfo.educationLevel">{{roomDataSetting.selectUserInfo.grade}}级{{roomDataSetting.selectUserInfo.collegeShortName}}{{roomDataSetting.selectUserInfo.educationLevel}}</div>
              <div v-if="roomDataSetting.selectUserInfo.timeTable" :title="roomDataSetting.selectUserInfo.timeTable">{{roomDataSetting.selectUserInfo.timeTable}}</div>
              <div v-if="roomDataSetting.selectUserInfo.airConditioningTemperature" :title="roomDataSetting.selectUserInfo.airConditioningTemperature+'℃'">{{roomDataSetting.selectUserInfo.airConditioningTemperature}}℃</div> 
            </div>
          </div>
        </div>
        <div class="text-center" v-else>暂无数据</div>
      </GeminiScrollbar>
    </div>
    <div class="select-room-content selected-room-tips" v-else>{{curSelectedRoom}}</div>
  </div>
</template>
<script>
import Vue from 'vue'
import { translation, sAjax, createTime } from '../../assets/utils/utils.js'
export default {
  props: {
    account: {
      default: null
    }
  },
  data: function () {
    return {
      select: {
        options: {
          building: [],
          floors: []
        },
        defaultValue: {
          buildingId: '',
          floorId: ''
        }
      },
      roomDataSetting: {
        curbedCell: null,
        roomList: [],
        isSelectedBed: false,
        selectUserInfo: {},
        selectBed: {
          userId: '',
          userName: '',
          campus: '',
          zoneId: '',
          buildingId: '',
          roomId: '',
          bedId: ''
        },
      },
      chnNumChar: ["零","一","二","三","四","五","六","七","八","九"],
      chnUnitChar: ["","十"],
      curSelectedRoom: '',
      isSelectedRoom: false
    }
  },
  computed: {
  },
  created: function () {
    sAjax({
      url: '/api/apartment/userChoose/applyStatus',
      type: 'get',
      success: (data) => {
        if (data.state) {
          if (data.data.batchCheckUserApplyStatus === 'CAN_NOT_APPLY' || data.data.batchCheckUserApplyStatus === 'HAD_APPLY') {
            this.isSelectedRoom = true
            var campusText = data.data.campus ? data.data.campus : ''
            this.curSelectedRoom = '您已成功选择' + campusText + data.data.zone + data.data.building + data.data.room + '房间' + data.data.bed + '床位'
          }
        } else {
          this.$toast(data.message)
        }
      }
    })
    sAjax({
      url: '/api/apartment/userChoose/buildings',
      type: 'get',
      success: (data) => {
        if (data.state) {
          this.select.options.building = data.data || []
        } else {
          this.$toast(data.message)
        }
      }
    })
    this.roomDataSetting.selectBed.userId = this.account.userId
    this.roomDataSetting.selectBed.userName = this.account.userName
  },
  methods: {
    _buildingSelected: function (obj) {
     this.select.defaultValue.buildingId = obj.value
     this.select.options.building.forEach((ele) => {
       if (ele.buildingId === obj.value) {
         this.roomDataSetting.selectBed.campus = ele.campus
         this.roomDataSetting.selectBed.zoneId = ele.zoneId
         this.select.options.floors.splice(0, this.select.options.floors.length)
         for (let i = 0; i < ele.floor; i++) {
          this.select.options.floors.push({
            value: (i + 1).toString(),
            label: this.sectionToChinese((i + 1)) + '楼'
          })
        }
       }
     })
    },
    _floorsSelected: function (obj) {
      this.select.defaultValue.floorId = obj.value
      if (obj.value) {
        this._getRoomData()
      }
    },
    _getRoomData: function () {
      sAjax({
        url: '/api/apartment/userChoose/list/rooms/' + this.select.defaultValue.buildingId + '/' + this.select.defaultValue.floorId,
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              for (var i in data.data) {
                if (!data.data[i]['isShowInfo']) {
                  this.$set(data.data[i], 'isShowInfo', false)
                }
                for (var j in data.data[i].beds) {
                  if (!data.data[i].beds[j]['isSelected']) {
                    this.$set(data.data[i].beds[j], 'isSelected', false)
                  }
                }
              }
              this.roomDataSetting.roomList = data.data
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    sumbitSelect: function (obj) {
      if (!this.roomDataSetting.isSelectedBed) {
        this.$toast('请先选择房间')
        return
      }
      if (confirm('确定要提交选房吗？提交后不可更改')) {
        sAjax({
          url: '/api/apartment/userChoose/selfChoose/' + this.roomDataSetting.selectBed.userId,
          dataType: 'json',
          type: 'post',
          data: this.roomDataSetting.selectBed,
          success: (data) => {
            if (data.state) {
              this.$toast('提交成功')
              this.isSelectedRoom = true
              this.roomDataSetting.isSelectedBed = true
            } else {
              this.$toast(data.message)
              this.roomDataSetting.isSelectedBed = false
              this.curbedCell.isSelected = false
              // this.roomDataSetting.selectBed = null
            }
          }
        })
      }
    },
    _showInfoBox: function (roomCell, bedCell) {
      roomCell.isShowInfo = true
      if (bedCell) {
        this.roomDataSetting.selectUserInfo = bedCell.user
      }
    },
    _hideInfoBox: function (roomCell) {
      roomCell.isShowInfo = false
    },
    _selectBed: function (roomId, bedCell) {
      if (this.roomDataSetting.isSelectedBed) {
        this.$toast('你已经选过房了')
        return
      }
      if (!bedCell.canSelect) {
        this.$toast('抱歉！该床位不能选')
        return
      }
      this.curbedCell = bedCell
      this.roomDataSetting.selectBed.buildingId = bedCell.buildingId
      this.roomDataSetting.selectBed.roomId = roomId
      this.roomDataSetting.selectBed.bedId = bedCell.bedId
      bedCell.isSelected = true
      this.roomDataSetting.isSelectedBed = true
    },
    _cancelSelected: function (bedCell) {
      this.roomDataSetting.selectBed.buildingId = ''
      this.roomDataSetting.selectBed.roomId = ''
      this.roomDataSetting.selectBed.bedId = ''
      bedCell.isSelected = false
      this.roomDataSetting.isSelectedBed = false
    },
    sectionToChinese: function (section) {
      var strIns = '', chnStr = ''
      var unitPos = 0
      var zero = true
      while(section > 0){
        var v = section % 10
        if(v === 0){
          if(!zero){
            zero = true
            chnStr = this.chnNumChar[v] + chnStr
          }
        }else{
          zero = false
          strIns = this.chnNumChar[v]
          strIns += this.chnUnitChar[unitPos]
          chnStr = strIns + chnStr
        }
        unitPos++
        section = Math.floor(section / 10)
      }
      return chnStr
    }
  }
}
</script>
<style lang="less">
  #student-select-room {
    height: 100%;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    position: relative;
    .select-room-head {
      height: 53px;
      border-bottom: 1px solid #f0f0f0;
      .head-title {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
        padding: 15px 38px;
      }
    }
    .operating-area {
      padding: 14px 38px;
      border-bottom: 1px solid #F0F0F0;
      height: 63px;
      .form-group {
        display: inline-block;
        .building-select-style {
          width: 160px;
          margin-right: 30px;
        }
        .floors-select-style {
          width: 80px;
        }
        .form-label {
          margin-right: 6px;
          font-size: 14px;
          color: #333333;
        }
      } 
      .sumbit-btn {
        background: #298df7;
        box-shadow: 0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.12);
        border-radius: 3px;
        font-size: 13px;
        color: #FFFFFF;
        padding: 9px 27px;
      }
    }
    .select-room-content {
      position: absolute;
      top: 115px;
      left: 0;
      right: 0;
      bottom: 0;
      &.selected-room-tips {
        text-align: center;
        margin-top: 30px;
      }
      .tips {
        font-size: 13px;
        color: #666666;
        padding: 16px 0 21px 38px;
      }
      .room-list {
        padding: 0 74px;
        .room-member-container {
          position: relative;
          display: inline-block;
          .room-card {
            width: 104px;
            height: 153px;
            display: inline-block;
            margin-right: 7px;
            margin-bottom: 10px;
            .room-card-head {
              width: 104px;
              height: 30px;
              border: 1px solid #D7DEED;
              font-size: 14px;
              color: #298df7;
              line-height: 16px;
              padding: 6px 0 0 10px;
            }
            .room-card-body {
              width: 104px;
              height: 123px;
              border: 1px solid #F0F0F0;
              border-top: 0;
              overflow-x: hidden;
              overflow-y: scroll;
              padding-top: 3px;
              &::-webkit-scrollbar {
                display: none;
              }
              .user-name {
                font-size: 13px;
                color: #4E4F54;
                padding: 1px 9px;
                letter-spacing: 1.13px;
                margin-bottom: 7px;
                &:hover {
                  background: #e5e7f8;
                }
              }
              .select-bed {
                background: #298df7;
                border-radius: 3px;
                font-size: 12px;
                color: #FFFFFF;
                line-height: 16px;
                text-align: center;
                letter-spacing: 5.54px;
                padding: 4px 0;
                margin: 0 4px 9px 4px;
                &.no-select {
                  background: #f5f5f5;
                  color: #bfbfbf;
                  .empty-bed {
                    cursor: not-allowed;
                  }
                }
                .empty-bed {
                  cursor: pointer;
                }
                .name {
                  margin-left: 14px;
                }
                i {
                  cursor: pointer;
                  font-size: 12px;
                }
              }
            }
          }
          .member-info-box {
            background: #298df7;
            border-radius: 3px;
            width: 108px;
            height: 119px;
            position: absolute;
            z-index: 100;
            top: 36px;
            right: -80px;
            padding: 0 4px;
            div {
              font-size: 12px;
              color: #FFFFFF;
              line-height: 14px;
              padding: 4px 5px;
              &.originPlace {
                font-size: 13px;
                color: #FFFFFF;
                line-height: 16px;
                border-bottom: 1px solid #ffffff;
                padding: 6px 5px;
              }
            }
          }
        }
      }
    }
  }
</style>


