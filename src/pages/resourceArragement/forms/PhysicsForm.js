/**
 * Created by Administrator on 2017/6/17.
 */

import classnames from 'classnames';
import Forms from './Form';
import Label from '../../../components/label';
import Tab from '../../../components/tab';
import { pick, request } from '../../../util';
import { util } from '../widgets';

const { TabPanel } = Tab;


const { InputField, Select, Form, Input } = Forms;
const { Option } = Select;

class PhysicsForm extends React.Component {
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
      image: props.image || '',
      brand: props.brand || 'inspur',
      os_raid: props.os_raid || '0',
      data_raid: props.data_raid || '0',
      pool_id: props.pool_id || '',
      poolOption: [],
      imageOption: [],
      network: props.network || '',
      networkOption: [],
    };
  }
  componentWillMount() {
     let brand = this.state.brand;
      Promise.all([
         request.get('/api/ironic/images/'),
         request.get('/api/ironic/install_sub_networks/'),
         request.get('/api/ironic/nodepool/'+ brand +'/')
     ])
    .then((res) => {
      this.setState({
                    /*	systemOption: res[0].items,*/
                    /*	brandOption: res[0].items,
                        brand: this.state.brand || res[0].items[0].id,*/
        imageOption: res[0],
        image: this.state.image || res[0][0].id,
        networkOption: res[1],
        network: this.state.network || res[1][0].id,
        poolOption: res[2],
        pool_id: this.state.pool_id || res[2][0].id,
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
debugger;
    return {
      ...pick(this.state, 'brand', 'image', 'pool_id', 'network', 'os_raid', 'data_raid'),
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
    const { showRequired, image, pool_id, brand, network, poolOption, imageOption, networkOption, os_raid, data_raid } = this.state;
    const { name, pwd, ip_width,count } = this.props;
    return (
			<div className={classnames({ 'neo-form-physics': true, 'neo-validated': showRequired })}>
				<Form
  className="neo-form"
  onValid={me.handleValid.bind(me)}
  onInvalid={me.handleInvalid.bind(me)}
  ref={(form) => { this.form = form; }}
				>
					<Tab defaultKey="detail" ref={(tab) => { this.tab = tab; }}>
					<TabPanel title={i18n('Base information')} key="detail">
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
							<Label required>{i18n('Brand')}</Label>
							<Select
  {...PhysicsForm.selectCommonConfig}
  value={brand}
  onChange={me.handleChange.bind(me, 'brand')}
							>
								<Option key="inspur" value="inspur">浪潮</Option>
                                <Option key="dell" value="dell">戴尔</Option>
							</Select>
						</div>
						<div className="neo-form-line">
							<Label required>{i18n('image')}</Label>
							<Select
  {...PhysicsForm.selectCommonConfig}
  value={image}
  onChange={me.handleChange.bind(me, 'image')}
							>

								{
									imageOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
								}
							</Select>
						</div>
						<div className="neo-form-line">
							<Label required>{i18n('Pool_id')}</Label>
							<Select
  {...PhysicsForm.selectCommonConfig}
  value={pool_id}
  onChange={me.handleChange.bind(me, 'pool_id')}
							>
								{
									poolOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
								}
							</Select>
						</div>
                        <InputField
  name="count"
  label={i18n('Count')}
  type="number"
  value={count || 1 }
  placeholder={i18n('Please enter number')}
  validations={{ gte: 1, lte: 1000 }}
  validationErrors={{ gte: i18n('Please enter a number between 1 and 1000'), lte: i18n('Please enter a number between 1 and 1000') }}
  required
						/>
						<InputField
  label={i18n('Set Admin Password')}
  name="pwd"
  type="password"
  placeholder={i18n('Password length is not less than five')}
  value={pwd || ''}
  validations="minLength:5"
  validationError={i18n('Password length is not less than five')}
  required
						/>
					</TabPanel>
					<TabPanel title={i18n('Configuration')} key="configuration">
						<div className="neo-form-line neo-hidden">
							<Label required>{i18n('network Network')}</Label>
							<Select
  {...PhysicsForm.selectCommonConfig}
  value={network}
  onChange={me.handleChange.bind(me, 'network')}
							>
								{
									networkOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
								}
							</Select>
						</div>
						<InputField className="neo-hidden"
  name="ip_width"
  label={i18n('Band width')}
  type="number"
  value={ip_width || 50}
  placeholder={i18n('Please enter number')}
  validations={{ gte: 1, lte: 1000 }}
  validationErrors={{ gte: i18n('Please enter a number between 1 and 1000'), lte: i18n('Please enter a number between 1 and 1000') }}
  required
						/>

						<div className="neo-form-line">
							<Label required>{i18n('System disk')}</Label>
							<Select
  {...PhysicsForm.selectCommonConfig}
  value={os_raid}
  onChange={me.handleChange.bind(me, 'os_raid')}
							>
								<Option key="Raid0" value="0">Raid0</Option>
								<Option key="Raid1" value="1">Raid1</Option>
								<Option key="Raid2" value="10">Raid10</Option>
							</Select>
						</div>

						<div className="neo-form-line">
						<Label required>{i18n('Data disk')}</Label>
						<Select
  {...PhysicsForm.selectCommonConfig}
  value={data_raid}
  onChange={me.handleChange.bind(me, 'data_raid')}
						>
							<Option key="Raid0" value="0">Raid0</Option>
							<Option key="Raid1" value="1">Raid1</Option>
							<Option key="Raid2" value="10">Raid10</Option>
						</Select>
					</div>

					</TabPanel>
				</Tab>
				</Form>
			</div>
    );
  }
}

export default PhysicsForm;
