/**
 * Created by ssehacker on 2016/10/19.
 */
import classnames from 'classnames';
import Button from '../../components/button';
import './Dialog.less';

class Dialog extends React.Component {
  static defaultProps = {
    title: 'Dialog title',
    confirmTitle: i18n('OK','Orchestrates'),
    // abortTitle: '取消',
    className: '',
    style: {},
  };

  static propTypes = {
    title: React.PropTypes.string,
    confirm: React.PropTypes.func,
    abort: React.PropTypes.func,
    confirmTitle: React.PropTypes.string,
    abortTitle: React.PropTypes.string,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
  };

  abort() {
    if (this.props.abort) {
      this.props.abort.call(this);
    }
  }

  confirm() {
    if (this.props.confirm) {
      this.props.confirm.call(this);
    }
  }

  render() {
    const t = this;
    const children = React.cloneElement(
      t.props.children,
      {
        ref: (node) => { this.child = node; },
      });
    return (
      <div
        ref={(node) => { this.dialog = node; }}
        className={classnames('neo-ui-dialog', this.props.className)}
        style={t.props.style}
      >
        <h3>{this.props.title}</h3>
        <div className="neo-ui-dialog-content">
          {children}
        </div>
        <div className="neo-ui-dialog-btn">
          <Button className={classnames({ 'neo-hidden': !this.props.abortTitle })} onClick={t.abort.bind(t)} type="cancel">
            {this.props.abortTitle}
          </Button>
          <Button onClick={t.confirm.bind(t)} type="ok">{this.props.confirmTitle}</Button>
        </div>
      </div>
    );
  }
}


function dialog(element, props) {
  let wrapper = document.createElement('div');
  wrapper.className = 'neo-ui-dialog-wrap';

  wrapper.style.height = '100vh';
  wrapper.style.width = '100vw';

  wrapper = document.body.appendChild(wrapper);

  const cleanup = function () {
    ReactDOM.unmountComponentAtNode(wrapper);
    setTimeout(() => {
      wrapper.parentNode.removeChild(wrapper);
    }, 0);
  };
  const abort = props.abort;
  props.abort = function () {
    if (abort) {
      abort.call(this);
    }
    cleanup();
  };

  const confirm = props.confirm;
  props.confirm = function () {
    if (!confirm) {
      cleanup();
      return;
    }
    if (confirm.call(this) !== false) {
      cleanup();
    }
  };

  const dialogEle = <Dialog {...props}>{element}</Dialog>;

  ReactDOM.render(dialogEle, wrapper);
}

export default dialog;
