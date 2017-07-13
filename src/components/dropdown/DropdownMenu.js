/**
 * Created on 2017/05/06.
 */
import classnames from 'classnames';
import Button from '../button';
import './Dropdown.less';

class DropdownMenu extends React.Component {
    static propTypes = {
        trigger: React.PropTypes.string,
        title: React.PropTypes.string,
        className: React.PropTypes.string,
        isFlag: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        isButton: React.PropTypes.bool,        
        collapse: React.PropTypes.func,
        dropdown: React.PropTypes.func,
        dropup: React.PropTypes.func,
        toggle: React.PropTypes.func,
        size: React.PropTypes.string,
        type: React.PropTypes.string,
        placement: React.PropTypes.string,
    };

  static defaultProps = {
    isButton: true,
    type: "default",
    placement: 'bottomLeft',
  };

  handleClick(e) {
      if (this.props.trigger !== "hover") {
          this.props.toggle(e);
      }
  }

  handleEnter(e) {
      if (this.props.trigger == "hover") {
          this.props.dropdown(e);
      }
  }

  handleLeave(e) {
      if (this.props.trigger == "hover") {
          this.props.dropup(e);
      }
  }

    renderTittle () {
        const {type, title, disabled, isButton, size, isFlag, dropdown} = this.props;
        const icon = isFlag ? 'icon-up' : 'icon-down';
        
        if (isButton) {
            return (
                <Button type={type} disabled={disabled} size={size} onClick={this.handleClick.bind(this)} >
                    {title}
                    { isFlag ?
                        <i className="iconfont icon-up"/>
                        :
                        <i className="iconfont icon-down"/>
                    }
                </Button>
            )
        }
        return (
            <a onClick={dropdown}>
                {title}
                { isFlag ?
                    <i className="iconfont icon-up"/>
                    :
                    <i className="iconfont icon-down"/>
                }
            </a>
        )
    }

    render () {
        const {title, options, className, style, isFlag, placement} = this.props;
        const dropdownclass = isFlag ? { 'neo-dropdown': true, 'neo-open': true, [`${className}`]: !!className } : { 'neo-dropdown': true, [`${className}`]: !!className };
        return (
            <div
                className={classnames(dropdownclass)}
                onMouseEnter={this.handleEnter.bind(this)}
                onMouseLeave={this.handleLeave.bind(this)}
            >
                {this.renderTittle()}
                { 
                    // this.state.isFlag ? <ul className="neo-dropdownMenu">{this.props.children}</ul> : null       
                    <ul className={classnames({"neo-dropdownMenu": true, [`neo-${placement}`]: !!placement})} >{this.props.children}</ul>             
                }

            </div>
        )
    }
}

export default DropdownMenu;