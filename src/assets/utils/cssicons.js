export default {
  spinner: function () {
    return `<div id="showWaiting" class="page-waiting">
              <div class="spinner">
                <div class="spinner-container container1">
                  <div class="circle1"></div>
                  <div class="circle2"></div>
                  <div class="circle3"></div>
                  <div class="circle4"></div>
                </div>
                <div class="spinner-container container2">
                  <div class="circle1"></div>
                  <div class="circle2"></div>
                  <div class="circle3"></div>
                  <div class="circle4"></div>
                </div>
                <div class="spinner-container container3">
                  <div class="circle1"></div>
                  <div class="circle2"></div>
                  <div class="circle3"></div>
                  <div class="circle4"></div>
                </div>
              </div>
            </div>`
  },
  normal: function (msg) {
    return `<div id="showWaiting" class="page-toast" style="opacity: 0;">
              <div class="show-content">
                <span class="message">${msg}</span>
              </div>
            </div>`
  },
  happy: function (msg) {
    return `<div id="showWaiting" class="page-toast" style="opacity: 0;">
              <div class="show-content">
                <div class='smiley-green'>
                  <div class='left-eye'>.</div>
                  <div class='right-eye'></div>
                  <div class='smile'></div>
                </div>
                <span class="message">${msg}</span>
              </div>
            </div>`
  },
  amazed: function (msg) {
    return `<div id="showWaiting" class="page-toast" style="opacity: 0;">
              <div class="show-content">
                <div class='smiley-yellow'>
                  <div class='left-eye'>.</div>
                  <div class='right-eye'></div>
                  <div class='smile'></div>
                </div>
                <span class="message">${msg}</span>
              </div>
            </div>`
  },
  upset: function (msg) {
    return `<div id="showWaiting" class="page-toast" style="opacity: 0;">
              <div class="show-content">
                <div class='smiley-green'>
                  <div class='left-eye'>.</div>
                  <div class='right-eye'></div>
                  <div class='smile'></div>
                </div>
                <span class="message">${msg}</span>
              </div>
            </div>`
  },
  check: function (msg) {
    return `<div id="showWaiting" class="page-toast" style="opacity: 0;">
              <div class="show-content">
                <span class="check-icon"></span>
                <span class="message">${msg}</span>
              </div>
            </div>`
  },
  cancel: function (msg) {
    return `<div id="showWaiting" class="page-toast" style="opacity: 0;">
              <div class="show-content">
                <span class="cancel-icon"></span>
                <span class="message">${msg}</span>
              </div>
            </div>`
  }
}
