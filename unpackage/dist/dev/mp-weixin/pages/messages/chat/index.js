(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/messages/chat/index"],{

/***/ 139:
/*!****************************************************************************************!*\
  !*** C:/Users/ykh/Desktop/MyApp-wx/main.js?{"page":"pages%2Fmessages%2Fchat%2Findex"} ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _index = _interopRequireDefault(__webpack_require__(/*! ./pages/messages/chat/index.vue */ 140));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_index.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 140:
/*!*******************************************************************!*\
  !*** C:/Users/ykh/Desktop/MyApp-wx/pages/messages/chat/index.vue ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_27646bd6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=27646bd6& */ 141);
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ 143);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.vue?vue&type=style&index=0&lang=css& */ 145);
/* harmony import */ var _App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_27646bd6___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_27646bd6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _index_vue_vue_type_template_id_27646bd6___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/messages/chat/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 141:
/*!**************************************************************************************************!*\
  !*** C:/Users/ykh/Desktop/MyApp-wx/pages/messages/chat/index.vue?vue&type=template&id=27646bd6& ***!
  \**************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_27646bd6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=template&id=27646bd6& */ 142);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_27646bd6___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_27646bd6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_27646bd6___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_27646bd6___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 142:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/ykh/Desktop/MyApp-wx/pages/messages/chat/index.vue?vue&type=template&id=27646bd6& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var l0 = _vm.__map(_vm.messages, function (msg, index) {
    var $orig = _vm.__get_orig(msg)
    var m0 = _vm.formatTime(msg.sendTime)
    return {
      $orig: $orig,
      m0: m0,
    }
  })
  var g0 = _vm.messages.length
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        l0: l0,
        g0: g0,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 143:
/*!********************************************************************************************!*\
  !*** C:/Users/ykh/Desktop/MyApp-wx/pages/messages/chat/index.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _App_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=script&lang=js& */ 144);
