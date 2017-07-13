
import Dropdown from '../../components/dropdown';

class DropdownComponent extends React.Component {
    
  constructor(props) {
    super(props);
    this.handleCallback = this.handleCallback.bind(this);
    this.options = [{
        id: 1,
        name: '详情',
        disable: true,
        callback: this.handleCallback,
    }, {
        id: 2,
        name: '挂载',
        disable: true,
        callback: this.handleCallback,
    }, {
        id: 3,
        name: '删除',
        disable: true,
        callback: this.handleCallback,
    }, {
        id: 4,
        name: '关机',
        disable: true,
        callback: this.handleCallback,
    }];
  };

  handleCallback(text) {
      console.log("我的项目---", text);
  };

    render () {
        return (
            <div style={{padding: '30px', height: '100px'}}>
                <div style={{marginRight: '50px', float: 'left'}}>
                <Dropdown
                    options={this.options}
                    title="下拉列表1"
                    btnType="primary"
                />
                </div>
                <div style={{marginRight: '50px', float: 'left'}}>
                <Dropdown
                    options={this.options}
                    title="下拉列表2"
                    btnSize="small"
                    placement="bottomCenter"
                    trigger="hover"
                />
                </div>
                <div style={{marginRight: '50px', float: 'left'}}>
                <Dropdown
                    options={this.options}
                    title="下拉列表3"
                    btnType="primary"
                    btnSize="small"
                    placement="bottomRight"
                />
                </div>
            </div>
        )
    }
}
export default DropdownComponent;