import './SettingLogin.less';
import Label from '../../components/label';
import Select from '../../components/select';
// import '../../app/common.less';
import Button from '../../components/button';
import { request, Msg } from '../../util';
import { error, success } from '../../components/dialog';

const { Option } = Select;

class SettingLogin extends React.Component {

  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    style: { width: 200 },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.baseUrl = '/platformadmin/login_settings/config';
    this.state = {
      timeout: '15',
      maxFailureCount: '5',
      lockedTime: '1',
      errorMsg: '',
      loaded: false,
    };
  }

  fetchData(callback) {
    const that = this;
    request.get(this.baseUrl)
      .then((res) => {
        if (res.ok) {
          callback(res.data);
        } else {
          that.setState({
            errorMsg: res.msg,
            loaded: true,
          });
        }
      })
      .catch(() => {
        that.setState({
          errorMsg: '获取数据失败',
          loaded: true,
        });
      });
  }

  componentWillMount() {
    const that = this;
    this.fetchData((res) => {
      if (Object.prototype.toString.call(res) === '[object String]') {
        res = JSON.parse(res);
      }
      that.setState({
        timeout: res.timeout,
        maxFailureCount: res.maxFailureCount,
        lockedTime: res.lockedTime,
        loaded: true,
      });
    });
  }

  handleChange(fieldName, e) {
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

  renderTimeoutSelect() {
    const me = this;
    const { timeout } = this.state;
    const config = [
      {
        name: '15',
        value: '15分钟',
      },
      {
        name: '30',
        value: '30分钟',
      },
      {
        name: '60',
        value: '1小时',
      },
    ];
    return (
      <Select
        {...SettingLogin.selectCommonConfig}
        value={timeout}
        onChange={this.handleChange.bind(me, 'timeout')}
      >
        {
          config.map(item => (
            <Option key={String(item.name)}>{item.value}</Option>
          ))
        }
      </Select>
    );
  }

  renderLoginFailureCountSelect() {
    const me = this;
    const { maxFailureCount } = this.state;
    const config = [
      {
        name: '5',
        value: '5次',
      },
      {
        name: '10',
        value: '10次',
      },
      {
        name: '15',
        value: '15次',
      },
    ];
    return (
      <Select
        {...SettingLogin.selectCommonConfig}
        value={maxFailureCount}
        onChange={this.handleChange.bind(me, 'maxFailureCount')}
      >
        {
          config.map(item => (
            <Option key={String(item.name)}>{item.value}</Option>
          ))
        }
      </Select>
    );
  }

  renderLockedTimeSelect() {
    const me = this;
    const { lockedTime } = this.state;
    const config = [
      {
        name: '1',
        value: '1小时',
      },
      {
        name: '5',
        value: '5小时',
      },
      {
        name: '24',
        value: '1天',
      },
    ];
    return (
      <Select
        {...SettingLogin.selectCommonConfig}
        value={lockedTime}
        onChange={this.handleChange.bind(me, 'lockedTime')}
      >
        {
          config.map(item => (
            <Option key={String(item.name)}>{item.value}</Option>
          ))
        }
      </Select>
    );
  }

  handleSubmit() {
    const { timeout, maxFailureCount, lockedTime } = this.state;
    request.put(this.baseUrl, { timeout, maxFailureCount, lockedTime })
      .then((res) => {
        if (res.ok) {
          success('更新成功!');
        } else {
          error(res.msg);
        }
      })
      .catch(() => {
        error(Msg.OPERATE_ERROR);
      });
  }

  handleResetDefault() {
    const defaultConfig = {
      timeout: '60',
      maxFailureCount: '5',
      lockedTime: '1',
    };
    const me = this;
    request.put(this.baseUrl, defaultConfig)
      .then((res) => {
        if (res.ok) {
          me.setState(defaultConfig);
          success('重置成功!');
        } else {
          error(res.msg);
        }
      })
      .catch(() => {
        error(Msg.OPERATE_ERROR);
      });
  }

  render() {
    const me = this;
    const { errorMsg, loaded } = this.state;
    if (!loaded) {
      return null;
    }
    if (errorMsg) {
      return (
        <div className="neo-settingLogin">
          <div className="neo-settingLogin-err-msg">内部错误: {errorMsg}</div>
        </div>
      );
    }
    return (
      <div className="neo-settingLogin">
        <div className="neo-form">
          <div className="neo-form-line">
            <Label>可登录时长</Label>
            {me.renderTimeoutSelect()}
          </div>
          <div className="neo-form-line">
            <Label>登录失败次数</Label>
            {me.renderLoginFailureCountSelect()}
          </div>
          <div className="neo-form-line">
            <Label>用户锁定时间</Label>
            {me.renderLockedTimeSelect()}
          </div>
        </div>
        <div className="neo-options">
          <Button type="cancel" onClick={me.handleResetDefault.bind(me)}>恢复默认</Button>
          <Button type="normal" onClick={me.handleSubmit.bind(me)}>提交</Button>
        </div>
      </div>
    );
  }
}

export default SettingLogin;
