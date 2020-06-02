export default {
    data () {
      return {
        record: {
            id: '',
            resultRecord: '',
            canEditCounselor: true, // 是否可编辑
            starNumber: 0
          },
        stars: [{ id: 1, isSelected: false }, { id: 2, isSelected: false }, { id: 3, isSelected: false }, { id: 4, isSelected: false }, { id: 5, isSelected: false }]
      }
    },
    methods: {
        changeStar: function (data) {
          if (!this.canEditCounselor) return
            this.record.starNumber = 0
            for (var i in this.stars) {
              if (this.stars[i].id <= data.id) {
                this.stars[i].isSelected = true
                this.record.starNumber++
              } else {
                this.stars[i].isSelected = false
              }
            }
          }
    }
 }
