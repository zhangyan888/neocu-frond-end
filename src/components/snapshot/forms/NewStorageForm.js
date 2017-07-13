/**
 * Created by ssehacker on 2017/5/10.
 */

import classnames from 'classnames';
import Forms from '../../../components/form2';
import Label from '../../../components/label';
import { pick, request, handleResError } from '../../../util';

const { InputField, Select, Form, Input } = Forms;
const { Option } = Select;

class NewStorageForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      showRequired: false,
      desc: props.desc || '',
      type: props.type || '',
      shared: !!props.shared,
      typeOption: [],
    };
  }

  componentWillMount() {
    /*request.get('/api/neutron/flat_networks/')
      .then((res) => {
        this.setState({
          typeOption: res.items,
          type: this.state.type || res.items[0].id,
        });
      })
      .catch(handleResError);*/
  }

  handleChange(type, e) {
    let value;
    if (typeof e === 'object') {
      value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    } else {
      value = e;
    }
    this.setState({
      [type]: value,
    });
  }

  getForm() {
    return {
      ...pick(this.state, 'type', 'desc', 'shared'),
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

  render() {
    const me = this;
    const { type, showRequired, typeOption, desc, shared } = this.state;
    const { size, name } = this.props;
    return (
      <div className={classnames({ 'neo-form-storage': true, 'neo-validated': showRequired })}>
        <Form
          className="neo-form"
          onValid={me.handleValid.bind(me)}
          onInvalid={me.handleInvalid.bind(me)}
          ref={form => { this.form = form; }}
        >
          <InputField
            name="name"
            label={i18n('Name')}
            type="text"
            value={name || ''}
            placeholder={i18n('Please enter a name')}
            validations={{
              maxLength: 20,
              minLength: 2,
              isName: true,
            }}
            validationErrors={{
              maxLength: i18n('Please enter 2-20 characters, support the English case, numbers, and the underscore Chinese'),
              minLength: i18n('Please enter 2-20 characters, support the English case, numbers, and the underscore Chinese'),
              isName: i18n('Please enter 2-20 characters, support the English case, numbers, and the underscore Chinese'),
            }}
            required
          />
          <div className="neo-form-line">
            <Label>描述</Label>
            <textarea className="neo-textarea" value={desc} onChange={me.handleChange.bind(me, 'desc')}>{desc}</textarea>
          </div>
          <div className="neo-form-line">
            <Label>使用快照作为源</Label>
            <Select
              {...NewStorageForm.selectCommonConfig}
              value={type}
              onChange={me.handleChange.bind(me, 'type')}
            >
              {
                typeOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
              }
            </Select>
          </div>
          <InputField
            name="size"
            label="大小（GB）"
            type="number"
            value={size || 1}
            placeholder="单位是GB"
            validations="gte:1"
            validationError={i18n('Please enter a number not less than 1')}
            required
          />
          <div className="neo-form-line neo-form-checkbox">
            <Input type="checkbox" checked={shared} onChange={me.handleChange.bind(me, 'shared')} />
            <Label>共享盘</Label>
            <p className={classnames({ 'neo-shared-tips': true, 'neo-hidden': !shared })}>
              注意：共享盘挂载到多台云主机时，需要在云主机上安装OCFS，GPFS等专用分布式文件系统才可以并行读写。
            </p>
          </div>
        </Form>
      </div>
    );
  }
}

export default NewStorageForm;
