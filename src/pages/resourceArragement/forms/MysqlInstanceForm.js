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

class MysqlInstanceForm extends React.Component {
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
      flavor: props.flavor || '',
      flavorOption: [],
    };
  }

  componentWillMount() {
    const { parentFlavor } = this.props;
    request.get(`/api/trove/filter_flavors/${parentFlavor}/`)
      .then((res) => {
        const flavors = res;
        this.setState({
          flavorOption: flavors,
          flavor: this.state.flavor || flavors[0].id,
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
    const { flavor } = this.state;

    const { name } = this.form.getModel();
    const props = pick(this.props, 'size', 'volume_type', 'networks', 'datastore_version',
      'is_ha', 'datastoreVersionId', 'datastore_version', 'extra', 'parentFlavor');
    return {
      ...props,
      name,
      flavor,
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
    const { flavor, showRequired, flavorOption } = this.state;
    const { name, size, datastore_version, extra, networks } = this.props;
    return (
      <div className={classnames({ 'neo-form-mysql-instance': true, 'neo-validated': showRequired })}>
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
            <Label required>{i18n('Host Flavor')}</Label>
            <Select
              {...MysqlInstanceForm.selectCommonConfig}
              value={flavor}
              onChange={me.handleChange.bind(me, 'flavor')}
            >
              {
                flavorOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
              }
            </Select>
          </div>
          <InputField
            name="size"
            label={i18n('Disk size (GB)')}
            type="number"
            value={size}
            disabled
            required
          />
          <InputField
            name="volume_type"
            label={i18n('Volume Type')}
            type="text"
            value={extra.volumeTypeText}
            disabled
            required
          />
          <InputField
            name="networks"
            label={i18n('Network')}
            type="text"
            value={networks[0].name}
            disabled
            required
          />
          <InputField
            name="datastore_version"
            label={i18n('Database Version')}
            type="text"
            value={datastore_version}
            disabled
            required
          />
          <InputField
            name="is_ha"
            label={i18n('HA Mode','Orchestrates')}
            type="text"
            value={extra.isHaText}
            disabled
            required
          />
        </Form>
      </div>
    );
  }
}

export default MysqlInstanceForm;
