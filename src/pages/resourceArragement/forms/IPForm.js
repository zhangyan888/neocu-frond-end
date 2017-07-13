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

class IPForm extends React.Component {
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
      ext_net_id: props.ext_net_id || '',
      extNetIdOption: [],
    };
  }

  componentWillMount() {
    request.get('/api/neutron/flat_networks/')
      .then((res) => {
        this.setState({
          extNetIdOption: res.items,
          ext_net_id: this.state.ext_net_id || res.items[0].id,
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
      ...pick(this.state, 'ext_net_id'),
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
    const { ext_net_id, showRequired, extNetIdOption } = this.state;
    const { bandwidth } = this.props;
    return (
      <div className={classnames({ 'neo-form-ip': true, 'neo-validated': showRequired })}>
        <Form
          className="neo-form"
          onValid={me.handleValid.bind(me)}
          onInvalid={me.handleInvalid.bind(me)}
          ref={form => { this.form = form; }}
        >
          <div className="neo-form-line">
            <Label required>{i18n('External Network')}</Label>
            <Select
              {...IPForm.selectCommonConfig}
              value={ext_net_id}
              onChange={me.handleChange.bind(me, 'ext_net_id')}
            >
              {
                extNetIdOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
              }
            </Select>
          </div>
          <InputField
            name="bandwidth"
            label={i18n('Band Width')}
            type="number"
            value={bandwidth || ''}
            placeholder={i18n('Unit is Kbps')}
            validations="gte:1"
            validationError={i18n('Please enter a number not less than 1')}
            required
          />
        </Form>
      </div>
    );
  }
}

export default IPForm;
