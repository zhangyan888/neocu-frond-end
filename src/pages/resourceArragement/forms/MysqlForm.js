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

class MysqlForm extends React.Component {
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
      volume_type: props.volume_type || '',
      volumeTypeOption: [],
      datastoreVersionId: props.datastoreVersionId || '',
      datastoreVersionOption: [],
      network: (props.networks && props.networks[0].id) || '',
      networkOption: [],
      is_ha: String(!!props.is_ha),
    };
  }

  componentWillMount() {
    const fetchFlavors = request.get('/api/trove/flavors/', { replica_flavors: this.props.instanceFlavors || [] });
    const fetchVolumeType = request.get('/api/cinder/volumetypes/');
    const fetchDatastoreVersion = request.get('/api/trove/datastore_versions/');
    const fetchNetworks = request.get('/api/trove/networks/');
    Promise.all([fetchFlavors, fetchVolumeType, fetchDatastoreVersion, fetchNetworks])
      .then(res => {
        const flavors = res[0];
        const valumeTypes = res[1];
        const datastoreVersions = res[2];
        const networks = res[3];
        this.setState({
          flavorOption: flavors,
          flavor: this.state.flavor || flavors[0].id,
          volumeTypeOption: valumeTypes.items,
          volume_type: this.state.volume_type || valumeTypes.items[0].id,
          datastoreVersionOption: datastoreVersions,
          datastoreVersionId: this.state.datastoreVersionId || datastoreVersions[0].id,
          networkOption: networks,
          network: this.state.network || networks[0].id,
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
    const { flavor, volume_type, datastoreVersionId, network } = this.state;
    const selectedNetwork = util.indexBy(this.state.networkOption, 'id')[network];

    const is_ha = (this.state.is_ha === 'true');
    return {
      flavor,
      parentFlavor: flavor,
      volume_type,
      datastoreVersionId,
      datastore_version: util.indexBy(this.state.datastoreVersionOption, 'id')[datastoreVersionId].name,
      ...this.form.getModel(),
      is_ha,
      networks: [{
        ...selectedNetwork,
        selected: true,
      }],
      extra: {
        volumeTypeText: util.indexBy(this.state.volumeTypeOption, 'id')[volume_type].name,
        isHaText: is_ha ? i18n('HA Mode') : i18n('Normal Mode'),
      },
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
    const { flavor, showRequired, flavorOption, volume_type, volumeTypeOption, datastoreVersionId,
      datastoreVersionOption, network, networkOption, is_ha } = this.state;
    const { name, size } = this.props;
    return (
      <div className={classnames({ 'neo-form-mysql': true, 'neo-validated': showRequired })}>
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
              {...MysqlForm.selectCommonConfig}
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
            label={i18n('Disk Size (GB)')}
            type="number"
            value={size || '1'}
            placeholder={i18n('Please enter disk size')}
            validations={{
              gte: 1,
              lte: 3072,
            }}
            validationErrors={{
              gte: i18n('Please enter an integer between 1 and 3072'),
              lte: i18n('Please enter an integer between 1 and 3072'),
            }}
            required
          />
          <div className="neo-form-line">
            <Label>{i18n('Volume Type')}</Label>
            <Select
              {...MysqlForm.selectCommonConfig}
              value={volume_type}
              onChange={me.handleChange.bind(me, 'volume_type')}
            >
              {
                volumeTypeOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
              }
            </Select>
          </div>
          <div className="neo-form-line">
            <Label required>{i18n('Network')}</Label>
            <Select
              {...MysqlForm.selectCommonConfig}
              value={network}
              onChange={me.handleChange.bind(me, 'network')}
            >
              {
                networkOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
              }
            </Select>
          </div>
          <div className="neo-form-line">
            <Label required>{i18n('Database Version')}</Label>
            <Select
              {...MysqlForm.selectCommonConfig}
              value={datastoreVersionId}
              onChange={me.handleChange.bind(me, 'datastoreVersionId')}
            >
              {
                datastoreVersionOption.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))
              }
            </Select>
          </div>
          <div className="neo-form-line">
            <Label required>{i18n('Mode')}</Label>
            <Select
              {...MysqlForm.selectCommonConfig}
              value={is_ha}
              onChange={me.handleChange.bind(me, 'is_ha')}
            >
              <Option key="false" value="false">{i18n('Normal Mode')}</Option>
              <Option key="true" value="true">{i18n('HA Mode')}</Option>
            </Select>
          </div>
        </Form>
      </div>
    );
  }
}

export default MysqlForm;
