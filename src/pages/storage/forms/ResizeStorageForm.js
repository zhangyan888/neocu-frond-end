/**
 * Created by ssehacker on 2017/5/10.
 */

import classnames from 'classnames';
import Forms from '../../../components/form2';
import Label from '../../../components/label';
import ResidualSpace from '../../../components/residualSpace';
import Tooltip from '../../../components/tooltip';
import { pick, request, handleResError } from '../../../util';

const { InputField, Select, Form, Input } = Forms;
const { Option } = Select;

class ResizeStorageForm extends React.Component {
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
      newSize: '',
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

  handleChange(type, value) {
    // let value;
    this.setState({
      [type]: value,
    });
  }

  getForm() {
    return {
      ...pick(this.state),
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
    const { newSize, showRequired, valid } = this.state;
    const { size, name } = this.props;
    const newData = newSize == "" ? 0 : newSize;
    const rs_data = {
      name: '云硬盘限度',
      list: [
        {
          id: 0,
          name: '云硬盘容量',
          total: me.props.totalCount || 1,
          unit: 'GB',
          used: me.props.usedCount || 1,
          newData: newData,
        }
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
            label={i18n('Name')}
            type="text"
            value={name || ''}
            disabled
          />
          <InputField
            name="currentSize"
            label="当前大小（GB）"
            type="number"
            value={size || 0}
            disabled
          />
          <InputField
            name="size"
            label="新大小（GB）"
            type="number"
            value={newSize}
            validations="gte:1"
            validationError={i18n('Please enter a number not less than 1')}
            setValue={me.handleChange.bind(me, 'newSize')}
            required
          />
          
        </Form>
      </div>
    );
  }
}

export default ResizeStorageForm;
