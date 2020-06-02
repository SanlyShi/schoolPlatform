<template>
    <div id="records">
        <div id='recordsList'>
            <v-table
                v-if='curDetailsComponents == ""'
                :url="tableData_url"
                :columns="columns"
                pagesize="15"
                idField="id"
                :order="true"
                ref='recordsList'
                :search='false'>
                </v-table>
        </div>
        <div id='recordsDetails' v-loading='loading&&curDetailsComponents!=""'>
          <teachin-details @closeLoading='loading = false' v-if='curDetailsComponents == "PREACH_MEETING"' :detailsId='curDetailsId'></teachin-details>
          <interview-details @closeLoading='loading = false' v-if='curDetailsComponents == "EXAMINATION"' :detailsId='curDetailsId'></interview-details>
          <recruit-details @closeLoading='loading = false' v-if='curDetailsComponents == "RECRUITMENT"' :detailsId='curDetailsId'></recruit-details>
          <dcw-unit-details @closeLoading='loading = false' :detailsId="curDetailsId" :companyId="companyId" type="DOUBLE_CHOOSE" v-if='curDetailsComponents == "DOUBLE_CHOOSE"'></dcw-unit-details>
          <ojf-unit-details @closeLoading='loading = false' :detailsId="curDetailsId" :companyId="companyId" type="NETWORK_MEETING" v-if='curDetailsComponents == "NETWORK_MEETING"'></ojf-unit-details>
        </div>
    </div>
</template>
<script>
import teachinDetails from './techinDetails'
import interviewDetails from './interviewDetails'
import recruitDetails from './recruitDetails'
import dcwUnitDetails from './dcwUnitDetails'
import ojfUnitDetails from './ojfUnitDetails'

export default {
  props: ["companyId"],
  components: {
    teachinDetails,
    interviewDetails,
    recruitDetails,
    dcwUnitDetails,
    ojfUnitDetails
  },
  data() {
    return {
        tableData_url:'',
        curDetailsComponents:'',
        curDetailsId: '',
        loading: false,
    }
  },
  methods: {
    showRecordsList() {
      this.curDetailsComponents = ''
    }
  },
  computed: {
    columns: function() {
      return [
        {
          id: "type",
          title: "参会类型",
          className: "text-left",
          width: 130,
          hidden: false,
          search: {
            type: "select",
            data: {
              options: [
                { value: "DOUBLE_CHOOSE", label: "双选会" },
                { value: "PREACH_MEETING", label: "宣讲会" },
                { value: "EXAMINATION", label: "笔/面试" },
                { value: "NETWORK_MEETING", label: "网招会" },
                { value:"RECRUITMENT", label: "招聘信息" },

              ],
              optionsLabel: "label",
              optionsValue: "value"
            }
          },
          formatter: (record) => {
              return record.typeName
          }
        },
        {
          id: "name",
          title: "名称",
          className: "text-left",
          width: 130,
          hidden: false,
          search: {
            type: "input",
            data: {
            placeholer: "",
            autoFocus: false
            }
        }
        },
        {
          id: "timeSpace",
          title: "时间",
          width: 150,
          className: "text-left line-height-normal",
          hidden: false,
          search: {
            type: 'datetime',
            data: {
                dateFormat: 'yyyy-MM-dd hh:ii',
                placeholder:'参会',
                change: ({ value, target }) => {
                this.tableData_url = `/table-data/employment/manage/company/getParticipationRecord?id=${this.companyId}&timeStamp=${new Date().getTime()}&beginTime=${this.$refs.recordsList.tableSearchFields['timeSpace_start']}&endTime=${this.$refs.recordsList.tableSearchFields['timeSpace_end']}`
                    console.log(this.tableData_url)
                }
            }
            },
          formatter(record) {
            return `${new Date(record.beginTime).format(
              "yyyy-MM-dd HH:mm"
            )} -<br/> ${new Date(record.endTime).format("yyyy-MM-dd HH:mm")}`;
          }
        },
        {
          id: "areaDetail",
          title: "地点",
          hidden: false,
          width: 130,
          formatter(record) {
            if (record.areaDetail == "") {
              return "-";
            }
          }
        },
        {
          id: "contactPeople",
          title: "联系人",
          className: "text-left",
          hidden: false,
          width: 130,
          search: {
            type: "input",
            data: {
            placeholer: "",
            autoFocus: false
            }
        }
        },
        {
          id: "contactPhone",
          title: "联系方式",
          hidden: false,
          width: 130,
          search: {
            type: "input",
            data: {
            placeholer: "",
            autoFocus: false
            }
        }
        },
        {
          id: "opts",
          title: "操作",
          width: 80,
          hidden: false,
          options: [
            {
              tag: "a",
              text: "查看",
              callback: (record, index) => {
                  this.loading = true
                  this.curDetailsId = record.id
                  this.curDetailsComponents = record.type
              }
            }
          ]
        }
      ];
    }
  },
  created() {
      this.tableData_url = "/table-data/employment/manage/company/getParticipationRecord?id=" + this.companyId
  },
};
</script>
<style lang="less" scoped>
</style>
<style lang="less">
#records {
  .line-height-normal {
    line-height: normal;
  }
}
</style>
