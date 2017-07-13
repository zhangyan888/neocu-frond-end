/**
 * Created by ssehacker on 2017/4/4.
 */

import classnames from 'classnames';
import Forms from './Form';
import Label from '../../../components/label';
import Tab from '../../../components/tab';
import { pick, request } from '../../../util';

const { InputField, Select, Form, Input } = Forms;
const { Option } = Select;
const { TabPanel } = Tab;

class BalanceListenerForm extends React.Component {
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
      protocol: props.protocol || 'tcp',
      lb_method: props.lb_method || 'RoundRobin',
      session_persistence_type: (props.session_persistence && props.session_persistence.type) || 'SourceIP',
    };
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
    const state = this.state;
    const model = this.form.getModel();
    const healthForm = this.healthForm.getForm();
    const isHttpOrHttps = healthForm.type.indexOf('http') > -1;
    return {
      protocol: state.protocol,
      lb_method: state.lb_method,
      session_persistence: {
        type: state.session_persistence_type,
        cookie_name: model.cookie_name,
      },
      health_check: {
        delay: model.delay,
        fall: model.fall,
        http_url: isHttpOrHttps ? model.http_url : '',
        method: isHttpOrHttps ? healthForm.method : '',
        response_code: isHttpOrHttps ? model.response_code : '',
        rise: model.rise,
        timeout: model.timeout,
        type: healthForm.type,
        enabled: healthForm.enabled,
      },
      name: model.name,
      port: model.port,

    };
  }

  applyWhileValidationError() {
    this.tab.switchPanel('detail');
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
    const { protocol, lb_method, session_persistence_type, showRequired } = this.state;
    const { name, port, session_persistence = {}, health_check } = this.props;
    return (
      <div className={classnames({ 'neo-form-balance-listener': true, 'neo-validated': showRequired })}>
        <Form
          className="neo-form"
          onValid={me.handleValid.bind(me)}
          onInvalid={me.handleInvalid.bind(me)}
          ref={form => { this.form = form; }}
        >
          <Tab defaultKey="detail" ref={(tab) => { this.tab = tab; }}>
            <TabPanel title={i18n('Details (Required)')} key="detail">
              <InputField
                name="name"
                label={i18n('Name')}
                type="text"
                value={name || ''}
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
                placeholder={i18n('Please enter a name')}
                required
              />
              <div className="neo-form-line">
                <Label required>{i18n('Listener Protocol')}</Label>
                <Select
                  {...BalanceListenerForm.selectCommonConfig}
                  value={protocol}
                  onChange={me.handleChange.bind(me, 'protocol')}
                >
                  <Option key="tcp" value="tcp">TCP</Option>
                  <Option key="http" value="http">HTTP</Option>
                  <Option key="https" value="https">HTTPS</Option>
                </Select>
              </div>
              <InputField
                name="port"
                label={i18n('Port')}
                type="number"
                value={port || 80}
                validations={{ gte: 1, lte: 65535 }}
                validationErrors={{ gte: i18n('Port Range Is 1-65535'), lte: i18n('Port Range Is 1-65535') }}
                placeholder={i18n('Please enter port number')}
                required
              />
              <div className="neo-form-line">
                <Label required>{i18n('Load Algorithm')}</Label>
                <Select
                  {...BalanceListenerForm.selectCommonConfig}
                  value={lb_method}
                  onChange={me.handleChange.bind(me, 'lb_method')}
                >
                  <Option key="RoundRobin" value="RoundRobin">{i18n('Polling')}</Option>
                  <Option key="LeastConn" value="LeastConn">{i18n('Least')}</Option>
                  <Option key="SourceIP" value="SourceIP">{i18n('Fastest')}</Option>
                </Select>
              </div>
              <div className="neo-form-line">
                <Label>{i18n('Session Persistence')}</Label>
                <Select
                  {...BalanceListenerForm.selectCommonConfig}
                  value={session_persistence_type}
                  onChange={me.handleChange.bind(me, 'session_persistence_type')}
                >
                  <Option key="SourceIP" value="SourceIP">SOURCE_IP</Option>
                  <Option key="HTTPCookie" value="HTTPCookie">HTTP_COOKIE</Option>
                  <Option key="AppCookie" value="AppCookie">APP_COOKIE</Option>
                </Select>
              </div>
              <InputField
                className={classnames({ 'neo-hidden': session_persistence_type !== 'AppCookie' })}
                name="cookie_name"
                label="Cookie Name"
                type="text"
                value={session_persistence.cookie_name || ''}
                placeholder={i18n('Please enter cookie name')}
                required={session_persistence_type === 'AppCookie'}
              />
            </TabPanel>
            <TabPanel title={i18n('Health Check')} key="health-check">
              <HealthCheck ref={(healthForm) => { this.healthForm = healthForm; }} {...health_check} />
            </TabPanel>
          </Tab>
        </Form>
      </div>
    );
  }
}

class HealthCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type || 'ping',
      method: props.method || 'get',
      enabled: props.enabled || true,
    };
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
    return this.state;
  }

  isHttp(type) {
    return type === 'http' || type === 'https';
  }

  render() {
    const me = this;
    const { type, method, enabled } = this.state;
    const { http_url, response_code = 200, delay, timeout, rise, fall } = this.props;
    return (
      <div className="neo-form-balance-health">
        <div className="neo-form-line">
          <Label>{i18n('Check Way')}</Label>
          <Select
            {...BalanceListenerForm.selectCommonConfig}
            value={type}
            onChange={me.handleChange.bind(me, 'type')}
          >
            <Option key="ping" value="ping">PING</Option>
            <Option key="http" value="http">HTTP</Option>
            <Option key="https" value="https">HTTPS</Option>
            <Option key="tcp" value="tcp">TCP</Option>
          </Select>
        </div>
        <InputField
          className={classnames({ 'neo-hidden': !me.isHttp(type) })}
          name="http_url"
          label="URL"
          type="text"
          value={http_url || ''}
          placeholder={i18n('Please enter URL')}
        />
        <div className={classnames({ 'neo-form-line': true, 'neo-hidden': !me.isHttp(type) })}>
          <Label>{i18n('RTS')}</Label>
          <Select
            {...BalanceListenerForm.selectCommonConfig}
            value={method}
            onChange={me.handleChange.bind(me, 'method')}
          >
            <Option key="get" value="get">GET</Option>
            <Option key="post" value="post">POST</Option>
          </Select>
        </div>
        <InputField
          className={classnames({ 'neo-hidden': !me.isHttp(type) })}
          name="response_code"
          label={i18n('Return HTTP status code')}
          type="number"
          validations={{ gte: 100, lte: 599 }}
          validationErrors={{ gte: i18n('Please enter a correct HTTP status code'), lte: i18n('Please enter a correct HTTP status code')} }
          value={response_code || 200}
          placeholder={i18n('Please enter status code')}
        />
        <InputField
          name="delay"
          label={i18n('Delay')}
          type="number"
          value={delay || '10'}
          placeholder={i18n('Range: 2-60s')}
          validations={{ gte: 2, lte: 60 }}
          validationErrors={{ gte: i18n('Please Enter a Number between 2-60'), lte: i18n('Please Enter a Number between 2-60') }}
        />
        <InputField
          name="timeout"
          label={i18n('Timeout')}
          type="number"
          value={timeout || '5'}
          placeholder={i18n('Range: 5-300s')}
          validations={{ gte: 5, lte: 300 }}
          validationErrors={{ gte: i18n('Range: 5-300s'), lte: i18n('Range: 5-300s') }}
        />
        <InputField
          name="rise"
          label={i18n('Health Threshold')}
          type="number"
          value={rise || '2'}
          placeholder={i18n('Range:2-10')}
          validations={{ gte: 2, lte: 10 }}
          validationErrors={{ gte: i18n('Please Enter a Number between 2-10'), lte: i18n('Please Enter a Number between 2-10') }}
        />
        <InputField
          name="fall"
          label={i18n('Unhealth Threshold')}
          type="number"
          value={fall || '5'}
          placeholder={i18n('Range:2-10')}
          validations={{ gte: 2, lte: 10 }}
          validationErrors={{ gte: i18n('Please Enter a Number between 2-10'), lte: i18n('Please Enter a Number between 2-10') }}
        />
        <div className="neo-form-line neo-form-checkbox">
          <Input type="checkbox" checked={enabled} onChange={me.handleChange.bind(me, 'enabled')} />
          <Label>{i18n('Enabled')}</Label>
        </div>
      </div>
    );
  }
}

export default BalanceListenerForm;
