function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React, { Component } from 'react';
import BraftEditor from 'braft-editor';
import request from 'umi-request';
import 'braft-editor/dist/index.css';

var Editor =
/*#__PURE__*/
function (_Component) {
  _inherits(Editor, _Component);

  function Editor(props) {
    var _this;

    _classCallCheck(this, Editor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Editor).call(this, props));

    _this.handleChange = function (editorState) {
      _this.setState({
        editorState: editorState,
        outputHTML: editorState.toHTML()
      }, function () {
        _this.props.onChange(_this.state.outputHTML);
      });
    };

    _this.myUploadFn = function (param) {
      var serverURL = _this.props.action;
      var xhr = new XMLHttpRequest();
      var fd = new FormData();

      var successFn = function successFn(response) {
        // 假设服务端直接返回文件上传后的地址
        // 上传成功后调用param.success并传入上传后的文件地址
        param.success({
          url: xhr.responseText,
          meta: {
            id: 'xxx',
            title: 'xxx',
            alt: 'xxx',
            loop: true,
            // 指定音视频是否循环播放
            autoPlay: true,
            // 指定音视频是否自动播放
            controls: true,
            // 指定音视频是否显示控制栏
            poster: 'http://xxx/xx.png' // 指定视频播放器的封面

          }
        });
      };

      var progressFn = function progressFn(event) {
        // 上传进度发生变化时调用param.progress
        param.progress(event.loaded / event.total * 100);
      };

      var errorFn = function errorFn(response) {
        // 上传发生错误时调用param.error
        param.error({
          msg: 'unable to upload.'
        });
      };

      xhr.upload.addEventListener("progress", progressFn, false);
      xhr.addEventListener("load", successFn, false);
      xhr.addEventListener("error", errorFn, false);
      xhr.addEventListener("abort", errorFn, false);
      fd.append('file', param.file);
      fd.append('type', 'store_avatar');
      xhr.open('POST', serverURL, true);
      xhr.send(fd);
    };

    _this.uploadFn = function (_ref) {
      var file = _ref.file,
          success = _ref.success;
      var _this$props = _this.props,
          action = _this$props.action,
          data = _this$props.data;
      var formData = new FormData();
      formData.append('file', file);

      if (data) {
        Object.keys(data).map(function (key) {
          formData.append(key, data[key]);
        });
      }

      request(action, {
        method: 'post',
        data: formData
      }).then(function (re) {
        success(re.data);
      });
    };

    _this.state = {
      editorState: BraftEditor.createEditorState(props.value ? props.value : null),
      outputHTML: '<p></p>'
    };
    return _this;
  }

  _createClass(Editor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.siLiving = true;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.siLiving = false;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          editorState = _this$state.editorState,
          outputHTML = _this$state.outputHTML;
      return React.createElement("div", {
        style: {
          boder: '1px solid #eee'
        }
      }, React.createElement(BraftEditor, {
        value: editorState,
        onChange: this.handleChange,
        media: {
          uploadFn: this.uploadFn
        }
      }));
    }
  }]);

  return Editor;
}(Component);

Editor.defaultProps = {
  onChange: function onChange() {},
  action: '/',
  data: {}
};
export default Editor;