import React,{Component} from 'react';
import BraftEditor from 'braft-editor';
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
  render(){
    const {editorState,outputHTML} = this.state;
    return (
      <div style={{boder:'1px solid #eee'}}>
        <BraftEditor
          value={editorState}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}
Editor.defaultProps = {
  onChange:()=>{}
}
export default Editor;