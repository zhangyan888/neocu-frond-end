/**
 * Created by ssehacker on 2017/5/10.
 */

import classnames from 'classnames';
import Forms from '../../../components/form2';
import Label from '../../../components/label';
import ResidualSpace from '../../../components/residualSpace';
import {pick, request, handleResError} from '../../../util';

import FormStatic from '../../../components/form';
const {RadioButtonList} = FormStatic;
const { InputField, Select, Form, Input,InputCustom} = Forms;
const {Option} = Select;

class AutoSnapshootForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: {maxHeight: 200, overflow: 'auto'},
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      showRequired: false,
      period: props.period === 'day' ? 'day' : 'week',
      type: (props.type && String(props.type)) || '1',
      status: props.status ? 'on' : 'off',
    };
  }

  handleChange(type, e) {
    let value;
    if (typeof e === 'object') {
      value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    } else {
      value = e;
    }
    this.setState({
      [type]: value,
    });
  }

  getForm() {
    const { period, type, status } = this.state;
    return {
      ...pick(this.state, 'period'),
      status: status === 'on',
      type: period === 'week' ? parseInt(type) : undefined,
      ...this.form.getModel(),
    };
  }  

  showRequired() {
    this.setState({
      showRequired: true,
    });
  }

  isValid() {
    return this.state.valid;
  }

  handleValid() {
    this.setState({
      valid: true,
    });
  }

  handleInvalid() {
    this.setState({
      valid: false,
    });
  }

  getExecuteCycleOption() {
    return [
      {
        id: '1',
        name: '星期一',
      },
      {
        id: '2',
        name: '星期二',
      },
      {
        id: '3',
        name: '星期三',
      },
      {
        id: '4',
        name: '星期四',
      },
      {
        id: '5',
        name: '星期五',
      },
      {
        id: '6',
        name: '星期六',
      },
      {
        id: '7',
        name: '星期日',
      },
    ];
  }

  render() {
    const me = this;
    const { type, showRequired, period, status } = this.state;
    const { maxCount, hour, minute } = this.props;
    const listItems = [{ value: 'day', text: '每天' }, { value: 'week', text: '每周' }];
    const statusEnume = [{ value: 'on', text: '开' }, { value: 'off', text: '关' }];

    const typeOption = me.getExecuteCycleOption();
    return (
      <div className={classnames({ 'neo-form-storage': true, 'neo-validated': showRequired })}>

        <Form
          name="自动快照"
          className="neo-form"
          onValid={me.handleValid.bind(me)}
          onInvalid={me.handleInvalid.bind(me)}
          ref={form => { this.form = form; }}
        >
          <div className="neo-form-line"> 
              <Label >执行时间类型</Label>     
            <RadioButtonList
              name="period"
              listItems={listItems}
              value={period || 'day'}
              onChange={me.handleChange.bind(me, 'period')}
            />
          </div>
          {period === 'week' ?
            <div className="neo-form-line">
              <Label>执行周期</Label>
              <Select
                {...AutoSnapshootForm.selectCommonConfig}
                value={type}
                onChange={me.handleChange.bind(me, 'type')}
              >
                {
                  typeOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
                }
              </Select>
            </div>
             : null}    
          <div className="neo-form-line">
            <Label required>具体时间</Label>
            <div className="neo-form-time">
              <InputCustom
                name="hour"
                type="number"
                value={hour}
                placeholder={i18n('0-23')}
                validations={{
                  gte:0,
                  lte: 23,
                }}
                validationErrors={{
                  gte: i18n('最小为0的数字'),
                  lte: i18n('最小为23的数字'),
                }}
               required
              />
              <span className="neo-form-text">时</span>
            </div>
            <div className="neo-form-time">
              <InputCustom
                name="minute"
                type="number"
                value={minute}
                placeholder={i18n('0-59')}
                validations={{
                  gte: 0,
                  lte: 59,
                }}
                validationErrors={{
                  gte: i18n('最小为0的数字'),
                  lte: i18n('最小为59的数字'),
                }}
                required
              />
              <span className="neo-form-text">分</span>
            </div>
          </div>
          <InputField
            name="maxCount"
            label="最大保留个数"
            type="number"
            value={maxCount || 10}
            placeholder="请输入数字"
            validationError={i18n('请输入数字')}
            required
          />
          <div className="neo-form-line">
            <Label>状态</Label>
            <RadioButtonList
              name="statictype"
              listItems={statusEnume}
              value={status}
              onChange={me.handleChange.bind(me, 'status')}
            />
          </div>
        </Form>
      </div>
    );
  }
}

export default AutoSnapshootForm;
