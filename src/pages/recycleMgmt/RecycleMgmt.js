import classnames from 'classnames';
import '../../app/common.less';
import './RecycleMgmt.less';
import SubPage from '../../components/subPage';
import Label from '../../components/label';
import Form from '../../components/form';
import Button from '../../components/button';
import { error, success } from '../../components/dialog';
import { Msg, request, throttle } from '../../util';

const { CheckBox } = Form;
class RecycleMgmt extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      volume: '0',
      affect_recycled: false,
      loaded: false,
    };
    this.errorMsgSuf = 'ErrorMsg';
  }

  componentDidMount() {
    const me = this;
    me.fetchData((res) => {
      const data = res.data;
      me.seedData = {};
      for (let i = 0, len = data.length; i < len; i += 1) {
        me.seedData[data[i].resource_type] = data[i];
      }
      me.setState({
        volume: me.seedData.volume.delay,
        loaded: true,
      });
    });
  }

  fetchData(callback) {
    request.get('/platformrecyclesetting/config')
      .then((res) => {
        if (res.ok) {
          callback(res);
        } else {
          error(res.msg);
        }
      }).catch(() => {
        error(Msg.FETCH_DATA_ERROR);
      });
  }

  handleChange(type, e) {
    const me = this;
    let value = e.target.value;
    value = parseInt(value);
    let valid = true;
    if (Number.isNaN(value) || value < 0 || value > 360) {
      valid = false;
    }
    me.setState({
      [`${type}`]: e.target.value,
      [`${type + me.errorMsgSuf}`]: valid ? '' : '输入0-360小时的整数，输入0表示关闭该类资源的回收功能',
    });
  }

  handleCheckBoxChange(e) {
    this.setState({
      affect_recycled: e.target.checked,
    });
  }

  handleSubmit() {
    const { volume, affect_recycled } = this.state;
    const me = this;
    if (!this.state[`volume${this.errorMsgSuf}`]) {
      // throttle
      if (!me.handler) {
        me.handler = setTimeout(() => {
          request.put('/platformrecyclesetting/config', { volume, affect_recycled })
            .then((res) => {
              clearTimeout(me.handler);
              me.handler = null;
              if (res.ok) {
                success(Msg.OPERATE_SUCCESS);
              } else {
                error(res.msg);
              }
            })
            .catch(() => {
              clearTimeout(me.handler);
              me.handler = null;
              error(Msg.OPERATE_ERROR);
            });
        }, 500);
      }
    } else {
      error(Msg.INVALID_INPUT);
    }
  }

  handleReset(type) {
    this.setState({
      [`${type}`]: `${this.seedData[type].default_delay}`,
      [`${type + this.errorMsgSuf}`]: '',
    });
  }

  render() {
    if(window.is_license_valid){
      const me = this;
      const { volume, affect_recycled, loaded } = this.state;

      return (
          <SubPage loaded={loaded} title="配置信息">
            <div className="neo-recycle-mgmt">
              <p className="neo-recycle-mgmt-tips">
                自动释放时间配置
                <span>（输入<a>0-360小时的整数</a>，定义各类资源的默认释放时间。输入0表示关闭该资源的回收功能）</span>
              </p>
              <div className="neo-recycle-mgmt-form-body">
                <div className="neo-recycle-mgmt-form-line-wrapper">
                  <div className="neo-recycle-mgmt-form-line">
                    <Label>云硬盘：</Label>
                    <input
                        type="number"
                        className={classnames({ 'neo-input-error': me.state[`volume${me.errorMsgSuf}`] })}
                        value={volume}
                        onChange={me.handleChange.bind(me, 'volume')}
                    />
                    <span>小时</span>
                    <Button type="cancel" onClick={me.handleReset.bind(me, 'volume')}>恢复默认值</Button>
                  </div>
                  <p
                      className="neo-form-line-err-msg"
                  >{me.state[`volume${me.errorMsgSuf}`]}</p>
                </div>
                <div className="neo-recycle-mgmt-form-checkbox">
                  <CheckBox
                      name="affect_recycled"
                      checked={affect_recycled}
                      onChange={me.handleCheckBoxChange.bind(me)}
                  />
                  <span>修改已回收资源的自动释放时间</span>
                </div>
                <Button className="neo-recycle-mgmt-submit" onClick={me.handleSubmit.bind(me)}>提交</Button>
              </div>
            </div>
          </SubPage>
      );
    } else {
      const me = this;
      const { volume, affect_recycled, loaded } = this.state;

      return (
          <SubPage loaded={loaded} title="配置信息">
            <div className="neo-recycle-mgmt">
              <p className="neo-recycle-mgmt-tips">
                自动释放时间配置
                <span>（输入<a>0-360小时的整数</a>，定义各类资源的默认释放时间。输入0表示关闭该资源的回收功能）</span>
              </p>
              <div className="neo-recycle-mgmt-form-body">
                <div className="neo-recycle-mgmt-form-line-wrapper">
                  <div className="neo-recycle-mgmt-form-line">
                    <Label>云硬盘：</Label>
                    <input
                        type="number"
                        className={classnames({ 'neo-input-error': me.state[`volume${me.errorMsgSuf}`] })}
                        value={volume}
                        onChange={me.handleChange.bind(me, 'volume')}
                    />
                    <span>小时</span>
                    <Button type="cancel" onClick={me.handleReset.bind(me, 'volume')}>恢复默认值</Button>
                  </div>
                  <p
                      className="neo-form-line-err-msg"
                  >{me.state[`volume${me.errorMsgSuf}`]}</p>
                </div>
                <div className="neo-recycle-mgmt-form-checkbox">
                  <CheckBox
                      name="affect_recycled"
                      checked={affect_recycled}
                      onChange={me.handleCheckBoxChange.bind(me)}
                  />
                  <span>修改已回收资源的自动释放时间</span>
                </div>
                <Button disabled="disabled" className="neo-recycle-mgmt-submit" onClick={me.handleSubmit.bind(me)}>提交</Button>
              </div>
            </div>
          </SubPage>
      );
    }
  }
}

export default RecycleMgmt;
