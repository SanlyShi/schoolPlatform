<template>
    <div id="stayInformation">
        <div class="select-room-head" >
            <label class="head-title">宿舍信息</label>
        </div>
        <div class="house" :style="'max-height:' + scrollHeight + 'px'" >
           <div class="stayTitle">
               <h1 ><span>所属宿舍： </span><em>{{addressName}}</em><i class="location" @click="setLocation">导航</i></h1>
               <h1 v-if="styleInfo&&styleInfo.expectCheckInTime"><span>入住时间：</span><em>{{styleInfo.expectCheckInTime}}</em></h1>
               <h1 v-if="styleInfo&&styleInfo.expectRetirementTime"><span>退宿时间： </span><em>{{styleInfo.expectRetirementTime}}</em></h1>
           </div>
           <div class="changeRecord">
               <v-table
                    title="入退调记录"
                    idField="id"
                    :columns="apartmentInfoListColumns"
                    :rows="apartmentInfoList"
                    :order="true"
                    :columnsControl="false"
                    :paginationShow="false"></v-table>
            </div>
            <div class="info-card">
                <div>
                    <v-table
                    title="违规违纪记录"
                    idField="id"
                    :columns="violationRecordColumns"
                    :rows="violationRecord"
                    :order="true"
                    :columnsControl="false"
                    :paginationShow="false">
                    <div slot="btn-group" class="btn-group pull-right" role="group">
                        <!-- <button type="button" class="btn clearBtnBorder add-btn" @click="showAddRecordModa">新增</button> -->
                    </div>
                    </v-table>
                </div>
            </div>
        </div>
        
        <v-modal :show="showLocation" effect="fade" width="800">
          <div slot="modal-body" class="modal-body container-fluid">
           <div id='location' style="height: 400px"></div>
          </div>
          <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn cancel-btn clearBtnBorder" @click="showLocation = false">取消</button>
          </div>
        </v-modal>
       
    </div>
