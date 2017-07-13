/**
 * Created by ssehacker on 2017/3/22.
 */
import classnames from 'classnames';
import Forms from './Form';
import Label from '../../../components/label';
import { pick, request } from '../../../util';
import { util } from '../widgets';

const { InputField, Select, Form } = Forms;
const { Option } = Select;

class VMForm extends React.Component {
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
      system: props.system || '',
      flavor: props.flavor || '',
      systemOption: [],
      flavorsOption: [],
    };
  }

  componentWillMount() {
    Promise.all([request.get(`/api/glance/f_images/?projectId=${window.projectId}`), request.get('/api/nova/flavors/')])
      .then((res) => {
        console.log(res);
        this.setState({
          systemOption: res[0].items,
          flavorsOption: res[1].items,
          system: this.state.system || res[0].items[0].id,
          flavor: this.state.flavor || res[1].items[0].id,
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
      ...pick(this.state, 'system', 'flavor'),
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
    // console.log('valid...');
    this.setState({
      valid: true,
    });
  }

  handleInvalid() {
    // console.log('invalid...');
    this.setState({
      valid: false,
    });
  }

  render() {
    const me = this;
    const { system, flavor, showRequired, systemOption, flavorsOption } = this.state;
    const { name, username, password, password2 } = this.props;
    return (
      <div className={classnames({ 'neo-form-host': true, 'neo-validated': showRequired })}>
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
            <Label required>{i18n('Operating System')}</Label>
            <Select
              {...VMForm.selectCommonConfig}
              value={system}
              onChange={me.handleChange.bind(me, 'system')}
            >
              {
                systemOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
              }
            </Select>
          </div>
          <div className="neo-form-line">
            <Label required>{i18n('Instance Type')}</Label>
            <Select
              {...VMForm.selectCommonConfig}
              value={flavor}
              onChange={me.handleChange.bind(me, 'flavor')}
            >
              {
                flavorsOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
              }
            </Select>
          </div>
          <InputField
            label={i18n('User Name')}
            name="username"
            className="neo-hidden"
            type="text"
            value={username || 'root'}
            disabled
            required
          />
          <InputField
            label={i18n('Set Admin Password')}
            name="password"
            type="password"
            placeholder={i18n('Password length is not less than five')}
            value={password || ''}
            validations="minLength:5"
            validationError={i18n('Password length is not less than five')}
            required
          />
          <InputField
            label={i18n('Confirm Password')}
            name="password2"
            type="password"
            placeholder={i18n('Please enter the password again')}
            value={password2 || ''}
            validations="equalsField:password"
            validationError={i18n('Entered passwords differ')}
            required
          />
        </Form>
      </div>
    );
  }
}

export default VMForm;