/* harmony import */ var _App_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_App_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _App_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _App_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_App_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 144:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/ykh/Desktop/MyApp-wx/pages/messages/chat/index.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _index2 = _interopRequireDefault(__webpack_require__(/*! @/config/index.js */ 33));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var CustomNavBar = function CustomNavBar() {
  __webpack_require__.e(/*! require.ensure | components/CustomNavBar */ "components/CustomNavBar").then((function () {
    return resolve(__webpack_require__(/*! @/components/CustomNavBar.vue */ 186));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  components: {
    CustomNavBar: CustomNavBar
  },
  data: function data() {
    return {
      friendId: '',
      friendName: '对方',
      friendAvatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
      messages: [],
      inputMessage: '',
      scrollTop: 0,
      isLoadingMore: false,
      currentUserId: 1,
      // 当前用户ID，实际项目中应该从登录信息获取
      currentPage: 1,
      pageSize: 20,
      hasMore: true,
      // WebSocket连接
      socket: null
    };
  },
  computed: {
    chatTitle: function chatTitle() {
      return this.friendName || '聊天';
    }
  },
  onLoad: function onLoad(options) {
    console.log('聊天页面参数:', options);
    if (options.id) {
      this.friendId = options.id;
    }
    if (options.name) {
      this.friendName = options.name;
    }

    // 加载聊天记录
    this.loadChatHistory();

    // 初始化WebSocket (可选实现)
    // this.initWebSocket();
  },
  onUnload: function onUnload() {
    // 关闭WebSocket连接
    if (this.socket) {
      this.socket.close();
    }
  },
  methods: {
    // 加载聊天记录
    loadChatHistory: function loadChatHistory() {
      var _this = this;
      var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (refresh) {
        this.currentPage = 1;
        this.messages = [];
        this.hasMore = true;
      }
      if (!this.hasMore) return;
      uni.showLoading({
        title: '加载中...'
      });
      uni.request({
        url: "".concat(_index2.default.BaseUrl, "/api/friend/chat/message/list"),
        method: 'GET',
        data: {
          senderId: this.currentUserId,
          receiverId: this.friendId,
          page: this.currentPage,
          pageSize: this.pageSize
        },
        header: {
          'content-type': 'application/json'
        },
        success: function success(res) {
          console.log('获取聊天记录成功:', res.data);
          if (res.data && res.data.code === 1) {
            var records = res.data.data || [];

            // 处理消息数据
            var formattedMessages = records.map(function (msg) {
              return {
                id: msg.id,
                content: msg.content,
                sendTime: msg.sendTime,
                isSelf: msg.senderId === _this.currentUserId,
                isRead: msg.isRead,
                isRevoked: msg.isRevoked
              };
            });
            if (refresh) {
              _this.messages = formattedMessages;
            } else {
              _this.messages = [].concat((0, _toConsumableArray2.default)(formattedMessages), (0, _toConsumableArray2.default)(_this.messages));
            }

            // 判断是否还有更多消息
            _this.hasMore = records.length === _this.pageSize;

            // 第一次加载完成后，滚动到底部
            if (refresh) {
              _this.$nextTick(function () {
                _this.scrollToBottom();
              });
            }

            // 标记收到的消息为已读
            _this.markMessagesAsRead();
          } else {
            uni.showToast({
              title: '获取聊天记录失败',
              icon: 'none'
            });
          }
        },
        fail: function fail(err) {
          console.error('获取聊天记录失败:', err);
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        },
        complete: function complete() {
          uni.hideLoading();
        }
      });
    },
    // 发送消息
    sendMessage: function sendMessage() {
      var _this2 = this;
      if (!this.inputMessage.trim()) return;
      var messageData = {
        senderId: this.currentUserId,
        receiverId: this.friendId,
        content: this.inputMessage,
        sendTime: new Date().toISOString(),
        isRead: 0,
        isRevoked: 0
      };

      // 先添加到本地列表，提高用户体验
      var tempMessage = _objectSpread(_objectSpread({}, messageData), {}, {
        isSelf: true,
        id: 'temp_' + Date.now() // 临时ID
      });

      this.messages.push(tempMessage);
      this.inputMessage = '';

      // 滚动到底部
      this.$nextTick(function () {
        _this2.scrollToBottom();
      });

      // 发送到服务器
      uni.request({
        url: "".concat(_index2.default.BaseUrl, "/api/friend/chat/message/send"),
        method: 'POST',
        data: messageData,
        header: {
          'content-type': 'application/json'
        },
        success: function success(res) {
          console.log('发送消息成功:', res.data);
          if (res.data && res.data.code === 1) {
            // 用服务器返回的消息ID替换临时ID
            var serverMessage = res.data.data;
            var index = _this2.messages.findIndex(function (m) {
              return m === tempMessage;
            });
            if (index !== -1) {
              _this2.$set(_this2.messages, index, _objectSpread(_objectSpread({}, tempMessage), {}, {
                id: serverMessage.id
              }));
            }
          } else {
            uni.showToast({
              title: '发送失败',
              icon: 'none'
            });
            // 标记消息为发送失败
            var _index = _this2.messages.findIndex(function (m) {
              return m === tempMessage;
            });
            if (_index !== -1) {
              _this2.$set(_this2.messages, _index, _objectSpread(_objectSpread({}, tempMessage), {}, {
                sendFailed: true
              }));
            }
          }
        },
        fail: function fail(err) {
          console.error('发送消息失败:', err);
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          // 标记消息为发送失败
          var index = _this2.messages.findIndex(function (m) {
            return m === tempMessage;
          });
          if (index !== -1) {
            _this2.$set(_this2.messages, index, _objectSpread(_objectSpread({}, tempMessage), {}, {
              sendFailed: true
            }));
          }
        }
      });
    },
    // 加载更多历史消息
    loadMoreMessages: function loadMoreMessages() {
      var _this3 = this;
      if (!this.hasMore || this.isLoadingMore) return;
      this.isLoadingMore = true;
      this.currentPage++;
      uni.request({
        url: "".concat(_index2.default.BaseUrl, "/api/friend/chat/message/list"),
        method: 'GET',
        data: {
          senderId: this.currentUserId,
          receiverId: this.friendId,
          page: this.currentPage,
          pageSize: this.pageSize
        },
        header: {
          'content-type': 'application/json'
        },
        success: function success(res) {
          console.log('加载更多消息成功:', res.data);
          if (res.data && res.data.code === 1) {
            var records = res.data.data || [];

            // 处理消息数据
            var formattedMessages = records.map(function (msg) {
              return {
                id: msg.id,
                content: msg.content,
                sendTime: msg.sendTime,
                isSelf: msg.senderId === _this3.currentUserId,
                isRead: msg.isRead,
                isRevoked: msg.isRevoked
              };
            });

            // 在列表前面添加历史消息
            _this3.messages = [].concat((0, _toConsumableArray2.default)(formattedMessages), (0, _toConsumableArray2.default)(_this3.messages));

            // 判断是否还有更多消息
            _this3.hasMore = records.length === _this3.pageSize;
          } else {
            uni.showToast({
              title: '获取历史消息失败',
              icon: 'none'
            });
          }
        },
        fail: function fail(err) {
          console.error('获取历史消息失败:', err);
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        },
        complete: function complete() {
          _this3.isLoadingMore = false;
        }
      });
    },
    // 标记消息为已读
    markMessagesAsRead: function markMessagesAsRead() {
      var _this4 = this;
      // 找出所有未读的非自己发送的消息
      var unreadMessages = this.messages.filter(function (msg) {
        return !msg.isSelf && msg.isRead === 0;
      });
      unreadMessages.forEach(function (msg) {
        uni.request({
          url: "".concat(_index2.default.BaseUrl, "/api/friend/chat/message/read/").concat(msg.id),
          method: 'PUT',
          success: function success(res) {
            if (res.data && res.data.code === 1) {
              // 更新本地消息状态
              var index = _this4.messages.findIndex(function (m) {
                return m.id === msg.id;
              });
              if (index !== -1) {
                _this4.messages[index].isRead = 1;
              }
            }
          }
        });
      });
    },
    // 撤回消息
    revokeMessage: function revokeMessage(msg) {
      var _this5 = this;
      if (!msg || !msg.id || msg.id.toString().startsWith('temp_')) return;
      uni.showModal({
        title: '提示',
        content: '确定要撤回这条消息吗？',
        success: function success(res) {
          if (res.confirm) {
            uni.request({
              url: "".concat(_index2.default.BaseUrl, "/api/friend/chat/message/revoke/").concat(msg.id),
              method: 'PUT',
              success: function success(res) {
                if (res.data && res.data.code === 1) {
                  // 更新本地消息状态
                  var index = _this5.messages.findIndex(function (m) {
                    return m.id === msg.id;
                  });
                  if (index !== -1) {
                    _this5.$set(_this5.messages, index, _objectSpread(_objectSpread({}, _this5.messages[index]), {}, {
                      isRevoked: 1
                    }));
                  }
                  uni.showToast({
                    title: '已撤回',
                    icon: 'success'
                  });
                } else {
                  uni.showToast({
                    title: '撤回失败',
                    icon: 'none'
                  });
                }
              },
              fail: function fail() {
                uni.showToast({
                  title: '网络请求失败',
                  icon: 'none'
                });
              }
            });
          }
        }
      });
    },
    // 删除消息
    deleteMessage: function deleteMessage(msg) {
      var _this6 = this;
      if (!msg || !msg.id || msg.id.toString().startsWith('temp_')) return;
      uni.showModal({
        title: '提示',
        content: '确定要删除这条消息吗？',
        success: function success(res) {
          if (res.confirm) {
            uni.request({
              url: "".concat(_index2.default.BaseUrl, "/api/friend/chat/message/").concat(msg.id),
              method: 'DELETE',
              success: function success(res) {
                if (res.data && res.data.code === 1) {
                  // 从本地列表中移除
                  var index = _this6.messages.findIndex(function (m) {
                    return m.id === msg.id;
                  });
                  if (index !== -1) {
                    _this6.messages.splice(index, 1);
                  }
                  uni.showToast({
                    title: '已删除',
                    icon: 'success'
                  });
                } else {
                  uni.showToast({
                    title: '删除失败',
                    icon: 'none'
                  });
                }
              },
              fail: function fail() {
                uni.showToast({
                  title: '网络请求失败',
                  icon: 'none'
                });
              }
            });
          }
        }
      });
    },
    // 滚动到底部
    scrollToBottom: function scrollToBottom() {
      // 这个值需要根据消息列表的高度动态设置
      // 这里使用一个足够大的值，让scroll-view滚动到底部
      this.scrollTop = 9999;
    },
    // 格式化时间
    formatTime: function formatTime(timestamp) {
      if (!timestamp) return '';
      var date = new Date(timestamp);
      var now = new Date();
      var diffDays = Math.floor((now - date) / (24 * 60 * 60 * 1000));
      var hours = date.getHours().toString().padStart(2, '0');
      var minutes = date.getMinutes().toString().padStart(2, '0');
      var timeStr = "".concat(hours, ":").concat(minutes);

      // 今天的消息只显示时间
      if (diffDays === 0) {
        return timeStr;
      }
      // 昨天的消息
      else if (diffDays === 1) {
        return "\u6628\u5929 ".concat(timeStr);
      }
      // 一周内的消息
      else if (diffDays < 7) {
        var days = ['日', '一', '二', '三', '四', '五', '六'];
        return "\u5468".concat(days[date.getDay()], " ").concat(timeStr);
      }
      // 更早的消息
      else {
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return "".concat(month, "-").concat(day, " ").concat(timeStr);
      }
    },
    // 初始化WebSocket (可选实现)
    initWebSocket: function initWebSocket() {
      // 如果后端支持WebSocket，可以实现这部分
      // const wsUrl = `ws://${config.BaseUrl.replace('http://', '')}/ws/chat?userId=${this.currentUserId}`;
      // this.socket = new WebSocket(wsUrl);

      // this.socket.onopen = () => {
      //     console.log('WebSocket连接已打开');
      // };

      // this.socket.onmessage = (event) => {
      //     const message = JSON.parse(event.data);
      //     // 如果是当前聊天的消息，添加到列表
      //     if (message.senderId === this.friendId) {
      //         this.messages.push({
      //             ...message,
      //             isSelf: false
      //         });
      //         this.scrollToBottom();
      //         this.markMessagesAsRead();
      //     }
      // };

      // this.socket.onerror = (error) => {
      //     console.error('WebSocket错误:', error);
      // };

      // this.socket.onclose = () => {
      //     console.log('WebSocket连接已关闭');
      // };
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 145:
/*!****************************************************************************************************!*\
  !*** C:/Users/ykh/Desktop/MyApp-wx/pages/messages/chat/index.vue?vue&type=style&index=0&lang=css& ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _App_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_App_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_App_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../App/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=style&index=0&lang=css& */ 146);
/* harmony import */ var _App_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_App_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_App_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_App_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_App_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_App_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _App_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_App_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_App_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _App_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_App_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_App_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_App_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_App_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_App_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_App_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 146:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/ykh/Desktop/MyApp-wx/pages/messages/chat/index.vue?vue&type=style&index=0&lang=css& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[139,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/messages/chat/index.js.map