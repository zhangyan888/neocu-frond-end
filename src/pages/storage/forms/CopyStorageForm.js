/**
 * Created by ssehacker on 2017/5/10.
 */

import classnames from 'classnames';
import Forms from '../../../components/form2';
import Label from '../../../components/label';
import { pick, request, handleResError } from '../../../util';
import ResidualSpace from '../../../components/residualSpace';

const { InputField, Select, Form, Input } = Forms;
const { Option } = Select;

class CopyStorageForm extends React.Component {
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
      description: props.description || '',
      source: props.source || '',
      shared: !!props.shared,
      sourceOption: props.sourceOption || [],
      volumeTotal: props.volumeTotal,
      volumeUsed: props.volumeUsed,
      volumeTotalCount: props.volumeTotalCount,
      volumeUsedCount: props.volumeUsedCount,
    };
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
      ...pick(this.state, 'source', 'description', 'shared'),
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
    const { source, showRequired, sourceOption, description, shared, volumeTotal, volumeUsed, volumeTotalCount, volumeUsedCount } = this.state;
    const { size, name } = this.props;
    const rs_data = {
      name: '云硬盘限度',
      list: [
        {
          id: 0,
          name: '云硬盘容量',
          total: volumeTotal,
          unit: 'GB',
          used: volumeUsed,
          newData: 0,
        },
        {
          id: 1,
          name: '云硬盘数量',
          total: volumeTotalCount,
          unit: '',
          used: volumeUsedCount,
          newData: 0,
        },
      ],
    };
    return (
      <div className={classnames({ 'neo-form-storage': true, 'neo-validated': showRequired })}>
        <ResidualSpace data={rs_data} />
        <Form
          className="neo-form"
          onValid={me.handleValid.bind(me)}
          onInvalid={me.handleInvalid.bind(me)}
          ref={form => { this.form = form; }}
        >
          <InputField
            name="name"
            label={i18n('云硬盘名称')}
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
            <textarea className="neo-textarea" value={description} onChange={me.handleChange.bind(me, 'description')}>{description}</textarea>
          </div>
          <div className="neo-form-line neo-hidden">
            <Label>将云硬盘作为源</Label>
            <Select
              {...CopyStorageForm.selectCommonConfig}
              value={source}
              onChange={me.handleChange.bind(me, 'source')}
            >
              {
                sourceOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
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

export default CopyStorageForm;
