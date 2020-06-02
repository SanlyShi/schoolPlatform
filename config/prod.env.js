'use strict'
let clusterIp = process.env['CLUSTER_HOST_IP']
if (undefined == clusterIp) {
  clusterIp = '192.168.9.177'
}
module.exports = {
  dev: {
    host: clusterIp,
    port: 3031,
    saasBackEndHost: 'http://'+clusterIp+':8080',
    officialBackEndHost: 'http://'+clusterIp+':7001/official',
    mobileHost: 'http://'+clusterIp+':3000',
    redis: {
      host: clusterIp,
      port: 6379,
      prefix: 'saas_web_',
      db: 1
    },
    domain: 'http://27.154.55.58:8888',
    local: {
      schoolId: '',
      testLogin: [{
        id: 'demo',
        name: 'DEMO',
        schoolId: 'demo',
        password: 'ixy666'
      }, {
        id: 'slsd',
        name: '浙江水利水电学院（DEMO）',
        schoolId: 'slsd',
        password: 'ixyslsd'
      }],
      cloud: false,
      yibanCloud: false,
      groupName: ''
    },
    ixyLogin: true,
  },
  NODE_ENV: '"production"'
}
