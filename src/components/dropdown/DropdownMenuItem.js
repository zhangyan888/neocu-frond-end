/**
 * Created on 2017/05/06.
 */
import classnames from 'classnames';
import './Dropdown.less';

class DropdownMenuItem extends React.Component {

    static propTypes = {
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element,
        ]),
        className: React.PropTypes.string,
        active: React.PropTypes.bool,
        href: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        onSelect: React.PropTypes.func,
        onClick: React.PropTypes.func,
        collapse: React.PropTypes.func,
    };

    static defaultProps = {
        divider: false,
        disabled: false,
        children: '列表项',
        href: 'javascript:;',
    }

  handleClick(e) {
    const {onClick, collapse} = this.props;
    collapse(e);
    onClick(e);
  }

    render() {
        const {
            active,
            disabled,
            className,
            style,
            onClick,
            href,
        } = this.props;


        return (
            <li
                className={classnames(className, { active, disabled })}
                style={style}
            >
                <a href={href} onClick={this.handleClick.bind(this)}>{name || this.props.children} </a>
            </li>
        );
    }
}

export default DropdownMenuItem;