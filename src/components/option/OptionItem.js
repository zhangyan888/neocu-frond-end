/**
 * Created by ssehacker on 2017/5/9.
 */
import classnames from 'classnames';

export default class OptionItem extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func,
    disable: React.PropTypes.bool,
  };

  constructor(props) {
    super(props);
  }

  handleClick() {
    const { onClick, disable } = this.props;
    if (!disable) {
      onClick.call(this);
    }
  }

  render() {
    const me = this;
    const { children, disable } = me.props;
    return (
      <li
        className={classnames({ disable, })}
        onClick={me.handleClick.bind(me)}
      >{children}</li>
    );
  }
}
