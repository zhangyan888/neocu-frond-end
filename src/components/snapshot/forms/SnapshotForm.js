/**
 * Created by ssehacker on 2017/5/10.
 */

import classnames from 'classnames';
import Forms from '../../../components/form2';
import Label from '../../../components/label';
import ResidualSpace from '../../../components/residualSpace';
import { pick, request, handleResError } from '../../../util';
import service from '../../../services';
import { error } from '../../../components/dialog';

const { InputField, Select, Form, Input } = Forms;
const { Option } = Select;

class NewSnapshootForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      showRequired: false,
      name: '',
      created_at: '',
      project: '',
      description: '',
      status: '',
    };
  }

  componentWillMount() {
    const { id } = this.props;
    service.fetchSnapshot(id)
      .then((res) => {
        if (res.ok) {
          const data = res.data;
          this.setState({
            name: data.name,
            created_at: data.created_at,
            project: data.project,
            description: data.description,
            status: data.status,
          });
        } else {
          // todo: 错误处理
          error(res.msg);
        }
      });
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
      ...pick(this.state, 'desc'),
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
    const { showRequired, name, created_at, project, description, status } = this.state;
    const { id } = this.props;
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
            disabled
          />
          <InputField
            name="id"
            label={i18n('Id')}
            type="text"
            value={id || ''}
            disabled
          />
          <InputField
            name="created_at"
            label="创建于"
            type="text"
            value={created_at || ''}
            disabled
          />
          <InputField
            name="project"
            label="项目"
            type="text"
            value={project || ''}
            disabled
          />
          <InputField
            name="status"
            label="状态"
            type="text"
            value={status || ''}
            disabled
          />
          <div className="neo-form-line">
            <Label>描述</Label>
            <textarea disabled className="neo-textarea" value={description}>{description}</textarea>
          </div>
        </Form>
      </div>
    );
  }
}

export default NewSnapshootForm;
