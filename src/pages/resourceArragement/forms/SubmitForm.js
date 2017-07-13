/**
 * Created by ssehacker on 2017/3/31.
 */

import classnames from 'classnames';
import Forms from './Form';
import Label from '../../../components/label';
import { pick, request } from '../../../util';

const { InputField, Select, Form } = Forms;
const { Option } = Select;

class SubmitForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      showRequired: false,
    };
  }

  componentWillMount() {

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
    const { showRequired } = this.state;
    const { name, timeout } = this.props;
    return (
      <div className={classnames({ 'neo-validated': showRequired })}>
        <Form
          className="neo-form"
          onValid={me.handleValid.bind(me)}
          onInvalid={me.handleInvalid.bind(me)}
          ref={form => { this.form = form; }}
        >
          <InputField
            name="name"
            label={i18n('Stack Name')}
            type="text"
            value={name || ''}
            placeholder={i18n('Please enter the stack name')}
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
            name="timeout"
            label={i18n('Timeout(min)')}
            type="number"
            value={timeout || '30'}
            placeholder={i18n('Please enter the timeout')}
            validations="gte:10"
            validationError={i18n('Please enter a number not less than 10')}
            required
          />
        </Form>
      </div>
    );
  }
}

export default SubmitForm;
