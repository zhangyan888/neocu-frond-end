/**
 * Created by ssehacker on 2017/5/10.
 */

import classnames from 'classnames';
import Forms from '../../../components/form2';
import Label from '../../../components/label';
import { pick, request, handleResError } from '../../../util';

const { Select, Form } = Forms;
const { Option } = Select;

class ManageConnectionForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    this.state = {
      valid: true,
      instance: props.instance || '',
      instanceOption: props.instanceOption || [],
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
      ...pick(this.state, 'instance'),
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
    const { showRequired, instanceOption, instance } = this.state;
    return (
      <div className={classnames({ 'neo-form-storage': true, 'neo-validated': showRequired })}>
        <Form
          className="neo-form"
          onValid={me.handleValid.bind(me)}
          onInvalid={me.handleInvalid.bind(me)}
          ref={form => { this.form = form; }}
        >
          <div className="neo-form-line">
            <Label required>连接到云主机</Label>
            <Select
              {...ManageConnectionForm.selectCommonConfig}
              value={instance}
              onChange={me.handleChange.bind(me, 'instance')}
            >
              {
                instanceOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
              }
            </Select>
          </div>
        </Form>
      </div>
    );
  }
}

export default ManageConnectionForm;
