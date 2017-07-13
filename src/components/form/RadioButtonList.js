import classnames from 'classnames';

import RadioButton from './RadioButton';

class RadioButtonList extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
    value: React.PropTypes.string,
    listItems: React.PropTypes.array,
    onChange: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    /*this.state = {
      value: this.props.value,
    };*/
  }

  onSelectedValueChanged(e) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }
  }

  renderRadionButtons() {
    const me = this;
    const { name, listItems, value } = this.props;
    return (
      listItems.map((item, index) =>
        <RadioButton
          key={index}
          id={[name, index].join('_')}
          name={name}
          value={item.value || item}
          text={item.text || item}
          checked={value === (item && item.value)}
          onSelectedValueChanged={me.onSelectedValueChanged.bind(me)}
        />
      )
    );
  }

  render() {
    const {name, listItems} = this.props;
    // console.log("listItems-----",listItems);
    return (
      <span className="radioButtonList">{this.renderRadionButtons()}</span>
    );
  }
}

export default RadioButtonList;