</template>
<script>
import { sAjax } from '../../assets/utils/utils'
import Locations from '../../modules/iSignIn/locations'
export default {
  components: {
    Locations
  },
    inject: {
      windowObj: {
        default: null
      }
    },
    data() {
        return {
            location: [],
            showLocation: false,
            styleInfo: null,
            addressName: '',
            apartmentInfoList: [],//入退调记录
            apartmentInfoListColumns: [],
            violationRecord:[],//违规记录
            violationRecordColumns: [],
            checkInStatus: {
                WAIT_CHECK_IN: '预分配',
                CHECK_IN: "已入住",
                IN_CHECK_IN: '入住确认中',
                RETIREMENT: '已退宿',
                IN_RETIREMENT: '退宿确认中',
                ACCOMMODATION: '调宿'
            },
            scrollHeight: 0,
        }
    },
    watch: {
      windowObj: {
        deep:true,
        handler: function () {
          var pageContentHeight = $("#stayInformation").height()
          this.scrollHeight = pageContentHeight - 72
        }
      }
    },

    mounted: function () {
      var pageContentHeight = $("#stayInformation").height()
      this.scrollHeight = pageContentHeight - 72
     
    },
    methods: {
          setLocation() {
              var geocoder,map,marker = null;
              this.showLocation = true
              map = new qq.maps.Map(document.getElementById('location'),{
                  zoom: 15
              });
              //调用地址解析类
              geocoder = new qq.maps.Geocoder({
                  complete : function(result){
                      map.setCenter(result.detail.location);
                      var marker = new qq.maps.Marker({
                          map:map,
                          position: result.detail.location
                      });
                  }
              });
              
              console.log(geocoder)
              geocoder.getLocation(this.styleInfo.schoolName+this.styleInfo.buildingName);
              //styleInfo.campusName+styleInfo.zoneName+styleInfo.buildingName

        },
        getStayInfo() {
            let url  = '/api/apartment/users/apartmentInfo'
            sAjax({
                url: url,
                type: 'get',
                success: (data) => {
                    if(data.state&&data.data) {
                        this.styleInfo = data.data   
                        this.addressName = this.styleInfo.campusName+this.styleInfo.zoneName+this.styleInfo.buildingName+this.styleInfo.roomName+this.styleInfo.bedName
                        this.getApartmentInfo()
                        this._getViolationData()
                    }else {
                        this.styleInfo = null
                    }
                }
            })
        },
        getApartmentInfo() {
            let url = '/api/apartment/users/apartmentInfo/' + this.styleInfo.userId
            sAjax({
                url: url,
                type: 'get',
                success: (info) => {
                    if(info.state&&info.data) {
                        this.apartmentInfoList = info.data.apartmentUserList
                    }else {
                        this.apartmentInfoList = []
                    }
                }
            })
        },
         _getViolationData: function () {
        sAjax({
          url: '/api/apartment/users/disciplinary/' + this.styleInfo.userId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data) {
                this.violationRecord = data.data
              }else {
                this.violationRecord = []
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },

    },
    created() {
        this.getStayInfo()
        this.apartmentInfoListColumns = [{
            id: 'changeDate',
            title: '入退调时间',
            className: 'text-left',
            hidden: false,
          },{
            id: 'changeDate',
            title: '事项',
            className: 'text-left',
            hidden: false,
            formatter: (record) => {
          //     WAIT_CHECK_IN: '预分配',
          // CHECK_IN: '已入住',
          // RETIREMENT: '退宿',
          // ACCOMMODATION: '调宿'
              if(record.checkInStatus == 'WAIT_CHECK_IN') {
                return '分配'
              }
              if(record.checkInStatus == 'CHECK_IN') {
                return '入住'
              }
              if(record.checkInStatus == 'RETIREMENT') {
                return '退宿'
              }
              if(record.checkInStatus == 'ACCOMMODATION') {
                return '调宿'
              }

            }
          }, {
            id: 'checkInStatus',
            title: '入退调记录',
            className: 'text-left',
            hidden: false,
            formatter: (record) => {
              console.log(record)
              if(record.checkInStatus == 'RETIREMENT') {
                return '从' + record.roomValue + '退宿'
              }else {
                return this.checkInStatus[record.checkInStatus] + record.roomValue
              }
             
            }
          }]
          this.violationRecordColumns = [{
            id: 'type',
            title: '违规类型',
            width: 150,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'createTime',
            title: '记录时间',
            width: 200,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'remark',
            title: '备注',
            width: 300,
            className: 'text-left',
            hidden: false,
          }, 
          // {
          //   id: 'opt',
          //   title: '操作',
          //   className: 'text-centet',
          //   hidden: false,
          //   formatter: (recordItem) => {
          //     return [{
          //       tag: 'a',
          //       text: '删除',
          //       callback: (record, index) => {
          //         if (confirm('确定要删除吗')) {
          //           sAjax({
          //             url: '/api/apartment/users/disciplinary/' + record.id,
          //             type: 'post',
          //             success: (data) => {
          //               if (data.state) {
          //                 this.$toast('删除成功')
          //                 this._refreshTable()
          //                 this._getViolationData()
          //               } else {
          //                 this.$toast(data.message)
          //               }
          //             }
          //           })
          //         }
          //       }
          //     }]
          //   }
          // }
          ]
    },
}
</script>
<style lang="less">
#stayInformation {
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
    .house {
        overflow-x: hidden;
        overflow-y: auto;
        .stayTitle {
          padding-left: 32px;
            display: flex;
            h1 {
                margin-right: 40px;
                font-size: 14px;
                span{
                    display: inline-block;
                    margin-right: 20px;
                }
                em,i {
                    font-style: normal;
                }
            }
        }
        i.location {
          display: inline-block;
          margin-left: 20px;
          text-decoration: underline;
          color: #fff;
          width: 40px;
          height: 20px;
          border-radius: 4px;
          line-height: 20px;
          background: #1478f6;
          text-align: center;
          cursor: pointer;
        }
    }
}
    
</style>