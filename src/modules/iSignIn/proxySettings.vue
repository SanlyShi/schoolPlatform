<template>
  <div class="container-fluid" id="proxy-settings">
    <div class="head text-center">
      <div class="pull-left back-div"><i class="maticon" @click="_back" v-html="icons('arrow_back')">arrow_back</i></div>
      <div class="pull-right opt-div">
        <a href="javascript:;" class="opt-btn" @click="_back">取消</a>
        <button class="btn save" @click="_saveJoinSet">保存</button>
      </div>
    </div>
    <div class="loading-players loader" v-if="loading" v-html="loader.icon + '正在加载代理设置...'"></div>
    <div class="joinSet-content" v-else>
      <div class="info-container" :style="setColStyle">
        <div class="col other-col" v-for="(player, i) in players" :key="i">
          <div class="form-group">
            <i class="maticon pull-left app-icon black-color" v-html="icons('label')">label</i>
            <div class="form-group-input pull-left ">
              <label class="name-label light-black-color">名称</label>
              <i class="maticon pull-right more-icon black-color dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" v-html="icons('more_vert')">more_vert</i>
              <ul class="dropdown-menu more-opt-menu">
                <li @click="_deletePlayers(i)"><a href="#">删除</a></li>
              </ul>
              <input type="text" class="form-control name-input border-bottom-blue black-color" placeholder="请输入代理者名称" maxlength="15" v-model="player.name" @change="_changePlayerName(player)">
              <p class="name-error-tip text-center"  v-if="player.nameErrorMsg">{{player.nameErrorMsg}}</p>
            </div>
          </div>
          <div class="form-group">
            <i class="maticon pull-left app-icon black-color" v-html="icons('call_split')">call_split</i>
            <div class="form-group-input pull-left ">
              <label class="name-label light-black-color">代理权分配方式</label>
              <div class="distribution-select">
                <v-select
                ref="distributarySelect"
                :options="distributaryData"
                v-model="player.selectDistributary"
                options-value="id"
                options-label="name"
                :data-index="i"
                :required="true"
                :key="i"
                @afterSelected="_afterSelectedDistributary">
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-group clear-padding-bottom clear-bord-bottom" v-if="player.distributary !== 'byTeacher' && player.distributary != ''">
            <div class="role-set-head">
                <i class="maticon pull-left app-icon black-color" v-html="icons('people')">people</i>
                <div class="form-group-input pull-left " style="height:35px">
                  <label class="name-label light-black-color">角色设置</label>
                  <span class="creat-new-role blue-color" @click="_creatNewRole(player, i)" v-if="player.distributary !== 'byClass' && !player.roleEditing">创建新的角色</span>
                </div>
              </div>
          </div>
          <div class="scroll-area" :id="'scrollArea' + i" :data-id="i" :style="{height: player.distributary !== 'byTeacher' && player.distributary != '' ? scrollAreaHeight + 'px' : noRoleSetAfaterHeight + 'px'}">
            <div class="form-group clear-padding-bottom" v-if="player.distributary !== 'byTeacher' && player.distributary != ''">
              <div class="role-set-content" :id="'roleContent' + i" :style="'max-height:'+ roleSetContentHeight + 'px'">
                <div class="creat-role-input" v-if="player.roleEditing">
                  <input type="text" class="form-control name-input border-bottom-blue black-color padding-right-70px" maxlength="20" placeholder="请输入角色名称" v-model="player.newRoleName" v-focus>
                  <div class="pull-right creat-btn-group">
                    <button class="btn creat-cancle clearBtnBorder" @click="player.roleEditing = false">取消</button>
                    <button class="btn creat-sure blue-color clearBtnBorder" @click="_saveNewRole(player)">确定</button>
                  </div>
                  <p class="errorMsg" :class="{ show: player.roleAddErrorMsg }" v-if="player.roleEditing">{{player.roleAddErrorMsg}}</p>
                </div>
                <div class="role-list" :id="'roleList' + i">
                  <div class="role-list-item margin-bottom-5px">
                    <div class="margin-left-70px">
                      <div class="input-group">
                        <span @click="_batchChangeSelectedRoles(player)">
                          <i class="maticon role-icon light-black-color" v-html="icons('check_box_outline_blank')" v-if="player.roleCount === 0 ">check_box_outline_blank</i>
                          <i class="maticon role-icon light-black-color" v-html="icons('check_box')" v-else-if="player.roleCount === player.roleSetData.length">check_box</i>
                          <i class="maticon role-icon light-black-color" v-html="icons('indeterminate_check_box')" v-else>indeterminate_check_box</i>
                        </span>
                        <span class="role-name light-black-color" >全选</span>
                      </div>
                    </div>
                  </div>
                  <div class="role-list-item" v-for="(role, rIndex) in player.roleSetData" :key="rIndex">
                    <div class="margin-left-70px">
                      <div class="input-group">
                        <span @click="_addOrDeleteRoleToPlayer(role, player)">
                          <i class="maticon role-icon light-black-color" v-html="icons('check_box')" v-if="player.roles.indexOf(parseInt(role.id))>=0">check_box</i>
                          <i class="maticon role-icon light-black-color" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
                        </span>
                        <span class="role-name" :title="role.name" :class="player.roles.indexOf(parseInt(role.id))>=0?'black-color':'light-black-color'">{{role.name}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="add-role">
          <button class="add-btn clearBtnBorder" @click="_addPlayer">添加代理者</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import { translation, sAjax } from '../../assets/utils/utils.js'
  import backend from './backend'
import loader from './loader'

const distributaryLabels = {
  bySchool: '全校统一管理',
  byClass: '以班级分配',
  byTeacher: '以带生关系分配',
  byCollege: '以学院关系分配',
}

  export default {
    props: {
      projectId: Number,
      projectName: String,
      projectLevel:String
    },
    data: function () {
      return {
        loader: loader,
        departmentId: 1,
        positionLeft: null,
        players: [],
        distributaryData: [
          {
          id: 'bySchool',
          name: '全校统一管理'
        },
         {
          id: 'byClass',
          name: '以班级分配'
        }, {
          id: 'byTeacher',
          name: '以带生关系分配'
        }, {
          id: 'byCollege',
          name: '以学院关系分配'
        }],
        scrollAreaHeight: '',
        noRoleSetAfaterHeight: '',
        newAuthorityMaxHeight: '',
        roleSetContentHeight: '',
        hasError: true,
        loading: true,
        roleList: [],
        batchCheck: '',
        roleEditing: false,
        curNode: {
          distributary: '',
          operators: [],
          dataAuthorities: [{
            authority: null
          }]
        },
        curLink: {},
        otherLink: {
          nextNodeId: ''
        },
        curForm: {
          formSettingId: '',
          formSettingName: '',
        },
        isApplyNode: false,
        isChange: false,
        isSelectBatchSet: false,

        nameIsNull: true,

        ownerContentHeight: 0,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).joinRoleSetManage
      },
      setColStyle: function () {
        var colStyle = {}
        var that = this
        if (that.players.length <= 1) {
          colStyle = { 'text-align': 'center', 'padding-left': '105px' }
        } else {
          colStyle = { 'text-align': 'left', 'padding-left': '0' }
        }
        return colStyle
      }
    },
    watch: {
    },
    created: function () {
      if (!this.projectId) {
        return this.$toast('sorry, something went wrong! [110]');
      }
      if(this.projectLevel == "SCHOOL"){
  this.distributaryData = [
          {
          id: 'bySchool',
          name: '全校统一管理'
        },
         {
          id: 'byClass',
          name: '以班级分配'
        }, {
          id: 'byTeacher',
          name: '以带生关系分配'
        }, {
          id: 'byCollege',
          name: '以学院关系分配'
        }]
      }
      else if(this.projectLevel == "COLLEGE"){
this.distributaryData = [
         {
          id: 'byClass',
          name: '以班级分配'
        }, {
          id: 'byTeacher',
          name: '以带生关系分配'
        }]
      }
      var that = this
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      this.distributaryData.forEach((ele, index) => {
        ele.name = this.translate.distributaryData[ele.id]
      })
      backend.getProxySettings(this.projectId, (err, result) => {
        if (err) {
          return this.$toast('网络错误')
        }
        if (!result.state) {
          return this.$toast(result.message)
        }
        let distributaryChange = {
          'SCHOOL': 'bySchool',
          'COLLEGE': 'byCollege',
          'RELATIONSHIP': 'byTeacher',
          'CLASS': 'byClass'
        }
        this.players = result.data.map(proxy => {
          let player = this.getNewPlayerTemplate()
          player.id = proxy.projectAgentId
          player.name = proxy.agentName
          player.distributary = distributaryChange[proxy.powerModeOfDistribution]
          player.roles = proxy.agentRoleId
          player.roleCount = player.roles.length
          return player
        })

        for (let player of this.players) {
          this._initRoleList(player)
        }
        if (!this.players.length) {
          this._addPlayer()
        }
        this.loading = false
      })
    },
    mounted: function () {
      var that = this
      var timer = null
      // $(window).on('resize', function () {
      //   timer && clearTimeout(timer)
      //   timer = setTimeout(() => {
      //     if (!$('.col').length) {
      //       return;
      //     }
      //     var cardHeight = $('.col').height().toFixed(1)
      //     that.roleSetContentHeight = cardHeight - 268
      //     that.ownerContentHeight = cardHeight - 133
      //     that.scrollAreaHeight = cardHeight - 218
      //     that.noRoleSetAfaterHeight = cardHeight - 170
      //     that.newAuthorityMaxHeight = cardHeight - 83
      //   }, 300);
      // })
      // $(window).on('keydown', function (event) {
      //   if (event.ctrlKey == true && event.keyCode == 83) {
      //     that._saveJoinSet()
      //     that.$emit('back')
      //     event.preventDefault()
      //     return false
      //   }
      //   return true
      // })

    },
    methods: {
      getNewPlayerTemplate: function () {
        return {
          id: null,
          name: null,
          distributary: 'bySchool',
          selectDistributary: 'bySchool',
          roles: [],
          roleEditing: false,
          newRoleName: null,
          roleAddErrorMsg: null,
          nameErrorMsg: null,
          roleCount: 0,
          roleSetData: [],
          _id: 'player_' + (new Date()).getTime()
        }
      },
      _addPlayer: function () {
        if (this.players.length == 4) {
          return this.$toast('设置的代理已经包括所有的代理权分配方式，不可再新增')
        }
        let player = this.getNewPlayerTemplate()

        let existedDistributary = {
          'bySchool': false,
          'byCollege': false,
          'byTeacher': false,
          'byClass': false
        }
        for (let _player of this.players) {
          existedDistributary[_player.distributary] = true
        }
        let validDistributary = null
        for (let distributary in existedDistributary) {
          if (existedDistributary[distributary]) {
            continue
          }
          validDistributary = distributary
          break
        }
        player.distributary = validDistributary
        player.selectDistributary = validDistributary
        this.players.push(player)
        this._initRoleList(player, this.players.length - 1)
      },
      _changePlayerName: function (curPlayer) {
        let nameError = false
        for (let player of this.players) {
          if (player._id === curPlayer._id) {
            continue;
          }
          if (player.name === curPlayer.name) {
            curPlayer.nameErrorMsg = '该代理名称已存在'
            nameError = true
          }
        }
        if (!nameError) {
          curPlayer.nameErrorMsg = null
        }
      },
      _afterSelectedDistributary: function (obj) {
        var index = parseInt(obj.target.$attrs['data-index'])
        let player = this.players[index];

        if (player.distributary == obj.val) {
          return
        }

        let existed = false
        let existedPlayer = null
        for (let _player of this.players) {
          if (_player.distributary == obj.val) {
            existed = true
            existedPlayer = _player
          }
        }
        if (existed) {
          this.$toast('该代理分配方式已被代理(' + (existedPlayer.name || '该代理未设置名称') + ')占用')
          player.selectDistributary = player.distributary
          // this.$refs.distributarySelect[index].selectedItems = [{ id: player.distributary, name: distributaryLabels[player.distributary] }]
          return
        }
        player.roleEditing = false
        if (obj.val) {
          player.distributary = obj.val
          player.roles = []
          player.roleCount = 0
          this._initRoleList(player, index)
        } else {
          player.distributary = ''
        }
      },
      _initRoleList: function (player, index) {
        var that = this
        if (player.distributary === 'bySchool' || player.distributary === 'byCollege') {
          sAjax({
            url: '/api/approveRoles',
            type: 'get',
            data: {
              level: player.distributary === 'bySchool' ? 'SCHOOL' : 'COLLEGE',
              departmentId: this.departmentId
            },
            success: function (data) {
              if (data.state) {
                player.roleSetData = data.data.reverse()
                var timer = null
                timer && clearTimeout(timer)
                timer = setTimeout(() => {
                  var cardHeight = $(".col").height().toFixed(1)
                  that.roleSetContentHeight = cardHeight - 268
                  that.scrollAreaHeight = cardHeight - 218
                  that.noRoleSetAfaterHeight = cardHeight - 170
                  that.newAuthorityMaxHeight = cardHeight - 83
                }, 300)
              } else {
                that.$toast(data.message)
              }
            }
          })
        } else if (player.distributary === 'byClass') {
          sAjax({
            url: '/api/relClass/classCommittees',
            type: 'get',
            success: function (data) {
              if (data.state) {
                data.data.forEach((ele) => {
                  ele.name = ele.text
                })
                player.roleSetData = data.data.reverse()
                var timer = null
                timer && clearTimeout(timer)
                timer = setTimeout(() => {
                  var cardHeight = $(".col").height().toFixed(1)
                  that.roleSetContentHeight = cardHeight - 268
                  that.scrollAreaHeight = cardHeight - 218
                  that.noRoleSetAfaterHeight = cardHeight - 170
                  that.newAuthorityMaxHeight = cardHeight - 83
                }, 300)
              } else {
                alert(data.message)
              }
            }
          })
        }
      },
      _addOrDeleteRoleToPlayer: function (role, player) {
        var index = player.roles.indexOf(parseInt(role.id))
        if (index >= 0) {
          player.roles.splice(index, 1)
        } else {
          player.roles.push(parseInt(role.id))
        }
        this.countSelectedRoles(player)
      },
      _batchChangeSelectedRoles: function (player) {
        if (player.roleCount == player.roleSetData.length) {
          player.roleCount = 0
          player.roles = []
          return
        }
        player.roles = player.roleSetData.map(role => parseInt(role.id))
        player.roleCount = player.roleSetData.length
      },
      countSelectedRoles: function (player) {
        player.roleCount = 0
        player.roleSetData.forEach((role) => {
          if (player.roles.indexOf(parseInt(role.id)) >= 0) {
            player.roleCount++
          }
        })
        return player.roleCount
      },
      _creatNewRole: function (player, index) {
        player.roleEditing = true
        player.newRoleName = this.projectName + (player.distributary === 'bySchool' ? '校级' : '院级') + '管理员'
        $('#roleContent' + index).animate({ scrollTop: '0px' }, 300)
      },
      _saveNewRole: function (player) {
        var that = this
        let name = player.newRoleName
        player.roleAddErrorMsg = ''
        if (!name || name.replace(/\s/g, '') === '') {
          player.roleAddErrorMsg = '角色名不能为空'
        } else {
          player.roleSetData.forEach((role) => {
            if (name === role.name) {
              if (player.roleAddErrorMsg) {
                player.roleAddErrorMsg += ','
              }
              player.roleAddErrorMsg += '该角色已存在'
            }
          })
        }
        if (player.roleAddErrorMsg) {
          setTimeout(() => {
            player.roleAddErrorMsg = ''
          }, 1500)
        } else {
          sAjax({
            url: '/api/approveRoles',
            type: 'post',
            data: {
              name: name,
              level: player.distributary === 'bySchool' ? 'SCHOOL' : 'COLLEGE',
              departmentId: this.departmentId
            },
            success: function (data) {
              if (data.state) {
                player.roleSetData.unshift({
                  id: data.data,
                  name: name
                })
                player.roles.push(parseInt(data.data))
                player.roleEditing = false
              } else {
                that.$toast(data.message)
              }
            }
          })
        }
      },
      _back: function () {
        if (this.nameIsNull) {
          this.$emit('back')
        } else {
          return false
        }
      },
      _saveJoinSet: function () {
        let proxys = []
        let valid = true
        let message = ''
        let distributaryChange = {
          'bySchool': 'SCHOOL',
          'byCollege': 'COLLEGE',
          'byTeacher': 'RELATIONSHIP',
          'byClass': 'CLASS'
        }
        for (let player of this.players) {
          if (!player.name) {
            message += '您还有代理名称还未填写; '
            valid = false
          }
          if (player.distributary == 'bySchool' || player.distributary == 'byCollege') {
            if (!player.roles.length) {
              message += (player.name || '[未设置名称]') + '未选择角色; '
            }
          }
          proxys.push({
            projectAgentId: player.id,
            projectId: this.projectId,
            powerModeOfDistribution: distributaryChange[player.distributary],
            agentName: player.name,
            agentRoleId: player.roles
          })
        }
        if (!valid) {
          return this.$toast(message)
        }
        backend.setProjectProxy(this.projectId, proxys, (err, result) => {
          if (err) {
            return this.$toast('网络错误')
          }
          if (!result.state) {
            return this.$toast(result.message)
          }
          this.$toast('设置代理成功')
          this.$emit('back')
        })
      },

      _deletePlayers: function (roleNum) {
        this.players.splice(roleNum, 1)
      },
      _newRowInputFocus: function (index) {
        this.players[index].newRoleName = this.appName + this.players[index].palyerForm.name + '管理员'
      }
    },
    destroyed: function () {
      // $(window).off('resize')
      // $(window).off('keydown')
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#proxy-settings {
  height: 100%;
  padding: 0;
  user-select: none;
  .head {
    position: relative;
    z-index: 2;
    height: 65px;
    background: transparent;
    .opt-div,
    .back-div,
    .flow-title {
      height: 100%;
    }
    .back-div {
      margin-left: 24px;
      i {
        line-height: 65px;
        cursor: pointer;
        transition: all 0.3s ease-out;
        &:hover {
          color: #298df7;
        }
      }
    }
    .flow-title {
      display: inline-block;
      width: 50%;
      max-width: 300px;
      padding: 4px 0 16px;
      margin-left: 90px;
      .input-group {
        display: block;
        margin: 0 auto;
      }
      .page-name {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.73);
        margin-top: 5px;
      }
      a {
        font-size: 13px;
        color: #298df7;
        
        border-radius: 2px;
        text-decoration: none;
        white-space: nowrap;
        cursor: default;
        padding: 3px 9px;
        transition: all 0.3s ease;
      }
    }
    .opt-btn {
      display: inline-block;
      padding: 8px;
      margin: 16px 10px 0 0;
      font-size: 13px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.54);
      text-decoration: none;
      transition: all 0.3s ease-out;
      &:hover {
        color: #298df7;
      }
    }
    .save {
      width: 62px;
      margin-right: 24px;
      font-size: 13px;
      color: #ffffff;
      background: #298df7;
      border-radius: 2px;
      transition: all 0.3s ease;
      &:hover {
        background: lighten(#298df7, 10%);
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.44);
      }
      &:active {
        background: #72a3e4;
      }
    }
  }
  .loading-players {
    padding: 100px;
    text-align: center;
    font-size: 16px;
    color: #666;
    margin: 0 auto;
    position: absolute;
    width: 100%;
    top: 65px;
    bottom: 0;
  }
  .joinSet-content {
    margin: 0 auto;
    height: 90%;
    width: 100%;
    // overflow: auto;
    top: 65px;
    bottom: 0;
    .info-container {
      height: 100%;
      padding-top: 20px;
      // padding: 20px 0 5px 0;
      text-align: center;
      padding-left: 105px;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      &::-webkit-scrollbar {
        height: 10px !important;
        background-color: #f5f5f5;
      }
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #666;
        border-radius: 3px;
      }
      .col {
        position: relative;
        width: 388px;
        height: 98%;
        background: #ffffff;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12),
          0 2px 2px 0 rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        display: inline-block;
        margin-left: 20px;
        text-align: left;
        vertical-align: top;
        margin-bottom: 10px;
        // overflow: auto;
        // overflow-x: hidden;
      }
      .first-col {
        background: #298df7;
      }
      .form-group {
        width: 388px;
        display: table;
        padding-bottom: 16px;
        margin-bottom: 0;
        .app-icon {
          font-size: 24px;
          margin: 11px 0 0 16px;
        }
        .form-group-input {
          width: 77%;
          margin: 13px 0 0 32px;
          .name-label {
            font-size: 13px;
          }
          .name-input {
            width: 100%;
            font-size: 13px;
            font-weight: 500;
            border: none;
            box-shadow: none;
            border-radius: 0;
            background: transparent;
            margin-top: -5px;
            padding: 0;
            &.disabled {
              border: none;
            }
          }
        }
        .batch-head {
          background: rgba(255, 255, 255, 0.12);
          margin-top: 10px;
          height: 40px;
          .batch-tip {
            margin: 11px 0 0 70px;
            display: inline-block;
            font-size: 13px;
            font-weight: 500;
          }
          .sure {
            font-size: 13px;
            background: transparent;
            margin: 4px 4px 0 0;
            font-weight: 500;
          }
          .btn-group {
            border: none;
            .form-control.dropdown-toggle {
              background: transparent;
              font-size: 13px;
              color: #ffffff;
              border: none;
              box-shadow: none;
              margin-top: -5px;
              font-weight: 500;
              i {
                color: #ffffff;
              }
            }
          }
        }
        .read-write-label {
          font-size: 13px;
          margin: 16px 0 0 26px;
          vertical-align: top;
        }
        .owner-batch-head {
          display: none;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.12),
            0 4px 4px 0 rgba(0, 0, 0, 0.12);
          margin-top: 0;
        }
        .owner-readWrite-content {
          overflow-y: scroll;
          width: 388px;
          max-height: 600px;
          position: relative;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .role-list {
          // margin-top: 15px;
          .role-icon {
            font-size: 20px;
            display: inline-block;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .role-name {
            font-size: 13px;
            vertical-align: top;
            margin: 2px 0 0 8px;
            font-weight: 500;
            display: inline-block;
            width: 270px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .dataAuthorities-name {
            font-size: 13px;
            vertical-align: top;
            margin: 2px 0 0 8px;
            font-weight: 500;
            display: inline-block;
            width: 90px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:hover div {
              position: absolute;
              top: -30px;
              left: 9px;
              font-size: 13px;
              word-break: break-all;
              white-space: pre-wrap;
              box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12),
                0 4px 4px 0 rgba(0, 0, 0, 0.12);
              border-radius: 5px;
              background: #ffffff;
              padding: 5px 10px;
              color: black;
              z-index: 1;
            }
            &:hover .littleText {
              display: none;
            }
            &:hover .moreText {
              display: block;
            }
            &:hover .littleTextWidth {
              width: 100%;
            }
            &:hover .moreTextWidth {
              width: 280px;
            }
          }
          .dataAuthorities-name div {
            display: none;
          }
          .margin-bottom-5px {
            margin-bottom: 5px;
          }
          .margin-left-70px {
            margin-left: 70px;
          }
        }
        .white-color {
          color: #ffffff;
        }
        .light-white-color {
          color: rgba(255, 255, 255, 0.7);
        }
        .light-black-color {
          color: rgba(0, 0, 0, 0.54);
        }
        .black-color {
          color: rgba(0, 0, 0, 0.67);
        }
        .blue-color {
          color: #298df7;
        }
        .border-bottom-white {
          border-bottom: 2px solid #e0e0e0 !important;
          &:focus {
            border-bottom: 2px solid #ffffff !important;
          }
        }
        .border-bottom-blue {
          border-bottom: 2px solid #e0e0e0 !important;
          &:focus {
            border-bottom: 2px solid #298df7 !important;
          }
        }
        .role-list-item:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        .operator {
          color: #ffffff;
          &.disabled {
            opacity: 0;
            cursor: default;
          }
        }
        .operator.active {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }
      }
      .other-col {
        .scroll-area {
          overflow: auto;
          overflow-x: hidden;
          width: 388px;
          position: relative;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .form-group {
          .distribution-select .btn-group {
            border: none;
            .form-control.dropdown-toggle {
              background: transparent;
              font-size: 16px;
              color: rgba(0, 0, 0, 0.67);
              border: none;
              box-shadow: none;
              margin-top: -5px;
              font-weight: 500;
              padding: 6px 24px 6px 0;
              i {
                color: rgba(0, 0, 0, 0.54);
              }
            }
          }
          .more-opt-menu {
            position: absolute;
            left: 290px;
            top: 40px;
            min-width: 80px;
            width: 80px;
            text-align: center;
          }
          .errorMsg {
            height: 20px;
            font-size: 13px;
            height: 20px;
            font-weight: 500;
            color: #ff5252;
            opacity: 0;
            margin-left: 70px;
            transition: all 0.3s cubic-bezier(0.94, -0.25, 0.32, 1.31);
            &.show {
              opacity: 1;
            }
          }
          .participant-readWrite-content {
            overflow-y: scroll;
            width: 388px;
            // max-height: 600px;
            margin-bottom: 15px;
            &::-webkit-scrollbar {
              display: none;
            }
          }
          .participant-readWrite-header {
            height: 50px;
            background: #ffffff;
          }
          .role-set-content {
            // margin-top: 50px;
            overflow-y: scroll;
            width: 388px;
            &::-webkit-scrollbar {
              display: none;
            }
            // max-height: 455px;
          }
          .creat-role-input .name-input {
            border: none;
            box-shadow: none;
            border-radius: 0;
            background: transparent;
            width: 77%;
            margin-left: 70px;
            font-size: 13px;
            font-weight: 500;
            padding: 0;
          }
          .padding-right-70px {
            padding-right: 70px !important;
          }
          .creat-btn-group {
            margin: -36px 18px 0 0;
            .creat-cancle {
              padding: 6px 0;
              font-size: 13px;
              color: rgba(0, 0, 0, 0.4);
              font-weight: 500;
              background: #ffffff;
            }
            .creat-sure {
              padding: 6px 0;
              font-size: 13px;
              font-weight: 500;
              background: #ffffff;
            }
          }
          .creat-new-role {
            font-size: 13px;
            margin-left: 7px;
            font-weight: 500;
            text-decoration: underline;
            cursor: pointer;
          }
          .batch-head {
            background: rgba(0, 0, 0, 0.08);
            margin-top: 0;
            .form-control.dropdown-toggle {
              color: rgba(0, 0, 0, 0.67);
              i {
                color: rgba(0, 0, 0, 0.67);
              }
            }
          }
          .dividing-line {
            width: 316px;
            margin-left: 70px;
            height: 1px;
            background: rgba(0, 0, 0, 0.08);
            margin-top: 9px;
            margin-bottom: -4px;
          }
          .role-list-batch {
            margin-top: 10px;
          }
          .batch-dividing-line {
            height: 1px;
            width: 316px;
            background: rgba(0, 0, 0, 0.08);
            margin-top: 7px;
            margin-left: 70px;
          }
          .role-list-item:hover {
            background: rgba(0, 0, 0, 0.08);
          }
          .operator {
            color: rgba(0, 0, 0, 0.54);
            &.disabled {
              opacity: 0;
              cursor: default;
            }
          }
          .operator.active {
            background: rgba(0, 0, 0, 0.08);
            color: rgba(0, 0, 0, 0.67);
          }
        }
        .fiexd-header {
          display: none;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          .participant-readWrite-header {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.12),
              0 4px 4px 0 rgba(0, 0, 0, 0.12);
          }
        }
        .fiexd-batch-head {
          display: none;
        }
      }
      .role-list-item {
        height: 28px;
        width: 100%;
        padding-top: 4px;
        margin-bottom: 2px;
        .col-xs-5 {
          padding: 0;
        }
        .col-xs-7 {
          padding-left: 0;
        }
        &:hover {
          background: rgba(0, 0, 0, 0.08);
        }
      }
      .operator {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        padding: 5px 8px;
        font-weight: 500;
        margin-right: -2px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .operator.active {
        background: rgba(0, 0, 0, 0.08);
        border-radius: 2px;
        color: rgba(0, 0, 0, 0.67);
      }
      .more-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.67);
        // margin: -53px 10px 0 0;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .role-set-head {
        height: 47px;
      }
    }
    .add-role {
      display: inline-block;
      vertical-align: top;
      .add-btn {
        font-size: 13px;
        color: #298df7;
        background: rgba(0, 0, 0, 0.08);
        border-radius: 2px;
        padding: 13px 17px;
        margin: 0 67px 0 20px;
        border: 0;
      }
    }
    .clear-bord-bottom {
      border-bottom: 0 solid #fff !important;
    }
    .clear-padding-bottom {
      padding-bottom: 0 !important;
    }
    .set-margin-top-15px {
      margin-top: 15px;
    }
    .owner-readWrite-header {
      height: 50px;
    }
    .name-error-tip {
      color: tomato;
      text-align: left;
      padding-top: 10px;
    }
  }
}
</style>
