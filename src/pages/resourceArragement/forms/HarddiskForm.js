/**
 * Created by ssehacker on 2017/3/31.
 */

import classnames from 'classnames';
import Forms from './Form';
import Label from '../../../components/label';
import { pick, request } from '../../../util';
import { util } from '../widgets';

const { InputField, Select, Form } = Forms;
const { Option } = Select;

class HarddiskForm extends React.Component {
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
      volume_type: props.volume_type || '',
      volumeTypeOption: [],
    };
  }

  componentWillMount() {
    request.get('/api/cinder/volumetypes/')
      .then((res) => {
        this.setState({
          volumeTypeOption: [
            {
              id: 'none',
              name: i18n('Select an Option'),
            },
            ...res.items,
          ],
          volume_type: this.state.volume_type || 'none',
        });
      })
      .catch(util.handleResError);
  }

  handleChange(type, e) {
    let value;
    if (typeof e === 'object') {
      value = e.target.value;
    } else {
      value = e;
    }
    this.setState({
      [type]: value,
    });
  }

  getForm() {
    return {
      ...pick(this.state, 'volume_type'),
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
    const { volume_type, showRequired, volumeTypeOption } = this.state;
    const { name, volume } = this.props;
    return (
      <div className={classnames({ 'neo-form-harddisk': true, 'neo-validated': showRequired })}>
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
          <InputField
            name="volume"
            label={i18n('Capacity')}
            type="number"
            value={volume || ''}
            placeholder={i18n('Unit is GB')}
            validations="gt:0"
            validationError={i18n('Please enter number greater than zero')}
            required
          />
          <div className="neo-form-line">
            <Label>{i18n('Volume Type')}</Label>
            <Select
              {...HarddiskForm.selectCommonConfig}
              value={volume_type}
              onChange={me.handleChange.bind(me, 'volume_type')}
            >
              {
                volumeTypeOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
              }
            </Select>
          </div>
        </Form>
      </div>
    );
  }
}

export default HarddiskForm;
