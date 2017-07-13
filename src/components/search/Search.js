import Form from '../form';
import Select from '../../components/select';
import Button from '../../components/button';
import './Search.less';

const { Input } = Form;
class Search extends React.Component {

  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    style: { width: 80 },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  static propTypes = {
    onSearch: React.PropTypes.func,
    config: React.PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      option: props.config && props.config[0].id || '',
    };
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  handleSelect(fieldName, e) {
    let value;
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }

    this.setState({
      [`${fieldName}`]: value,
    });
  }

  renderSelect() {
    const config = this.props.config;
    const option = this.state.option;
    return (
      !!config ? 
      <Select
        {...Search.selectCommonConfig}
        value={option}
        onChange={this.handleSelect.bind(this, 'option')}
      >
        {
          config.map(item => (
            <Select.Option key={item.id}>{item.name}</Select.Option>
          ))
        }
      </Select>
      :
      null
    )
  }

  render() {
    const { value, option } = this.state;
    const { onSearch } = this.props;
    const me = this;
    return (
      <div className="neo-search">        
        {this.renderSelect()}
        <Input value={value} onChange={me.handleChange.bind(me)} placeholder="请输入关键词" />
        <Button onClick={onSearch && onSearch.bind(me, option, value)}>
          <i className="iconfont icon-search"></i>
        </Button>
      </div>
    );
  }
}

export default Search;
