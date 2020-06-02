<template>
  <div id="college-allocated-page" class="college-allocated-page container-fluid">
    <label
      id="shadow"
      v-show="pageStatus.draggingMember"
    >{{pageStatus.draggingMember?pageStatus.draggingMember.name:''}}</label>
    <div
      id="shadowCondition"
      v-show="pageStatus.conditionDraggingItem"
    >{{pageStatus.conditionDraggingItem?pageStatus.conditionDraggingItem.name:''}}</div>
    <div
      class="member-info-cover"
      @click="pageStatus.curMember = null"
      v-show="pageStatus.curMember"
    >
      <div id="memberInfo" class="member-info" @click.stop="">
        <div v-if="pageStatus.curMember">
          <label
            :title="pageStatus.curMember[item.id]"
            v-for="(item, i) in dataSetting.memberInfoData"
            :key="i"
            v-if="item.id !== 'address'"
          >{{pageStatus.curMember[item.id]}}</label>
          <label
            :title="pageStatus.curMember.bed?`${pageStatus.curMember.bed.buildingName}-${pageStatus.curMember.bed.roomName}`:''"
            v-else
          >{{pageStatus.curMember.bed?`${pageStatus.curMember.bed.buildingName}-${pageStatus.curMember.bed.roomName}`:''}}</label>
        </div>
      </div>
    </div>
    <div class="row college-allocated-header">
      <div class="header-title pull-left">
        <i class="maticon pull-left" v-html="icons('arrow_back')" @click="_back"></i>
        <span>新生住宿分配</span>
        <span class="tip" :class="{error: pageStatus.tipError}">{{pageStatus.tip}}</span>
      </div>
      <div class="header-options pull-right">
        <div class="option export" @click="_export">
          <i class="maticon pull-left" v-html="icons('archive')"></i>
          <span>导出excel</span>
        </div>
        <div class="option save" :class="{
          active: hasChange
        }" @click="_save()">
          <i class="maticon pull-left" v-html="icons('save')"></i>
          <span>保存</span>
        </div>
      </div>
    </div>
    <div class="row college-allocated-content">
      <div class="col-md-10 left-side">
        <div class="pull-left sex-switcher">
          <span
            :class="{
              active: pageStatus.sex === sexItem.id
            }"
            v-for="(sexItem, si) in dataSetting.sexData"
            :key="si"
            @click="_exchangeSex(sexItem.id)"
          >{{sexItem.name}}</span>
        </div>
        <div class="building-container">
          <div class="building-wrapper">
            <div class="building-header">
              <v-select
                v-model="pageStatus.curBuildingId"
                :options="dataSetting.buildingData"
                :required="true"
                :autoSelect="true"
                optionsLabel="name"
                optionsValue="id"
                @afterSelected="_buildingSelected"
                search
              ></v-select>
              <div class="floors-container pull-right" v-if="curBuilding">
                <span
                  class="floor-switcher pre"
                  @click="_exchangeFloorPage(pageStatus.floorPage-1)"
                  v-if="pageStatus.floorPage > 0"
                >
                  <i class="maticon pull-left" v-html="icons('chevron_left')"></i>
                </span>
                <span
                  class="floor-switcher next"
                  @click="_exchangeFloorPage(pageStatus.floorPage+1)"
                  v-if="(pageStatus.floorPage+1) * pageStatus.floorSize <= curBuilding.floors.length"
                >
                  <i class="maticon pull-left" v-html="icons('chevron_right')"></i>
                </span>
                <div class="floors-list">
                  <div
                    class="floors-scroller"
                    :style="{
                    left: (- pageStatus.floorPage * pageStatus.floorSize * pageStatus.floorWidth + 20) + 'px'
                  }"
                  >
                    <div
                      class="floor-item"
                      :class="{
                        active: fItem.id === pageStatus.floorId
                      }"
                      v-for="(fItem, fi) in curBuilding.floors"
                      :key="fi"
                      @click="_exchangeFloorIndex(fItem)"
                    >{{fItem.name}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rooms-container" v-if="curFloor">
              <GeminiScrollbar :scrollX="false">
                <div class="rooms-list">
                  <div class="room-item" :class="{'room-drop': pageStatus.isDragging, 'room-full': _isFull(room)}" v-for="(room,ri) in curFloor.rooms" :key="ri">
                    <label class="room-name" :title="room.buildingName + '-' + room.name" @mouseenter="_mouseEnter($event, room, 'room')">
                      {{room.name}}
                      <i
                        class="maticon pull-right"
                        v-html="icons('arrow_downward')"
                        @click="_addToOperating(room)"
                        v-if="!pageStatus.isDragging"
                      ></i>
                    </label>
                    <div class="beds-container">
                      <div class="bed-item "
                        :class="{
                          drop:pageStatus.isDragging
                        }"
                        @mouseenter="_mouseEnter($event, bed)"
                        @mouseleave="_mouseLeave"
                        v-for="(bed, bi) in room.beds"
                        :key="bi"
                        v-if="!bed.student">
                        <span class="pull-left">{{bed.name}}</span>
                        <label
                          :title="studentBedJson[bed.id].name"
                          @mousedown="_memberMouseDown($event, studentBedJson[bed.id])"
                          v-if="studentBedJson[bed.id]"
                        >{{studentBedJson[bed.id].name}}</label>
                        <i
                          class="maticon pull-right"
                          v-html="icons('more_vert')"
                          @click="_showMessage($event,studentBedJson[bed.id])"
                          v-if="studentBedJson[bed.id] && !pageStatus.isDragging"
                        ></i>
                      </div>
                      <div class="bed-item disabled" v-else>
                        <span class="pull-left">{{bed.name}}</span>
                        <label
                          :title="bed.student.name"
                        >{{bed.student.name}}</label>
                        <i
                          class="maticon pull-right"
                          v-html="icons('more_vert')"
                          @click="_showMessage($event,bed.student)"
                          v-if="!pageStatus.isDragging"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </GeminiScrollbar>
            </div>
          </div>
        </div>
        <div class="history-container">
          <div class="history-wrapper">
            <div class="history-header">
              <label>操作区</label>
              <span>此区域方便您在这里直接进行拖拽。您可以点击上方宿舍右上角的按钮将其取下来，也可以将已满的宿舍移除操作区。</span>
            </div>
            <div class="history-content">
              <GeminiScrollbar :scrollY="false">
                <div class="rooms-list">
                  <div class="room-item" :class="{'room-drop': pageStatus.isDragging, 'room-full': _isFull(room)}" v-for="(room,ri) in dataSetting.operatingRooms" :key="ri">
                    <label class="room-name" :title="room.buildingName + '-' + room.name"
                    @mouseenter="_mouseEnter($event, room, 'room')">
                      {{room.name}}
                      <i
                        class="maticon pull-right"
                        v-html="icons('clear')"
                        @click="_removeFromOperating(ri)"
                        v-if="!pageStatus.isDragging"
                      ></i>
                    </label>
                    <div class="beds-container">
                      <div
                        class="bed-item"
                        :class="{
                          drop:pageStatus.isDragging
                        }"
                        @mouseenter="_mouseEnter($event, bed)"
                        @mouseleave="_mouseLeave"
                        v-for="(bed, bi) in room.beds"
                        :key="bi"
                        v-if="!bed.student"
                      >
                        <span class="pull-left">{{bed.name}}</span>
                        <label class="pull-left"
                          :title="studentBedJson[bed.id].name"
                          @mousedown="_memberMouseDown($event, studentBedJson[bed.id])"
                          v-if="studentBedJson[bed.id]"
                        >{{studentBedJson[bed.id].name}}</label>
                        <i
                          class="maticon pull-left"
                          v-html="icons('more_vert')"
                          @click="_showMessage($event,studentBedJson[bed.id])"
                          v-if="studentBedJson[bed.id] && !pageStatus.isDragging"
                        ></i>
                      </div>
                      <div class="bed-item" v-else>
                        <span class="pull-left">{{bed.name}}</span>
                        <label
                          :title="bed.student.name"
                        >{{bed.student.name}}</label>
                        <i
                          class="maticon pull-right"
                          v-html="icons('more_vert')"
                          @click="_showMessage($event,bed.student)"
                          v-if="!pageStatus.isDragging"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </GeminiScrollbar>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-2 right-side">
        <div class="pull-right options">
          <span :class="{disabled: !pageHistory[0]}" title="撤回" @click="_goBack">
            <i class="maticon pull-left" v-html="icons('undo')"></i>
          </span>
          <span :class="{disabled: !pageHistory[0]}" title="重置" @click="_reset">
            <i class="maticon pull-left" v-html="icons('delete_sweep')"></i>
          </span>
        </div>
        <div class="members-container">
          <div class="members-wrapper">
            <div class="members-header">
              <label>
                学生列表({{dataSetting.studentData.length}})
                <i
                  class="maticon pull-right"
                  v-html="icons('search')"
                  @click="pageStatus.searching = true"
                ></i>
              </label>
              <div class="members-search" :style="{top: pageStatus.searching?'0':'-56px'}">
                <input type="text" placeholder="请输入姓名或学号" v-model="pageStatus.keyword">
                <i
                  class="maticon pull-right"
                  v-html="icons('clear')"
                  @click="pageStatus.searching = false;pageStatus.keyword=''"
                ></i>
              </div>
            </div>
            <div class="members-options">
              <a class="btn" @click="pageStatus.autoDivideShow = true">智能分配</a>
              <a class="btn" @click="_startDivide('number')">按学号分配</a>
            </div>
            <div class="members-conditions" v-show="pageStatus.autoDivideShow">
              <div class="condition-bar">
                <label class="condition-title">
                  分配优先级
                  <span>仅分配还没有房间的学生</span>
                </label>
              </div>
              <div class="condition-list" :class="{
                drop: pageStatus.conditionDragging
              }">
                <div
                  class="condition-item"
                  :class="{
                    disabled: !con.show
                  }"
                  v-for="(con, ci) in dataSetting.conditionsData"
                  :key="ci"
                  @mouseenter="_conditionMouseEnter($event, ci)"
                  @mouseleave="_conditionMouseLeave"
                  v-show="!(pageStatus.conditionDraggingItem&&pageStatus.conditionDraggingItem.id === con.id)"
                >
                  <v-select
                    v-model="con.rule"
                    :options="dataSetting.conditionOptions"
                    :required="true"
                    :disabled="!con.show"
                    optionsLabel="name"
                    optionsValue="id"
                    v-show="con.show"
                  ></v-select>
                  <label class="condition-item-name">{{con.name}}</label>
                  <div class="condition-switcher pull-right">
                    <div class="condition-switcher-wrapper" @click="con.show = !con.show">
                      <span :class="{active: con.show}"></span>
                    </div>
                  </div>
                  <i class="maticon pull-right condition-item-icon" v-html="icons('import_export')" @mousedown="_conditionMouseDown($event, con)"></i>
                </div>
              </div>
              <div class="condition-bar text-right">
                <span class="opt condition-cancel" @click="pageStatus.autoDivideShow = false">取消</span>
                <span class="opt condition-divide" @click="_startDivide('auto')">分配</span>
              </div>
            </div>
            <div class="members-list-container">
              <GeminiScrollbar :scrollX="false">
                <div class="members-list">
                  <div
                    class="members-list-item"
                    :class="{
                      drop:pageStatus.isDragging
                    }"
                    v-for="(student, si) in dataSetting.studentData"
                    :key="si"
                    v-if="(!pageStatus.showUndivide) || (pageStatus.showUndivide&&(!student.bed)) && (student.name.indexOf(pageStatus.keyword)>=0 || student.userNo.indexOf(pageStatus.keyword)>=0)"
                  >
                    <p
                      class="pull-left"
                      @mouseenter="_mouseEnter($event, student, 'member')"
                      @mouseleave="_mouseLeave"
                    >
                      <label @mousedown="_memberMouseDown($event, student)">{{student.name}}</label>
                      <i
                        class="maticon pull-right"
                        v-html="icons('more_vert')"
                        @click="_showMessage($event,student)"
                        v-if="!pageStatus.isDragging"
                      ></i>
                    </p>
                    <span v-if="student.bed">{{student.bed.buildingName}}-{{student.bed.roomName}}</span>
                  </div>
                </div>
              </GeminiScrollbar>
            </div>
            <div
              class="clear-area"
              :class="{active: pageStatus.isDragging}"
              @mouseenter="_mouseEnter($event, {}, 'clear')"
              @mouseleave="_mouseLeave"
            >清除分配信息</div>
            <div
              class="member-check"
              :class="{
                active: pageStatus.showUndivide
              }">
              <i
                class="maticon pull-left"
                v-html="icons(pageStatus.showUndivide?'check_box':'check_box_outline_blank')"
                @click="pageStatus.showUndivide = !pageStatus.showUndivide"
              ></i>
              <span>仅显示尚未分配的学生</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { sAjax, translation, createTime} from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: null
      },
      id: {
        default: 1
      },
      college: {
        default: ''
      },
      department: {
        default: ''
      },
    },
    data: function () {
      return {
        dataSetting: {
          sexData: [{
            id: '1',
            name: '男生'
          }, {
            id: '2',
            name: '女生'
          }],
          memberInfoData: [{
            id: 'name',
            name: '姓名'
          }, {
            id: 'province',
            name: '省份'
          }, {
            id: 'major',
            name: '专业'
          }, {
            id: 'templerature',
            name: '空调温度'
          }, {
            id: 'hoby',
            name: '习惯'
          }, {
            id: 'nation',
            name: '民族'
          }, {
            id: 'religion',
            name: '宗教信仰'
          }, {
            id: 'address',
            name: '地址'
          }],
          studentData: [],
          buildingData: [],
          operatingRooms: [],
          conditionsData: [{
            id: 'college',
            name: '系别',
            show: true,
            rule: '0'
          }, {
            id: 'schedule',
            name: '作息时间',
            show: true,
            rule: '0'
          }, {
            id: 'templerature',
            name: '空调温度',
            show: true,
            rule: '0'
          }, {
            id: 'province',
            name: '省份',
            show: true,
            rule: '0'
          },{
            id: 'college',
            name: '学院 ',
            show: true,
            rule: '0'
          },{
            id: 'major',
            name: '专业',
            show: true,
            rule: '0'
          },{
            id: 'class',
            name: '班级',
            show: true,
            rule: '0'
          },{
            id: 'grade',
            name: '年级',
            show: true,
            rule: '0'
          }],
          conditionOptions: [{
            id: '0',
            name: '相同'
          }, {
            id: '1',
            name: '不同'
          }]
        },
        pageStatus: {
          sex: '1',
          curBuildingId: '',
          floorId: '',
          floorPage: 0,
          floorSize: 7,
          floorWidth: 30,
          searching: false,
          keyword: '',
          autoDivideShow: false,
          showUndivide: false,

          draggingMember: null,
          dropMember: null,
          isDragging: false,

          curMember: null,
          messageBoxWidth: 108,
          messageBoxHeight: 185,
          position: {
            x: 20,
            y: 60
          },
          tipError: false,
          tip: '',

          conditionDragging: false,
          conditionDraggingItem: null,
          conditionDraggingIndex: -1,

          oldStudentStr: ''
        },
        pageHistory: [],
        historyIndex: [],
        canCancel: true
      }
    },
    computed: {
      curBuilding: function () {
        var building = null
        if (this.pageStatus.curBuildingId) {
          this.dataSetting.buildingData.forEach((b) => {
            if (b.id === this.pageStatus.curBuildingId) {
              building = b
            }
          })
        }
        return building
      },
      curFloor: function () {
        var floor = null
        if (this.curBuilding) {
          // this.pageStatus.floorId = this.pageStatus.floorId || this.curBuilding.floors[0].id
          this.curBuilding.floors.forEach((f) => {
            if (f.id === this.pageStatus.floorId) {
              floor = f
            }
          })
        }
        return floor
      },
      studentBedJson: function () {
        var j = {}
        this.dataSetting.studentData.forEach((stu) => {
          if (stu.bed) {
            j[stu.bed.id] = stu
          }
        })
        return j
      },
      studentWatch: function () {
        return JSON.parse(JSON.stringify(this.dataSetting.studentData))
      },
      buildingInfoWatch: function () {
        var str = this.pageStatus.curBuildingId?JSON.stringify({
          buildingId: this.pageStatus.curBuildingId,
          floorId: this.pageStatus.floorId
        }):''
        return str
      },
      hasChange: function () {
        return this.oldStudentStr !== JSON.stringify(this.dataSetting.studentData) && this.oldStudentStr
      }
    },
    methods: {
      _back: function () {
        this.$emit('back')
      },
      _save: function (cb) {
        sAjax({
          url: `/api/apartment/checkIn/teacherAllocation/saveAllocation`,
          type: 'post',
          data: {
            batchId: this.data.id,
            students: this.dataSetting.studentData,
            expectCheckInTime: this.data.expectCheckInTime,
            expectRetirementTime: this.data.expectRetirementTime
          },
          success: (data)=>{
            if(data.state) {
              if(!cb) {
                this.$toast('保存成功')
                this._back()
              }
            } else {
              this.$toast(data.message)
            }
          }
        }).always(()=>{
          if(cb) {
            cb()
          }
        })
      },
      _export: function () {
        window.open(`/downloads/apartment/checkIn/teacherAllocation/exportAllocation/${this.data.id}?college=${this.data.college}&department=${this.data.department}&gender=${this.pageStatus.sex}&expectCheckInTime=${this.data.expectCheckInTime}&expectRetirementTime=${this.data.expectRetirementTime}`) 
      },
      _reset: function () {
        if(!this.pageHistory[0]) {
          return
        }
        if (confirm('确定重置本次分配？')) {
          this.dataSetting.studentData = JSON.parse(this.oldStudentStr)
          this.$nextTick(()=>{
            this.pageHistory.splice(0, this.pageHistory.length)
          })
        }
      },
      _goBack: function () {
        var state = this.pageHistory[0]
        if(state) {
          this.canCancel = false
          if(state.type === 'data') {
            this.dataSetting.studentData = JSON.parse(state.data.data)
          } else if (state.type === 'building') {
            var info = JSON.parse(state.data.building)
            this.pageStatus.curBuildingId = info.buildingId
            this.pageStatus.floorId = info.floorId
          }
          this.pageHistory.splice(0, 1)
        } else {
          this.$toast('不能再撤销了!')
        }
      },
      _showMessage: function (e, member) {
        this.pageStatus.curMember = member
        var rect = document.getElementById('college-allocated-page').getBoundingClientRect()
        var msgDom = document.getElementById('memberInfo')
        var left = e.clientX - rect.x
        var top = e.clientY - rect.y
        if (e.clientX + this.pageStatus.messageBoxWidth > document.documentElement.clientWidth) {
          left = left - this.pageStatus.messageBoxWidth
        }
        if (e.clientY + this.pageStatus.messageBoxHeight > document.documentElement.clientHeight) {
          top = top - this.pageStatus.messageBoxHeight
        }
        msgDom.style.left = left + 'px'
        msgDom.style.top = top + 'px'
      },
      _buildingSelected: function (obj) {
        this.pageStatus.floorPage = 0
        this.dataSetting.buildingData.forEach((building)=>{
          if(building.id === obj.value) {
            var isIn = false
            building.floors.forEach((floor)=>{
              if(floor.id === this.pageStatus.floorId) {
                isIn = true
              }
            })
            if(!isIn) {
              this.pageStatus.floorId = building.floors[0] ? building.floors[0].id : ''
            }
          }
        })
      },
      _exchangeSex: function (sex) {
        if(sex === this.pageStatus.sex) {
          return
        }
        if(this.hasChange) {
          this._save(()=>{
            this.$toast('已为您成功保存当前性别分配记录！')
            this.pageStatus.sex = sex
            this._initData(sex)
          })
        } else {
          this.pageStatus.sex = sex
          this._initData(sex)
        }
        
      },
      _exchangeFloorPage: function (index) {
        if (index < 0 || index * this.pageStatus.floorSize > this.curBuilding.floors.length) {
          return
        }
        this.pageStatus.floorPage = index
      },
      _addToOperating: function (room) {
        var isIn = -1
        this.dataSetting.operatingRooms.forEach((r, i) => {
          if (r.id === room.id) {
            isIn = i
          }
        })
        if (isIn >= 0) {
          this.dataSetting.operatingRooms.splice(isIn, 1)
        }
        this.dataSetting.operatingRooms.splice(0, 0, room)
      },
      _removeFromOperating: function (index) {
        this.dataSetting.operatingRooms.splice(index, 1)
      },
      _exchangeFloorIndex: function (floor) {
        this.pageStatus.floorId = floor.id
      },
      _startDivide: function (type) {
        var param = {
          college: this.data.college,
          department: this.data.department,
          gender: this.pageStatus.sex
        }
        if (type === 'number') {
          sAjax({
            url: `/api/apartment/checkIn/teacherAllocation/allocateByUserNo/${this.data.id}`,
            type: 'get',
            data: param,
            success: (data) => {
              if(data.state) {
                this.dataSetting.studentData = data.data || []
              } else {
                this.$toast(data.message)
              }
            }
          })
        } else {
          param.conditions = []
          this.dataSetting.conditionsData.forEach((con)=>{
            if(con.show) {
              param.conditions.push(con)
            }
          })
          sAjax({
            url: `/api/apartment/checkIn/teacherAllocation/intelligentAllocation/${this.data.id}`,
            type: 'post',
            data: param,
            success: (data) => {
              if(data.state) {
                this.dataSetting.studentData = data.data || []
                this.pageStatus.autoDivideShow = false
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      },
      _mouseEnter: function (e, bedOrRoomOrMember, type) {
        if (this.pageStatus.isDragging) {
          if(type === 'room') {
            var found = false
            bedOrRoomOrMember.beds.forEach((bed)=>{
              if((!this.studentBedJson[bed.id]) && (!found)) {
                this.pageStatus.dropMember = bed
                found = true
              }
            })
            if(!this.pageStatus.dropMember) {
              this._setTip('房间已满，无法自动分配，若有必要，可与该房间学生交换！', true)
            } else {
              this._setTip('可被放置在:'+ this.pageStatus.dropMember.name)
            }
          } else if(type === 'member') {
            this.pageStatus.dropMember = bedOrRoomOrMember
            this._setTip('可与该学生交换床位！')
          } else if(type === 'clear') {
            this.pageStatus.dropMember = bedOrRoomOrMember
            this._setTip('将清除该同学床位信息！')
          } else {
            // 床位
            this.pageStatus.dropMember = this.studentBedJson[bedOrRoomOrMember.id] || bedOrRoomOrMember
            this._setTip(this.studentBedJson[bedOrRoomOrMember.id]?'可与该学生交换床位！':'该床位可分配')
          }
        }
      },
      _mouseLeave: function () {
        if (this.pageStatus.isDragging) {
          this.pageStatus.dropMember = null
        }
      },
      _memberMouseDown: function (e, student) {
        this.pageStatus.draggingMember = student
        this.pageStatus.isDragging = true
        var eDiv = document.getElementById('shadow')
        var page = document.getElementById('college-allocated-page').getBoundingClientRect()
        this.pageStatus.position.x = page.left + 20
        this.pageStatus.position.y = page.top - 10
        document.onmousemove = (e) => {
          if (this.pageStatus.isDragging) {
            eDiv.style.left = e.clientX - this.pageStatus.position.x + 'px'
            eDiv.style.top = e.clientY - this.pageStatus.position.y + 'px'
          }
        }
        document.onmouseup = this._memberMouseUp
      },
      _memberMouseUp: function (e) {
        document.mousemove = null
        document.mouseup = null
        // 学生交换床位
        // draggingMember 一定是学生  dropMember有可能是空床或者清除区
        if (this.pageStatus.draggingMember && this.pageStatus.dropMember) {
          var bedStamp = this.pageStatus.draggingMember.bed ? JSON.parse(JSON.stringify(this.pageStatus.draggingMember.bed)) : null
          if (this.pageStatus.dropMember.userId || this.pageStatus.dropMember.userNo) {
            this.$set(this.pageStatus.draggingMember, 'bed', this.pageStatus.dropMember.bed || null)
            this.$set(this.pageStatus.dropMember, 'bed', bedStamp)
          } else if (this.pageStatus.dropMember.buildingName || this.pageStatus.dropMember.roomName) {
            this.$set(this.pageStatus.draggingMember, 'bed', this.pageStatus.dropMember || null)
          } else {
            this.$set(this.pageStatus.draggingMember, 'bed', null)
          }
        }
        this.pageStatus.draggingMember = this.pageStatus.dropMember = null
        this.pageStatus.isDragging = false
        this._setTip()
      },
      _isFull: function (room) {
        var full = true
        room.beds.forEach((bed)=>{
          if(!this.studentBedJson[bed.id]) {
            full = false
          }
        })
        return full
      },
      _setTip: function (tip, error) {
        this.pageStatus.tipError = error
        this.pageStatus.tip = tip
      },
      _conditionMouseEnter: function (e, index) {
        if(this.pageStatus.conditionDragging) {
          this.pageStatus.conditionDraggingIndex = index 
        }
      },
      _conditionMouseLeave: function () {
        if(this.pageStatus.conditionDragging) {
          this.pageStatus.conditionDraggingIndex = -1
        }
      },
      _conditionMouseDown: function (e, condition) {
        this.pageStatus.conditionDragging = true
        this.pageStatus.conditionDraggingItem = condition
        var eDiv = document.getElementById('shadowCondition')
        var page = document.getElementById('college-allocated-page').getBoundingClientRect()
        this.pageStatus.position.x = page.left + 154
        this.pageStatus.position.y = page.top - 10
        document.onmousemove = (e) => {
          if (this.pageStatus.conditionDragging) {
            eDiv.style.left = e.clientX - this.pageStatus.position.x + 'px'
            eDiv.style.top = e.clientY - this.pageStatus.position.y + 'px'
          }
        }
        document.onmouseup = this._conditionMouseUp
      },
      _conditionMouseUp: function (e) {
        document.mousemove = null
        document.mouseup = null
        if(this.pageStatus.conditionDraggingIndex >= 0) {
          this.dataSetting.conditionsData.forEach((condition, i)=>{
            if(this.pageStatus.conditionDraggingItem.id === condition.id) {
              this.dataSetting.conditionsData.splice(i, 1)
            }
          })
          this.dataSetting.conditionsData.splice(this.pageStatus.conditionDraggingIndex,0,this.pageStatus.conditionDraggingItem)
        }

        this.pageStatus.conditionDragging = false
        this.pageStatus.conditionDraggingItem = null
        this.pageStatus.conditionDraggingIndex = -1
      },
      _initData: function (sex) {
        this.pageHistory = []
        this.dataSetting.operatingRooms = []
        this.$waiting.show()
        var success = 0
        var param = {
          college: this.data.college,
          department: this.data.department,
          gender: sex
        }
        sAjax({
          url: `/api/apartment/checkIn/teacherAllocation/buildingInformation/${this.data.id}`,
          type: 'get',
          data: param,
          success: (data)=>{
            if(data.state) {
              this.canCancel = false
              this.dataSetting.buildingData = data.data || []
              if( this.dataSetting.buildingData[0]) {
                this.pageStatus.curBuildingId = this.dataSetting.buildingData[0].id
                if(this.dataSetting.buildingData[0].floors[0]) {
                  this.pageStatus.floorId = this.dataSetting.buildingData[0].floors[0].id
                }
              }
            } else {
              this.$toast(data.message)
            }
          }
        }).always(()=>{
          success++
          if(success == 2) {
            this.$waiting.close()
          }
        })
        sAjax({
          url: `/api/apartment/checkIn/teacherAllocation/studentInformation/${this.data.id}`,
          type: 'get',
          data: param,
          success: (data)=>{
            if(data.state) {
              this.canCancel = false
              this.dataSetting.studentData = data.data || []
              this.oldStudentStr = JSON.stringify(this.dataSetting.studentData)
            } else {
              this.$toast(data.message)
            }
          }
        }).always(()=>{
          success++
          if(success == 2) {
            this.$waiting.close()
          }
        })


        // for (var i = 1; i <= 2; i++) {
        //   var building = {
        //     id: `${i}`,
        //     name: `海韵${i}`,
        //     floors: []
        //   }
        //   for (var j = 1; j <= (5 - i); j++) {
        //     var floor = {
        //       id: `${i}_${j}`,
        //       name: `${j}楼`,
        //       rooms: []
        //     }
        //     for (var k = 1; k <= 48; k++) {
        //       var room = {
        //         id: `${i}_${j}_${k}`,
        //         name: `${j < 10 ? ('0' + j) : j}${k < 10 ? ('0' + k) : k}`,
        //         maxNum: k % 3 * 2 + 2,
        //         buildingName: `海韵${i}`,
        //         beds: []
        //       }
        //       for (var l = 1; l <= room.maxNum; l++) {
        //         var bed = {
        //           id: `${i}_${j}_${k}_${l}`,
        //           name: `${l}床`,
        //           buildingName: `海韵${i}`,
        //           roomName: `${j < 10 ? ('0' + j) : j}${k < 10 ? ('0' + k) : k}`
        //         }
        //         if((i+j+k+l) === 8) {
        //           this.$set(bed, 'student', {
        //             // id: `${i}${j}${k}${l}`,
        //             name: `张${i}${j}${k}${l}`,
        //             userId: `${i}${j}${k}${l}`,
        //             userNo: '33333333',
        //             province: '福建省',
        //             department: '软件工程系',
        //             temperature: '空调16℃-23℃',
        //             hoby: '十二点前睡',
        //             nation: '汉族',
        //             religion: '无',
        //             bed: {
        //               id: `${i}_${j}_${k}_${l}`,
        //               roomName: `${j < 10 ? ('0' + j) : j}${k < 10 ? ('0' + k) : k}`,
        //               buildingName: `海韵${i}`,
        //             }
        //           })
        //         }

        //         this.dataSetting.studentData.push({
        //           // id: `${i}${j}${k}${l}`,
        //           name: `张${i}${j}${k}${l}`,
        //           userId: `${i}${j}${k}${l}`,
        //           userNo: '33333333',
        //           province: '福建省',
        //           department: '软件工程系',
        //           temperature: '空调16℃-23℃',
        //           hoby: '十二点前睡',
        //           nation: '汉族',
        //           religion: '无',
        //           bed: {
        //             id: `${i}_${j}_${k}_${l}`,
        //             roomName: `${j < 10 ? ('0' + j) : j}${k < 10 ? ('0' + k) : k}`,
        //             buildingName: `海韵${i}`,
        //           }
        //         })
        //         room.beds.push(bed)
        //       }
        //       floor.rooms.push(room)
        //     }
        //     building.floors.push(floor)
        //   }
        //   this.dataSetting.buildingData.push(building)
        // }
        
      }
    },
    created: function () {
      this._initData('1')
    },
    watch: {
      studentWatch: {
        deep: true,
        handler: function (n, o) {
          if(o.length > 0) {
            if(!this.canCancel) {
              this.canCancel = true
            } else {
              this.pageHistory.splice(0,0,{
                type: 'data',
                data: {
                  data: JSON.stringify(o)
                }
              })
            }
          }
        }
      },
      buildingInfoWatch: function (n, o) {
        if(o) {
          if(!this.canCancel) {
            this.canCancel = true
          } else {
            this.pageHistory.splice(0,0,{
              type: 'building',
              data: {
                building: o
              }
            })
          }
        }
      },
    }
  }
</script>
<style lang="less">
@hoverFontColor: #536dfe;
@containerBackground: #fdfdfd;
@roomWidth: 135px;
@roomHeight: 150px;
@windowScrollerWidth: 18px;
.college-allocated-page {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  min-width: 1060px;
  .college-allocated-header {
    height: 68px;
    padding: 12px 12px 12px 20px;
    .header-title {
      padding: 10px 0;
      span {
        margin-left: 32px;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.74);
        line-height: 26px;
        &.tip {
          color: green;
          font-size: 13px;
        }
        &.error{
          color: orangered;
        }
      }
      i {
        color: rgba(0, 0, 0, 0.74);
        cursor: pointer;
        transition: all 0.1s ease;
        &:hover {
          color: @hoverFontColor;
        }
      }
    }
    .header-options {
      .option {
        display: inline-block;
        width: 108px;
        height: 44px;
        cursor: pointer;
        span {
          margin-left: 10px;
          font-size: 16px;
          line-height: 44px;
        }
        i {
          line-height: 40px;
        }
        &.export {
          color: @hoverFontColor;
          transition: all 0.1s ease;
          &:hover {
            color: rgb(59, 80, 197);
          }
        }
        &.save {
          padding: 0 16px;
          margin-left: 8px;
          color: @hoverFontColor;
          border-radius: 100px;
          transition: all 0.1s ease;
          // span,
          // i {
          //   color: #fff;
          // }
          // &:hover {
          //   background: rgb(59, 80, 197);
          // }
          &.active{
            color: #FFF;
            background: @hoverFontColor;
            box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
            0 2px 2px 0 rgba(0, 0, 0, 0.12);
          }
        }
      }
    }
  }
  .college-allocated-content {
    position: absolute;
    left: 15px;
    right: 15px;
    top: 68px;
    bottom: 0;
    display: flex;
    overflow: hidden;
    .left-side {
      position: relative;
      padding: 0 76px;
      .sex-switcher {
        span {
          display: inline-block;
          width: 56px;
          margin-right: -12px;
          font-size: 14px;
          color: @hoverFontColor;
          line-height: 56px;
          text-align: center;
          cursor: pointer;
          &.active {
            color: #304ffe;
            border-radius: 100%;
            background: #e8eaf6;
          }
        }
      }
      .building-container {
        position: absolute;
        left: 76px;
        right: 76px;
        top: 62px;
        bottom: 252px;
        background: @containerBackground;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12),
          0 4px 4px 0 rgba(0, 0, 0, 0.12);
        .building-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .building-header {
          padding: 12px 8px;
          .v-select {
            .form-control {
              max-width: 300px;
              padding-right: 28px;
              border: none;
            }
          }
          .floors-container {
            position: relative;
            width: 350px;
            user-select: none;
            .floor-switcher {
              position: absolute;
              z-index: 2;
              width: 32px;
              height: 32px;
              padding: 0 4px;
              text-align: center;
              background: #ffffff;
              box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12),
                0 4px 4px 0 rgba(0, 0, 0, 0.12);
              border-radius: 100px;
              overflow: hidden;
              cursor: pointer;
              i {
                color: @hoverFontColor;
                line-height: 32px;
              }
              &.pre {
                left: -16px;
              }
              &.next {
                right: -16px;
              }
            }
            .floors-list {
              position: relative;
              width: 100%;
              height: 32px;
              overflow: hidden;
              .floors-scroller {
                position: absolute;
                left: 20px;
                top: 0;
                z-index: 1;
                width: auto;
                height: 32px;
                white-space: nowrap;
                overflow: hidden;
                transition: all 0.3s ease-in-out;
              }
              .floor-item {
                display: inline-block;
                padding: 0 10px;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.6);
                line-height: 28px;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                &.active,
                &:hover {
                  color: @hoverFontColor;
                  line-height: 28px;
                  border-bottom: 2px solid @hoverFontColor;
                }
              }
            }
          }
        }
        .rooms-container {
          position: absolute;
          top: 56px;
          left: 0;
          right: 0;
          bottom: 0;
          .rooms-list {
            padding: 14px;
          }
        }
      }
      .history-container {
        position: absolute;
        left: 76px;
        right: 76px;
        bottom: 0;
        height: 228px;
        background: @containerBackground;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12),
          0 4px 4px 0 rgba(0, 0, 0, 0.12);
        .history-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .history-header {
          padding: 21px 18px;
          line-height: 1;
          label {
            margin: 0 12px 0 0;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.66);
            letter-spacing: 0;
          }
          span {
            font-size: 13px;
            color: rgba(0, 0, 0, 0.6);
            letter-spacing: 0;
          }
        }
        .history-content {
          position: absolute;
          left: 0;
          right: 0;
          top: 56px;
          bottom: 0;
          .rooms-list {
            padding: 0 14px;
            white-space: nowrap;
          }
          .thumb {
            background-color: #333;
          }
        }
      }
      .room-item {
        position: relative;
        display: inline-block;
        width: @roomWidth;
        height: @roomHeight;
        margin: 0 10px 14px 0;
        padding: 6px 12px;
        background: #ffffff;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.06),
          0 2px 2px 0 rgba(0, 0, 0, 0.06);
        border-radius: 2px;
        user-select: none;
        overflow: hidden;
        &.room-full{
          &.room-drop:hover{
            outline: 2px solid orangered;
          }
        }
        &.room-drop:hover{
          outline: 2px solid @hoverFontColor;
          .room-name i{
            display: none;
          }
          .room-name:hover{
            color: @hoverFontColor;
            cursor: move;
          }
        }
        .room-name {
          display: block;
          margin: 0;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.7);
          letter-spacing: 0;
          line-height: 22px;
          i {
            display: none;
            font-size: 20px;
            color: rgba(0, 0, 0, 0.5);
            cursor: pointer;
            &:hover {
              color: @hoverFontColor;
            }
          }
          &:hover {
            i {
              display: inline-block;
            }
          }
        }
        .beds-container {
          position: absolute;
          left: 0;
          right: -@windowScrollerWidth;
          top: 30px;
          bottom: 0;
          padding: 4px 6px 0;
          overflow-y: scroll;
          .bed-item {
            position: relative;
            height: 26px;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            &.drop {
              background: lighten(@hoverFontColor, 32%);
              &:hover {
                background: @hoverFontColor;
                label,
                span {
                  color: #fff;
                }
              }
            }
            &.disabled{
              label,
              span {
                color: rgba(0, 0, 0, 0.27);
                cursor: not-allowed;
              }
              &:hover {
                label {
                  background: none;
                }
              }
            }
            label,
            span {
              display: inline-block;
              max-width: 65px;
              margin: 0;
              padding: 0 6px;
              font-size: 13px;
              color: rgba(0, 0, 0, 0.54);
              letter-spacing: 0;
              line-height: 26px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              cursor: move;
              transition: all 0.2s ease-in-out;
            }
            span {
              cursor: default;
            }
            i {
              display: none;
              margin-left: @roomWidth - 125px;
              font-size: 21px;
              color: #757575;
              &:hover {
                color: @hoverFontColor;
              }
            }
            &:hover {
              label {
                background: rgba(0, 0, 0, 0.08);
                border-radius: 4px;
              }
              i {
                display: inline-block;
              }
            }
            &.active {
              border: 2px solid @hoverFontColor;
              label {
                line-height: 22px;
              }
            }
          }
        }
      }
    }
    .right-side {
      position: relative;
      .options {
        position: absolute;
        right: 20px;
        top: 20px;
        width: 100px;
        text-align: right;
        transition: all 0.1s ease;
        span {
          display: inline-block;
          margin-left: 12px;
          overflow: hidden;
          cursor: pointer;
          &.disabled{
            cursor: default;
            i {
              color: #c2c2c2;
              &:hover {
                color: #c2c2c2;
              }
            }
          }
        }
        i {
          color: #616161;
          &:hover {
            color: @hoverFontColor;
          }
        }
      }
      .members-container {
        position: absolute;
        width: 250px;
        right: 0;
        top: 62px;
        bottom: 0;
        background: @containerBackground;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12),
          0 4px 4px 0 rgba(0, 0, 0, 0.12);
        user-select: none;
        .members-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .members-header {
          position: relative;
          height: 56px;
          overflow: hidden;
          label {
            display: block;
            padding: 0 18px;
            margin: 0;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.66);
            line-height: 56px;
          }
          i {
            font-size: 24px;
            color: #757575;
            line-height: 52px;
            cursor: pointer;
            &:hover {
              color: @hoverFontColor;
            }
          }
          .members-search {
            position: absolute;
            left: 0px;
            right: 0;
            top: -56px;
            height: 100%;
            padding: 0 18px;
            background: @containerBackground;
            transition: all 0.3s ease;
            input {
              display: inline-block;
              max-width: 206px;
              margin: 0;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.66);
              line-height: 56px;
              border: none;
              outline: none;
              box-shadow: none;
              background: @containerBackground;
            }
          }
        }
        .members-options {
          padding: 6px 12px;
          .btn {
            margin-right: 6px;
            font-size: 13px;
            color: #fcfcfc;
            line-height: 21px;
            background: @hoverFontColor;
            box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
              0 2px 2px 0 rgba(0, 0, 0, 0.12);
            border-radius: 2px;
            transition: all 0.1s ease;
            &:hover {
              background: darken(@hoverFontColor, 20%);
            }
          }
        }
        .members-conditions {
          position: absolute;
          left: 0;
          right: 0;
          top: 56px;
          padding: 0 18px;
          z-index: 2;
          background: @hoverFontColor;
          .condition-bar {
            .condition-title {
              margin: 0;
              font-size: 13px;
              color: #fcfcfc;
              line-height: 45px;
              span {
                margin-left: 2px;
                font-size: 12px;
                color: rgba(252, 252, 252, 0.7);
              }
            }
            .opt {
              margin-left: 18px;
              line-height: 45px;
              font-size: 13px;
              cursor: pointer;
              &.condition-cancel {
                color: rgba(252, 252, 252, 0.7);
              }
              &.condition-divide {
                color: #fcfcfc;
              }
              &:hover {
                text-decoration: underline;
              }
            }
          }
          .condition-list {
            background: @containerBackground;
            box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
              0 2px 2px 0 rgba(0, 0, 0, 0.12);
            border-radius: 2px;
            &.drop{
              .condition-item:hover{
                border-top: 2px solid @hoverFontColor;
              }
            }
            .condition-item {
              padding: 0 6px;
              border-bottom: 1px solid #e0e0e0;
              &.disabled {
                .condition-item-name,
                .v-select {
                  opacity: 0.3;
                }
                .condition-item-icon {
                  display: none;
                }
              }
              .condition-item-name {
                margin: 0;
                font-size: 13px;
                color: rgba(0, 0, 0, 0.64);
                line-height: 43px;
              }
              .condition-item-icon {
                font-size: 21px;
                color: rgba(0, 0, 0, 0.41);
                line-height: 43px;
                cursor: pointer;
                &:hover {
                  color: @hoverFontColor;
                }
              }
              .condition-switcher {
                width: 43px;
                height: 43px;
                padding: 12px 0;
                .condition-switcher-wrapper {
                  display: inline-block;
                  width: 100%;
                  height: 100%;
                  border-radius: 24px;
                  border: 1px solid #ececec;
                  cursor: pointer;
                  span {
                    display: inline-block;
                    width: 23px;
                    height: 23px;
                    margin-top: -3px;
                    margin-left: 20px;
                    border-radius: 100%;
                    background: orangered;
                    transition: all 0.3s ease;
                    &.active {
                      margin-left: 0;
                      background: @hoverFontColor;
                    }
                  }
                }
              }
              .form-control {
                padding-left: 24px;
                padding-right: 6px;
                border: none;
                transition: all 0.3s ease;
                .dropdown-icon {
                  left: 0;
                  right: auto;
                }
                &:hover {
                  background: #e0e0e0;
                }
              }
            }
          }
        }
        .members-list-container {
          position: absolute;
          left: 0;
          right: 0;
          top: 101px;
          bottom: 48px;
          z-index: 1;
          .members-list {
            padding: 20px;
            .members-list-item {
              line-height: 32px;
              overflow: hidden;
              &.drop {
                label {
                  &:hover {
                    color: #fff;
                    background: @hoverFontColor;
                    border-radius: 4px;
                  }
                }
              }
              p {
                margin: 0;
                &:hover {
                  i {
                    display: block;
                  }
                }
              }
              label {
                margin: 0;
                padding: 0 7px;
                font-size: 13px;
                color: rgba(0, 0, 0, 0.6);
                cursor: pointer;
                &:hover {
                  background: rgba(0, 0, 0, 0.08);
                  border-radius: 4px;
                }
              }
              span {
                margin-left: 3px;
                font-size: 13px;
                color: rgba(0, 0, 0, 0.4);
                letter-spacing: 0;
              }
              i {
                display: none;
                font-size: 21px;
                color: #757575;
                line-height: 30px;
                cursor: pointer;
                &:hover {
                  color: @hoverFontColor;
                }
              }
            }
          }
        }
        .clear-area {
          position: absolute;
          right: -150px;
          top: 140px;
          bottom: 135px;
          z-index: 2;
          width: 120px;
          padding: 10px 9px;
          font-size: 16px;
          line-height: 24px;
          color: #666;
          border: 2px solid #d9d9d9;
          border-radius: 4px;
          background: @containerBackground;
          transition: all 0.3s ease;
          &:hover {
            border: 2px solid @hoverFontColor;
          }
          &.active {
            right: 12px;
          }
        }
        .member-check {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 3;
          padding: 12px 16px;
          background: @containerBackground;
          border-top: 1px solid #e0e0e0;
          i {
            font-size: 21px;
            color: rgba(0, 0, 0, 0.5);
            cursor: pointer;
          }
          span {
            margin-left: 16px;
            font-size: 13px;
            line-height: 23px;
            color: rgba(0, 0, 0, 0.56);
          }
          &.active {
            i {
              color: @hoverFontColor;
            }
          }
        }
      }
    }
  }
  #shadow,#shadowCondition{
    position: absolute;
    z-index: 999;
    width: 62px;
    padding: 0 7px;
    margin: 0;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 32px;
    background: @containerBackground;
    border-radius: 4px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    opacity: 0.7;
  }
  #shadowCondition{
    width: 214px;
    line-height: 44px;
  }
  .member-info-cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
  .member-info {
    position: absolute;
    z-index: 999;
    width: 110px;
    padding: 10px 8px;
    background: #f5f5f5;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.18), 0 4px 4px 0 rgba(0, 0, 0, 0.18);
    border-radius: 2px;
    label {
      display: block;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
