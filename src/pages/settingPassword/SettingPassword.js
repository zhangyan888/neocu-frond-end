import '../../app/common.less';
import './SettingPassword.less';
import SubPage from '../../components/subPage';
import { error, success } from '../../components/dialog';
import Label from '../../components/label';
import Form from '../../components/form';
import Button from '../../components/button';
import { request, Msg, throttle } from '../../util';

const { Input } = Form;
const i18n = top.gettext;

class SettingPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      currentPwd: '',
      newPwd: '',
      newPwd2: '',
      errMsg1: '',
      errMsg2: '',
      errMsg3: '',
    };
    this.init();
  }

  init() {
    this.changePassword = throttle((currentPwd, newPwd) => {
      request.post('/project/settings/password/', {
        old_pwd: currentPwd,
        new_pwd: newPwd,
      }).then((res) => {
        if (res.ok) {
          success(res.msg || Msg.OPERATE_SUCCESS);
          setTimeout(() => {
            window.location.href = res.data;
          }, 3000);
        } else {
          error(res.msg);
        }
      }).catch(() => {
        error(Msg.OPERATE_ERROR);
      });
    });
  }
  validCheck() {
    const { currentPwd, newPwd, newPwd2 } = this.state;
    let errMsg1;
    let errMsg2;
    let errMsg3;
    if (currentPwd === '') {
      errMsg1 = i18n('Please input your password');
    }

    if (newPwd !== newPwd2) {
      errMsg3 = i18n('The password entered twice is inconsistent');
    }

    if (currentPwd === newPwd) {
      errMsg2 = i18n('The new password can not be the same as the old password');
    }

    if (newPwd.length < 6) {
      errMsg2 = i18n('The minimum length of the password is 6 digits');
    }
    this.setState({
      errMsg1,
      errMsg2,
      errMsg3,
    });

    const valid = !errMsg1 && !errMsg2 && !errMsg3;
    return valid;
  }

  handleSubmit() {
    const { newPwd, currentPwd } = this.state;
    if (this.validCheck()) {
      // success
      this.changePassword(currentPwd, newPwd);
    }
  }

  handleChange(type, e) {
    this.setState({
      [`${type}`]: e.target.value,
    });
  }

  render() {
    const { loaded, currentPwd, newPwd, newPwd2, errMsg1, errMsg2, errMsg3 } = this.state;
    const me = this;
    const { handleSubmit, handleChange } = me;

    return (
      <SubPage loaded={loaded} title={i18n('Change password')}>
        <div className="neo-settingPassword">
          <div className="neo-form">
            <div className="neo-form-line">
              <Label required>{i18n('Old password')}</Label>
              <Input type="password" value={currentPwd} onChange={handleChange.bind(me, 'currentPwd')} />
            </div>
            <div className="neo-form-line neo-line-err-msg">
              <p>{errMsg1}</p>
            </div>
            <div className="neo-form-line">
              <Label required>{i18n('New password')}</Label>
              <Input
                type="password"
                value={newPwd}
                onChange={handleChange.bind(me, 'newPwd')}
              />
            </div>
            <div className="neo-form-line neo-line-err-msg">
              <p>{errMsg2}</p>
            </div>
            <div className="neo-form-line">
              <Label required>{i18n('Confirm new password')}</Label>
              <Input
                type="password"
                value={newPwd2}
                onChange={handleChange.bind(me, 'newPwd2')}
              />
            </div>
            <div className="neo-form-line neo-line-err-msg">
              <p>{errMsg3}</p>
            </div>
          </div>
          <div className="neo-options">
            <Button type="normal" onClick={handleSubmit.bind(me)}>{i18n('Update password')}</Button>
          </div>
        </div>
      </SubPage>
    );
  }
}

export default SettingPassword;
