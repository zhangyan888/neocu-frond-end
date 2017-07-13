/**
 * Created by ssehacker on 2017/3/31.
 */

import classnames from 'classnames';
import Forms from './Form';
import Label from '../../../components/label';
import { pick, request } from '../../../util';

const { InputField, Input, Select, Form } = Forms;
const { Option } = Select;

class VlanForm extends React.Component {
  static selectCommonConfig = {
    dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
    optionLabelProp: 'children',
    optionFilterProp: 'text',
  };

  constructor(props) {
    super(props);
    let pool;
    if (props.pool && props.pool.length) {
      pool = props.pool.map(item => {
        if (Object.prototype.toString.call(item) === '[object Array]') {
          return item.join('.');
        }
        return item;
      });
    }
    this.state = {
      valid: false,
      showRequired: false,
      type: props.type || 'vlan',
      getway: props.getway || '192.168.0.1',
      pool: pool || ['192.168.0.2', '192.168.0.254'],
      ipv4a: props.ipv4a || ['192', '168', '0', '1'],
      ipv4b: props.ipv4b || ['10', '0', '0', '1'],
      ipv4c: props.ipv4c || ['172', '0', '0', '1'],
      checkedIp: props.checkedIp || 'ipv4a',
      ipHasErr: false,
      poolHasErr: false,
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

  handlePoolInputChange(type, e) {
    let { pool } = this.state;
    const min = pool[0].split('.');
    const max = pool[1].split('.');

    if (type === 'hostMin') {
      min[3] = e.target.value;
    } else {
      max[3] = e.target.value;
    }
    pool = [min.join('.'), max.join('.')];
    this.setState({
      pool,
      poolHasErr: !this.validPool(pool),
    });
  }

  handleIPChange(type, index, e) {
    const ipv4x = this.state[type];
    ipv4x[index] = e.target.value;

    const ipHasErr = !this.validIP(ipv4x);
    if (type !== this.state.checkedIp) {
      this.setState({
        [type]: ipv4x,
        ipHasErr,
      });
    } else {
      const pool = this.parsePool(ipv4x, this.state.pool);
      const getway = Object.assign([], ipv4x, { 3: '1' }).join('.');
      this.setState({
        [type]: ipv4x,
        pool,
        getway,
        ipHasErr,
      });
    }
  }

  validIP(ipv4) {
    let b = true;
    for (let i = 0; i < ipv4.length; i++) {
      b = parseInt(ipv4[i]) >= 0 && parseInt(ipv4[i]) <= 254;
      if (!b) {
        break;
      }
    }
    return b;
  }

  validPool(pool) {
    let min = pool[0].split('.')[3];
    let max = pool[1].split('.')[3];

    min = parseInt(min);
    max = parseInt(max);

    const b = (min >= 2 && min <= 254 && max >= 2 && max <= 254 && min <= max);
    return b;
  }

  parsePool(selectedIPv4, currentPool) {
    let pool = currentPool;
    let min = pool[0].split('.');
    let max = pool[1].split('.');
    min = Object.assign([], selectedIPv4, { 3: min[3] }).join('.');
    max = Object.assign([], selectedIPv4, { 3: max[3] }).join('.');

    pool = [min, max];
    return pool;
  }

  handleSelectIPv4(type) {
    const ipv4 = this.state[type];
    const getway = Object.assign([], ipv4, {3: '1'}).join('.');

    const pool = this.parsePool(ipv4, this.state.pool);
    const ipHasErr = !this.validIP(ipv4);
    this.setState({
      checkedIp: type,
      getway,
      pool,
      ipHasErr,
    });
  }

  getForm() {
    const ipv4 = this.state[this.state.checkedIp];
    return {
      ...pick(this.state, 'type', 'getway', 'pool', 'ipv4a', 'ipv4b', 'ipv4c', 'checkedIp'),
      ipv4: ipv4.join('.'),
      ...this.form.getModel(),
    };
  }

  showRequired() {
    this.setState({
      showRequired: true,
    });
  }

  isValid() {
    const { valid, ipHasErr, poolHasErr } = this.state;
    return valid && !ipHasErr && !poolHasErr;
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

  renderIPAddress() {
    const { ipv4a, ipv4b, ipv4c, checkedIp, ipHasErr } = this.state;
    const me = this;
    return (
      <div className="neo-form-vlan-ip">
        <p
          className={classnames({ 'ip-selected': checkedIp === 'ipv4a' })}
          onClick={me.handleSelectIPv4.bind(me, 'ipv4a')}
        >
          <a>
            <span>{ipv4a[0]}</span>
            <i>.</i>
            <span>{ipv4a[1]}</span>
            <i>.</i>
            <input type="number" value={ipv4a[2]} onChange={me.handleIPChange.bind(me, 'ipv4a', 2)} />
            <i>.</i>
            <span>{ipv4a[3]}</span>
            <span>/24</span>
          </a>
          <i className="iconfont icon-finished" />
        </p>
        <p
          className={classnames({ 'ip-selected': checkedIp === 'ipv4b' })}
          onClick={me.handleSelectIPv4.bind(me, 'ipv4b')}
        >
          <a>
            <span>{ipv4b[0]}</span>
            <i>.</i>
            <input type="number" value={ipv4b[1]} onChange={me.handleIPChange.bind(me, 'ipv4b', 1)} />
            <i>.</i>
            <input type="number" value={ipv4b[2]} onChange={me.handleIPChange.bind(me, 'ipv4b', 2)} />
            <i>.</i>
            <input type="number" value={ipv4b[3]} onChange={me.handleIPChange.bind(me, 'ipv4b', 3)} />
            <span>/24</span>
          </a>
          <i className="iconfont icon-finished" />
        </p>
        <p
          className={classnames({ 'ip-selected': checkedIp === 'ipv4c' })}
          onClick={me.handleSelectIPv4.bind(me, 'ipv4c')}
        >
          <a>
            <span>{ipv4c[0]}</span>
            <i>.</i>
            <input type="number" value={ipv4c[1]} onChange={me.handleIPChange.bind(me, 'ipv4c', 1)} />
            <i>.</i>
            <input type="number" value={ipv4c[2]} onChange={me.handleIPChange.bind(me, 'ipv4c', 2)} />
            <i>.</i>
            <input type="number" value={ipv4c[3]} onChange={me.handleIPChange.bind(me, 'ipv4c', 3)} />
            <span>/24</span>
          </a>
          <i className="iconfont icon-finished" />
        </p>
        <div className="neo-ip-error">{ipHasErr && '请输入正确的IP地址(0-254)'}</div>
      </div>
    );
  }

  renderIPPool() {
    const me = this;
    const { pool, poolHasErr } = this.state;
    const hostMin = pool[0].split('.');
    const hostMax = pool[1].split('.');
    return (
      <div className="neo-form-vlan-pools">
        <p>
          <span>{hostMin[0]}</span>
          <i>.</i>
          <span>{hostMin[1]}</span>
          <i>.</i>
          <span>{hostMin[2]}</span>
          <i>.</i>
          <input type="number" value={hostMin[3]} onChange={me.handlePoolInputChange.bind(me, 'hostMin')} />
        </p>
        <a>-</a>
        <p>
          <span>{hostMax[0]}</span>
          <i>.</i>
          <span>{hostMax[1]}</span>
          <i>.</i>
          <span>{hostMax[2]}</span>
          <i>.</i>
          <input type="number" value={hostMax[3]} onChange={me.handlePoolInputChange.bind(me, 'hostMax')} />
        </p>
        <div className="neo-ip-error">{poolHasErr && '请输入正确的IP地址(2-254)'}</div>
      </div>
    );
  }

  render() {
    const me = this;
    const { type, getway, pool, showRequired } = this.state;
    const { name } = this.props;
    return (
      <div className={classnames({ 'neo-form-vlan': true, 'neo-validated': showRequired })}>
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
          <div className="neo-form-line neo-hidden">
            <Label required>{i18n('Net Type')}</Label>
            <Select
              {...VlanForm.selectCommonConfig}
              value={type}
              onChange={me.handleChange.bind(me, 'type')}
            >
              <Option key="GRE" value="GRE">GRE</Option>
              <Option key="vlan" value="vlan">vlan</Option>
            </Select>
          </div>
          <div className="neo-form-line">
            <Label required>{i18n('Network Address')}</Label>
            {me.renderIPAddress()}
          </div>
          <div className="neo-form-line">
            <Label required>{i18n('Address Pool')}</Label>
            {me.renderIPPool()}
          </div>
          <div className="neo-form-line neo-form-vlan-getway">
            <Label required>{i18n('Gateway')}</Label>
            <p>{getway}</p>
          </div>
        </Form>
      </div>
    );
  }
}



export default VlanForm;
