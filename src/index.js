import React,{Component} from 'react';
import BraftEditor from 'braft-editor';
import request from 'umi-request';
import 'braft-editor/dist/index.css';
class Editor extends Component{
  constructor(props) {
    super(props);

    this.state = {
      editorState: BraftEditor.createEditorState(props.value ? props.value :null),
      outputHTML:'<p></p>'
    }
  }

  componentDidMount(){
    this.siLiving = true;
  }
  componentWillUnmount () {
    this.siLiving = false
  }
  handleChange = editorState => {
    this.setState({
      editorState:editorState,
      outputHTML:editorState.toHTML()
    },()=>{
      this.props.onChange(this.state.outputHTML)
    })
  }
  myUploadFn = (param) => {
    const {action:serverURL} = this.props;
    const xhr = new XMLHttpRequest
    const fd = new FormData()

    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: xhr.responseText,
        meta: {
          id: 'xxx',
          title: 'xxx',
          alt: 'xxx',
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
          poster: 'http://xxx/xx.png', // 指定视频播放器的封面
        }
      })
    }

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.'
      })
    }

    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('file', param.file);
    fd.append('type', 'store_avatar');
    xhr.open('POST', serverURL, true)
    xhr.send(fd);

  }

  uploadFn = ({file,success}) => {
    const {action,data} = this.props;
    const formData = new FormData();
    formData.append('file', file);
    if(data){
      Object.keys(data).map(key => {
        formData.append(key,data[key]);
      })
    }
    request(action,{
      method:'post',
      data:formData
    }).then(re => {
      success(re.data)
    })
  }
  render(){
    const {editorState,outputHTML} = this.state;
    return (
      <div style={{boder:'1px solid #eee'}}>
        <BraftEditor
          value={editorState}
          onChange={this.handleChange}
          media={{uploadFn:this.uploadFn}}
        />
      </div>
    )
  }
}
Editor.defaultProps = {
  onChange:()=>{},
  action:'/',
  data:{}
}
export default Editor;