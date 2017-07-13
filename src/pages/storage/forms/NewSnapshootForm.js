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
      desc: props.desc || '',
      volumeTotalCount: 1,
      volumeUsedCount: 0,
      snapshotTotalCount: 1,
      snapshotUsedCount: 0,
    };
  }

  componentWillMount() {
    service.fetchStorageUsages()
      .then((res) => {
        if (res.ok) {
          const data = res.data;
          this.setState({
            volumeTotalCount: data.maxTotalVolumeGigabytes || 10000 * data.totalGigabytesUsed,
            volumeUsedCount: data.totalGigabytesUsed,
            snapshotTotalCount: data.maxTotalSnapshots || 10000 * data.snapshotsUsed,
            snapshotUsedCount: data.snapshotsUsed,
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
    const { showRequired, desc, volumeTotalCount, volumeUsedCount, snapshotTotalCount, snapshotUsedCount } = this.state;
    const { name } = this.props;
    const rs_data = {
      name: '快照限制',
      list: [
        {
          id: 0,
          name: '云硬盘容量',
          total: volumeTotalCount,
          unit: 'GB',
          used: volumeUsedCount,
          newData: 0,
        },
        {
          id: 1,
          name: '快照数量',
          total: snapshotTotalCount,
          unit: '',
          used: snapshotUsedCount,
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
        </Form>
      </div>
    );
  }
}

export default NewSnapshootForm;
