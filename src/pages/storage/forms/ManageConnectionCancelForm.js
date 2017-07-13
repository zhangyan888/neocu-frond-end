/**
 * Created by ssehacker on 2017/5/10.
 */

import classnames from 'classnames';
import Forms from '../../../components/form2';

const { InputField, Form, Input } = Forms;

class ManageConnectionCancelForm extends React.Component {

  render() {
    const { instance, device } = this.props;
    return (
      <div className={classnames({ 'neo-form-storage': true,})}>
        <Form
          className="neo-form"
          ref={form => { this.form = form; }}
        >
          <InputField
            name="server_name"
            label={i18n('云主机')}
            type="text"
            value={instance}
            disabled
          />
          <InputField
            name="device"
            label={i18n('设备')}
            type="text"
            value={device}
            disabled
          />
        </Form>
      </div>
    );
  }
}

export default ManageConnectionCancelForm;
