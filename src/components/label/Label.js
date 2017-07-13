/**
 * Created by ssehacker on 2016/10/20.
 */
import './Label.less';

class Label extends React.Component {
  static propTypes = {
    children: React.PropTypes.string,
    required: React.PropTypes.bool,
  };

  static defaultProps = {
    children: '',
    required: false,
  };

  render() {
    const className = this.props.required ? 'neo-label neo-text-require' : 'neo-label';
    return (
      <span className={className}>
        {this.props.children}
      </span>
    );
  }
}

export default Label;
