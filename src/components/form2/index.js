/**
 * Created by ssehacker on 2017/3/29.
 */
import Formsy from 'formsy-react';
import classnames from 'classnames';
import Form from '../form';
import Label from '../label';

const hoc = Formsy.HOC;
const { Input, Select } = Form;

Formsy.addValidationRule('gt', (values, value, num) => value > num);

Formsy.addValidationRule('gte', (values, value, num) => value >= num);

Formsy.addValidationRule('lt', (values, value, num) => value < num);

Formsy.addValidationRule('lte', (values, value, num) => value <= num);

Formsy.addValidationRule('isIn', (values, value, array) => array.indexOf(value) >= 0);

Formsy.addValidationRule('isName', (values, value, array) => {
  const reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/g;
  return reg.test(value);
});

Formsy.addValidationRule('isIP', (values, value) => {
  if (value === '0.0.0.0/0' || value === '') {
    return true;
  }
  const ipPort = value.split('/');
  let b = false;
  if (ipPort.length === 2) {
    b = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(ipPort[0]);
    if ((b && window.parseInt(ipPort[1]) > 0) && window.parseInt(ipPort[1]) <= 65535) {
      b = true;
    } else {
      b = false;
    }
  }
  return b;
});


class InputHoc extends React.Component {
  changeValue(event) {
    this.props.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
  }

  render() {
    const me = this;
    const { disabled } = this.props;
    const className = classnames({
      'neo-form-line': true,
      [this.props.className]: !!this.props.className,
      required: this.props.showRequired(),
      error: this.props.showError(),
    });
    const errorMessage = this.props.getErrorMessage();
    const disable = disabled ? { disabled: 'disabled' } : '';

    return (
      <div className={className}>
        <Label required={me.props.isRequired()}>{me.props.label}</Label>
        <div className="neo-form-group">
          <Input
            type={me.props.type || 'text'}
            onChange={me.changeValue.bind(me)}
            placeholder={me.props.placeholder || ''}
            value={me.props.getValue()}
            {...disable}
            checked={me.props.type === 'checkbox' && me.props.getValue() ? 'checked' : null}
          />
          <span className="neo-validation-error">{errorMessage}</span>
        </div>
      </div>
    );
  }
}

class InputCustom extends React.Component {
  changeValue(event) {
    this.props.setValue(event.currentTarget['value']);
  }
  render() {
    const me = this;
    const { disabled } = this.props;
    const className = classnames({
      'neo-form-line': true,
      [this.props.className]: !!this.props.className,
      required: this.props.showRequired(),
      error: this.props.showError(),
    });
    const errorMessage = this.props.getErrorMessage();
    const disable = disabled ? { disabled: 'disabled' } : '';
    return (
      <div className={className}>
        <div className="neo-form-group">
          <Input
            type={'text'}
            onChange={me.changeValue.bind(me)}
            placeholder={me.props.placeholder || ''}
            value={me.props.getValue()}
            {...disable}
          />
          <span className="neo-validation-error">{errorMessage}</span>
        </div>
      </div>
    );
  }
}
export default {
  Form: Formsy.Form,
  InputField: hoc(InputHoc),
  Input,
  Select,
  InputCustom:hoc(InputCustom),
};
