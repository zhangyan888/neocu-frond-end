/**
 * Created by ssehacker on 2017/3/24.
 */
import * as CONSTANT from '../constant';
import dialog, { error, success } from '../../../components/dialog';
import configUtil from '../configUtil';
import { request } from '../../../util';
import { util } from '../widgets';
import {
  VMForm,
  HarddiskForm,
  IPForm,
  VlanForm,
  BalanceForm,
  DeleteForm,
  BalanceListenerForm,
  ListenBackendForm,
  FirewallForm,
  NewFirewallRuleForm,
  FirewallRuleForm,
  RouterForm,
  PPTPForm,
  OpenVPNForm,
  PPTPUsersForm,
  MysqlForm,
  MysqlInstanceForm,
  ListenPolicyForm,
  PhysicsForm,
  SubmitForm,
} from '../forms';

function confirm(title, content) {
  dialog(<div className="neo-confirm">{content}</div>, {
    title,
    style: { maxWidth: '400px' },
    confirmTitle: i18n('OK'),
  });
}

// 删除block
function removeBlock(blockId) {
  const blocks = this.state.blocks.filter(item => item.id !== blockId);
  this.setState({
    blocks,
  });
}

// 删除所有blockId相关的连线
function removeConn(blockId) {
  const connections = this.state.connections.filter(item => item.from !== blockId && item.to !== blockId);
  this.setState({
    connections,
  });
}

function removeBlockAndConns(blockId) {
  const block=this.state.blocks.find(item=>item.id===blockId);
  const blockRelated=configUtil.getProperty(block.type,'related');
  const deepRemoved=['router','balancing','mysql'];
  let removeBlocks=[];
  if(blockRelated && deepRemoved.indexOf(block.type.toLowerCase())>-1){
    const relatedTypes=blockRelated.join(',').toLowerCase();
    let connectBlocks=[];
    this.state.connections.forEach(item => {
      if((item.from !== blockId && item.to === blockId)||(item.from === blockId && item.to !== blockId)){
        connectBlocks.push(item.from !== blockId?item.from:item.to);
      }
    });
    this.state.blocks.forEach(item=>{
      if(connectBlocks.indexOf(item.id)>-1 && relatedTypes.indexOf(item.type.toLowerCase())>-1){
        removeBlocks.push(item.id);
      }
    });
  }
  removeBlocks.push(blockId);
  const blocks = this.state.blocks.filter(item => removeBlocks.join(',').indexOf(item.id)<0);
  const connections = this.state.connections.filter(item => item.from !== blockId && item.to !== blockId);
  this.setState({
    blocks,
    connections,
  });
}

function findBlocksConnectedWith(blockId, type) {
  const { blocks, connections } = this.state;
  const bks = util.indexBy(blocks, 'id');
  return connections.filter(item => item.from === blockId || item.to === blockId)
    .map(item => (item.from === blockId ? bks[item.to] : bks[item.from]))
    .filter(item => !type || item.type === type);
}

function getRelatedBlocks(connections, blocks, blockId) {
  const bks = util.indexBy(blocks, 'id');
  return connections.filter(item => item.from === blockId || item.to === blockId)
    .map(item => (item.from === blockId ? bks[item.to] : bks[item.from]));
}

function getFormByType(blockType) {
  switch (blockType) {
    case CONSTANT.VM_TYPE:
      return VMForm;
    case 'harddisk':
      return HarddiskForm;
    case CONSTANT.IP:
      return IPForm;
    case CONSTANT.VLAN_TYPE:
      return VlanForm;
    case 'balancing':
      return BalanceForm;
    case 'listen':
      return BalanceListenerForm;
    case 'firewall':
      return FirewallForm;
    case 'router':
      return RouterForm;
    case CONSTANT.OPENVPN:
      return OpenVPNForm;
    case CONSTANT.PPTP:
      return PPTPForm;
    case CONSTANT.MYSQL:
      return MysqlForm;
    case CONSTANT.MYSQLREPLICA:
      return MysqlInstanceForm;
    case CONSTANT.PHYSICS:
      return PhysicsForm;
    default:
      return null;
  }
}

function removeConnection(connections, blockId1, blockId2) {
  const conns = connections.filter((item) => {
    if ((item.from === blockId1 && item.to === blockId2) ||
      (item.from === blockId2 && item.to === blockId1)) {
      return false;
    }
    return true;
  });
  return conns;
}

// todo: 这里有个bug， connections 应该实时从state获取。
function addConnection(connections, blockId1, blockId2) {
  // 去重
  const exist = connections.find(item => (item.from === blockId1 && item.to === blockId2) ||
      (item.from === blockId2 && item.to === blockId1));
  if (exist) {
    return [...connections];
  }
  return [
    ...connections,
    { from: blockId1, to: blockId2 },
  ];
}

function addListenerBlock(blocks, blockDetail) {
  return [
    ...blocks,
    blockDetail,
  ];
}

// todo:
function applyWhileInvalid(ctx, childNode, block) {
  if (block.type === 'balancing') {
    childNode.applyWhileValidationError();
  } else if (block.type === 'pptp') {
    childNode.applyWhileValidationError();
  }
}

function applyAfterClose(block, ctx, preForm, currentForm) {
  if (block.type === 'balancing') {
    try {
      let { connections } = ctx.state;
      if (preForm) {
        connections = removeConnection(connections, block.id, preForm.ha_subnet_id);
      }

      if (currentForm && currentForm.type === 'high-availability') {
        connections = addConnection(connections, block.id, currentForm.ha_subnet_id);
      }
      console.log(connections);
      ctx.setState({
        connections,
      });
    } catch (e) {
      console.log(e);
    }
  } else if (block.type === CONSTANT.MYSQL) {
    let { blocks } = ctx.state;
    blocks = blocks.map((item) => {
      if (item.type === CONSTANT.MYSQLREPLICA) {
        const { name, flavor, ...other } = currentForm;
        Object.assign(item.form, other);
      }
      return item;
    });
    ctx.setState({
      blocks,
    });
  } else if (block.type === CONSTANT.MYSQLREPLICA) {
    let { blocks } = ctx.state;
    const relatedBlock = findBlocksConnectedWith.call(ctx, block.id, CONSTANT.MYSQL)[0];
    const instanceFlavors = findBlocksConnectedWith
      .call(ctx, relatedBlock.id, CONSTANT.MYSQLREPLICA)
      .map(item => item.form.flavor);

    blocks = blocks.map((item) => {
      if (item.id === relatedBlock.id) {
        Object.assign(item.form, { instanceFlavors });
      }
      return item;
    });
    ctx.setState({
      blocks,
    });
  }
}

function openForm(state, action) {
  const block = state.blocks.find(item => item.id === action.blockId);
  const that = this;
  const CustomForm = getFormByType(action.blockType);
  dialog(<CustomForm {...block.form} ctx={that} />, {
    title: action.title,
    style: {  maxWidth: '700px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      const valid = this.child.isValid();
      // 表单验证
      if (!valid) {
        this.child.showRequired();
      } else {
        const form = this.child.getForm();
        const blocks = state.blocks.map((item) => {
          if (item.id === action.blockId) {
            return {
              ...item,
              form,
            };
          }
          return item;
        });
        that.setState({
          blocks,
        });
        setTimeout(() => {
          applyAfterClose(block, that, block.form, form);
        });
      }
      return valid;
    },
  });
}


function addBalanceListener(state, action) {
  const that = this;
  const block = state.blocks.find(item => item.id === action.blockId);
  dialog(<BalanceListenerForm ctx={that} />, {
    title: action.title,
    style: {},
    abortTitle: i18n('Cancel'),
    confirm() {
      const valid = this.child.isValid();
      if (!valid) {
        this.child.showRequired();
        applyWhileInvalid(that, this.child, block);
      } else {
        const form = this.child.getForm();
        let { blocks, connections } = that.state;
        const blockTmpl = configUtil.getBlock('listen');

        // const relatedBlocks = getRelatedBlocks(connections, blocks, block.id);
        const relatedBlocks = findBlocksConnectedWith.call(that, block.id, CONSTANT.LISTEN);
        const id = String(Date.now());
        blocks = addListenerBlock(blocks, {
          id,
          x: block.x + 60 + blockTmpl.width,
          y: block.y + ((30 + blockTmpl.height) * relatedBlocks.length),
          ...blockTmpl,
          form,
        });
        connections = addConnection(connections, id, block.id);
        that.setState({
          blocks,
          connections,
        });
      }
      return valid;
    },
  });
}

function manageListenBackends(state, action) {
  const that = this;
  const block = state.blocks.find(item => item.id === action.blockId);
  dialog(<ListenBackendForm
    ctx={that}
    {...block.form}
  />, {
    title: action.title,
    abortTitle: i18n('Cancel'),
    style: {  width: '940px', maxWidth: '940px' },
    confirm() {
      const valid = this.child.isValid();
      if (!valid) {
        // todo: do something

      } else {
        const backend_list = this.child.getForm();
        const blocks = state.blocks.map((item) => {
          if (item.id === action.blockId) {
            return {
              ...item,
              form: {
                ...item.form,
                backend_list,
              },
            };
          }
          return item;
        });
        that.setState({
          blocks,
        });
      }
      return valid;
    },
  });
}

function manageListenPolicies(state, action) {
  const that = this;
  const block = state.blocks.find(item => item.id === action.blockId);
  dialog(<ListenPolicyForm ctx={that} {...block.form} />, {
    title: action.title,
    abortTitle: i18n('Cancel'),
    style: { width: '600px' },
    confirm() {
      const valid = this.child.isValid();
      if (!valid) {
        // todo: do something
        this.child.showRequired();
      } else {
        const policies = this.child.getForm();
        const blocks = state.blocks.map((item) => {
          if (item.id === action.blockId) {
            return {
              ...item,
              form: {
                ...item.form,
                policies,
              },
            };
          }
          return item;
        });
        that.setState({
          blocks,
        });
      }
      return valid;
    },
  });
}

function createFirewallRule(state, action) {
  const that = this;
  // const block = state.blocks.find(item => item.id === action.blockId);
  dialog(<NewFirewallRuleForm ctx={that} />, {
    title: action.title,
    abortTitle: i18n('Cancel'),
    style: {  width: '700px' },
    confirm() {
      const valid = this.child.isValid();
      if (!valid) {
        this.child.showRequired();
      } else {
        const policy = this.child.getForm();
        const blocks = state.blocks.map((item) => {
          if (item.id === action.blockId) {
            item.form = item.form || {};
            const rules = item.form.rules || [];
            rules.push(policy);
            return {
              ...item,
              form: {
                ...item.form,
                rules,
              },
            };
          }
          return item;
        });
        that.setState({
          blocks,
        });
      }
      return valid;
    },
  });
}

function manageFirewallRule(state, action) {
  const that = this;
  const block = state.blocks.find(item => item.id === action.blockId);
  dialog(<FirewallRuleForm ctx={that} {...block.form} />, {
    title: action.title,
    abortTitle: i18n('Cancel'),
    style: {  width: '700px' },
    confirm() {
      const valid = this.child.isValid();
      if (!valid) {
        this.child.showRequired();
      } else {
        const rules = this.child.getForm();
        const blocks = state.blocks.map((item) => {
          if (item.id === action.blockId) {
            return {
              ...item,
              form: {
                ...item.form,
                rules,
              },
            };
          }
          return item;
        });
        that.setState({
          blocks,
        });
      }
      return valid;
    },
  });
}

function createPPTP(state, action) {
  const that = this;
  const block = state.blocks.find(item => item.id === action.blockId);
  const relatedIPBlocks = findBlocksConnectedWith.call(that, block.id, CONSTANT.IP);
  if (!relatedIPBlocks.length) {
    confirm(i18n('Prompt'), i18n('Please connect router and public IP'));
    return;
  }
  const relatedPPTPBlocks = findBlocksConnectedWith.call(that, block.id, CONSTANT.PPTP);
  if (relatedPPTPBlocks.length > 0) {
    confirm(i18n('Prompt'), i18n('Can only open one VPN(PPTP)'));
    return;
  }
  dialog(<PPTPForm ctx={that} />, {
    title: action.title,
    abortTitle: i18n('Cancel'),
    style: {  },
    confirm() {
      const valid = this.child.isValid();
      if (!valid) {
        this.child.showRequired();
      } else {
        const form = this.child.getForm();
        let { blocks, connections } = that.state;
        const blockTmpl = configUtil.getBlock(CONSTANT.PPTP);
        const id = String(Date.now());
        blocks = addListenerBlock(blocks, {
          id,
          x: block.x + 60 + blockTmpl.width,
          y: block.y,
          ...blockTmpl,
          form,
        });
        connections = addConnection(connections, id, block.id);
        that.setState({
          blocks,
          connections,
        });
      }
      return valid;
    },
  });
}

function createOpenVPN(state, action) {
  const that = this;
  const block = state.blocks.find(item => item.id === action.blockId);
  const relatedIPBlocks = findBlocksConnectedWith.call(that, block.id, CONSTANT.IP);
  if (!relatedIPBlocks.length) {
    confirm(i18n('Prompt'), i18n('Please connect router and public IP'));
    return;
  }
  const relatedOpenVPNBlocks = findBlocksConnectedWith.call(that, block.id, CONSTANT.OPENVPN);
  if (relatedOpenVPNBlocks.length > 0) {
    confirm(i18n('Prompt'), i18n('Can only open one VPN(OPENVPN)'));
    return;
  }
  dialog(<OpenVPNForm ctx={that} />, {
    title: action.title,
    abortTitle: i18n('Cancel'),
    style: {  },
    confirm() {
      const valid = this.child.isValid();
      if (!valid) {
        this.child.showRequired();
      } else {
        const form = this.child.getForm();
        let { blocks, connections } = that.state;
        const blockTmpl = configUtil.getBlock(CONSTANT.OPENVPN);
        const id = String(Date.now());
        blocks = addListenerBlock(blocks, {
          id,
          x: block.x + 60 + blockTmpl.width,
          y: block.y + 70,
          ...blockTmpl,
          form,
        });
        connections = addConnection(connections, id, block.id);
        that.setState({
          blocks,
          connections,
        });
      }
      return valid;
    },
  });
}

function managePPTPUsers(state, action) {
  const that = this;
  const block = state.blocks.find(item => item.id === action.blockId);
  dialog(<PPTPUsersForm ctx={that} {...block.form} />, {
    title: action.title,
    abortTitle: i18n('Cancel'),
    style: {  width: '800px' },
    confirm() {
      const valid = this.child.isValid();
      if (!valid) {
        applyWhileInvalid(that, this.child, block);
      } else {
        const users = this.child.getForm();
        const blocks = state.blocks.map((item) => {
          if (item.id === action.blockId) {
            return {
              ...item,
              form: {
                ...item.form,
                users,
              },
            };
          }
          return item;
        });
        that.setState({
          blocks,
        });
      }
      return valid;
    },
  });
}


function dialogWhileMysqlFormNotFill(callback) {
  dialog(<div className="neo-confirm">{i18n('Please go through the modified parameters menu to perfect the primary instance configuration information, and then create a read-only instance')}</div>, {
    title: i18n('Prompt'),
    abortTitle: i18n('Cancel'),
    confirmTitle: i18n('Setting Now'),
    style: { width: '400px' },
    confirm: callback,
  });
}

function validateAllForms(ctx, blocks) {
  const blockForms = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const CustomForm = getFormByType(block.type);

    const formNode = ReactDOM.render(<CustomForm ctx={ctx} {...block.form} />,
      document.createDocumentFragment());

    blockForms.push({
      ...block,
      formNode,
    });
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let valid = true;
      let errBlock;
      for (let i = 0; i < blockForms.length; i++) {
        valid = blockForms[i].formNode.isValid();
        if (!valid) {
          errBlock = blockForms[i];
          break;
        }
      }
      resolve({
        valid,
        errBlock,
      });
    });
  });
}

function createMysqlInstance(state, action) {
  const that = this;
  const block = state.blocks.find(item => item.id === action.blockId);
  if (!block.form) {
    dialogWhileMysqlFormNotFill(() => {
      openForm.call(that, state, {
        ...action,
        title: i18n('Update Params'),
      });
    });
    return;
  }
  const form = { ...block.form, name: '' };
  dialog(<MysqlInstanceForm ctx={that} {...form} />, {
    title: action.title,
    abortTitle: i18n('Cancel'),
    style: {  },
    confirm() {
      const valid = this.child.isValid();
      if (!valid) {
        this.child.showRequired();
      } else {
        const form = this.child.getForm();
        let { blocks, connections } = that.state;
        const blockTmpl = configUtil.getBlock(CONSTANT.MYSQLREPLICA);
        // const relatedBlocks = getRelatedBlocks(connections, blocks, block.id);
        const relatedBlocks = findBlocksConnectedWith.call(that, block.id, CONSTANT.MYSQLREPLICA);
        const id = String(Date.now());
        blocks = addListenerBlock(blocks, {
          id,
          x: block.x + 60 + blockTmpl.width,
          y: block.y + ((30 + blockTmpl.height) * relatedBlocks.length),
          ...blockTmpl,
          form,
        });
        connections = addConnection(connections, id, block.id);

        // Mysql 和 其所有的实例之间，Flavors存在互相制约的关系，在各自Form中的flavor选项中可以体现。
        blocks = blocks.map((item) => {
          if (item.id === block.id) {
            item.form.instanceFlavors = item.form.instanceFlavors || [];
            item.form.instanceFlavors.push(form.flavor);
          }
          return item;
        });
        that.setState({
          blocks,
          connections,
        });
      }
      return valid;
    },
  });
}


function openDeleteModal(state, action) {
  const that = this;
  dialog(<DeleteForm />, {
    title: i18n('Delete element And link'),
    style: {  width: '400px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      console.log('delete...');
      removeBlockAndConns.call(that, action.blockId);
    },
  });
}

function handleSubmit(postData) {
  let url = '/api/heat/view_stacks/';
  const source = util.getSource();
  const id = source && source.id;
  if (id) {
    url += `${id}/`;
  }
  request.post(url, postData, {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  })
    .then(() => {
      success(i18n('Save successful,after three seconds will jump to the list page'));
      setTimeout(() => {
        window.location.href = util.getAppListLink();
      }, 3000);
    })
    .catch((err) => {
      util.handleResError(err);
    });
}

function saveForms(state, action) {
  const that = this;

  const { blocks } = state;
  validateAllForms(that, blocks).then((res) => {
    console.log(res.valid);
    console.log(res.errBlock);

    const source = util.getSource() || {};
    const { name, timeout } = source;
    if(blocks.length===0){
      dialog(<div className="neo-confirm">{i18n('The empty templates can not be saved')}</div>, {
        title: i18n('Prompt'),
        style: { width: '400px' },
        abortTitle: i18n('Cancel'),
        confirm() {
          return;
        },
      });
    }else {
      if (res.valid) {
        dialog(<SubmitForm name={name} timeout={timeout} />, {
          title: i18n('Save Template'),
          style: { width: '600px' },
          abortTitle: i18n('Cancel'),
          confirm() {
            const valid = this.child.isValid();
            if (!valid) {
              this.child.showRequired();
            } else {
              const form = this.child.getForm();
              const { blocks, connections } = state;
              const parsedForms = util.convertForms(blocks, connections);

              const postData = {
                ...form,
                only_save: true,
                template: `${JSON.stringify(parsedForms.connections)}&${JSON.stringify(parsedForms.blocks)}&[]`,
              };

              // localStorage.setItem('ra', JSON.stringify(postData));
              handleSubmit(postData);
            }
            return valid;
          },
        });
      } else {
        const name = (res.errBlock.form && res.errBlock.form.name) || res.errBlock.name;
        dialog(<div className="neo-confirm">{name + i18n('Forms filled in incorrectly,please be revised and resubmitted')} </div>, {
          title: i18n('Forms filled in incorrectly'),
          style: { width: '400px' },
          abortTitle: i18n('Cancel'),
          confirmTitle: i18n('Immediately Amend'),
          confirm() {
            openForm.call(that, state, {
              ...action,
              title: i18n('Reset'),
              blockId: res.errBlock.id,
              blockType: res.errBlock.type,
            });
          },
        });
      }
    }

  });
}

function publishForms(state, action) {
  const that = this;

  const { blocks } = state;
  validateAllForms(that, blocks).then((res) => {
    console.log(res.valid);
    console.log(res.errBlock);

    const source = util.getSource() || {};
    const { name, timeout } = source;

    if(blocks.length===0){
      dialog(<div className="neo-confirm">{i18n('The empty templates can not be saved')}</div>, {
        title: i18n('Prompt'),
        style: { width: '400px' },
        abortTitle: i18n('Cancel'),
        confirm() {
          return;
        },
      });
    }else{
      if (res.valid) {
        dialog(<SubmitForm name={name} timeout={timeout} />, {
          title: i18n('Submit Template'),
          style: { width: '600px' },
          abortTitle: i18n('Cancel'),
          confirm() {
            const valid = this.child.isValid();
            if (!valid) {
              this.child.showRequired();
            } else {
              const form = this.child.getForm();
              const { blocks, connections } = state;
              const parsedForms = util.convertForms(blocks, connections);

              const postData = {
                ...form,
                only_save: false,
                template: `${JSON.stringify(parsedForms.connections)}&${JSON.stringify(parsedForms.blocks)}&[]`,
              };
              // todo post data with ajax
              // localStorage.setItem('ra', JSON.stringify(postData));
              handleSubmit(postData);
            }
            return valid;
          },
        });
      } else {
        const name = (res.errBlock.form && res.errBlock.form.name) || res.errBlock.name;
        dialog(<div className="neo-confirm">{name + i18n('Forms filled in incorrectly,please be revised and resubmitted')}</div>, {
          title: i18n('Forms filled in incorrectly'),
          style: { width: '400px' },
          abortTitle: i18n('Cancel'),
          confirmTitle: i18n('Immediately Amend'),
          confirm() {
            openForm.call(that, state, {
              ...action,
              title: i18n('Reset'),
              blockId: res.errBlock.id,
              blockType: res.errBlock.type,
            });
          },
        });
      }
    }
  });
}

function clearForms(state, action) {
  const that = this;
  dialog(<div className="neo-confirm">{i18n('Confirm the deletion of all the elements and link it')}</div>, {
    title: i18n('Prompt'),
    style: { width: '400px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      that.setState({
        blocks: [],
        connections: [],
      });
    },
  });
}

function removeConnModal(state, action) {
  const that = this;
  dialog(<div className="neo-confirm">{i18n('This link to confirm the deletion')}</div>, {
    title: i18n('Prompt'),
    style: { width: '400px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      const connections = removeConnection(state.connections, action.from, action.to);
      that.setState({
        ...state,
        connections,
      });
    },
  });
}
function autoSave() {
  this.auto = setInterval(() => {
    util.saveLocal(this.state);
  }, 30 * 1000);
}

function restoreDataConfirm(state, action) {
  const that = this;
  const data = util.restoreLocal();
  if (!data) {
    autoSave.call(that);
    return;
  }
  const time = new Date(data.time).toLocaleString();
  dialog(<div className="neo-confirm">{i18n('Find')+time+i18n('Generated not save a draft schedule, whether the load?')}</div>, {
    title: i18n('Prompt'),
    style: { width: '400px' },
    abortTitle: i18n('No Longer Need'),
    confirmTitle: i18n('Load'),
    abort() {
      util.clearStore();
    },
    confirm() {
      that.setState({
        blocks: data.blocks,
        connections: data.connections,
      });
      util.clearStore();
      autoSave.call(that);
    },
  });
}

// 在此处this指向ResourceArragement, 通过this.setState可以操作state
export default function (state, action) {
  console.log('action', action);
  console.log('state', state);
  switch (action.type) {
    case CONSTANT.UPDATE_FORM_VM:
    case CONSTANT.UPDATE_FORM_HARDDISK:
    case CONSTANT.UPDATE_FORM_IP:
    case CONSTANT.UPDATE_FORM_VLAN:
    case CONSTANT.UPDATE_FORM_BALANCE:
    case CONSTANT.UPDATE_FORM_LISTEN:
    case CONSTANT.UPDATE_FORM_FIREWALL:
    case CONSTANT.UPDATE_FORM_ROUTER:
    case CONSTANT.UPDATE_FORM_OPENVPN:
    case CONSTANT.UPDATE_FORM_PPTP:
    case CONSTANT.UPDATE_FORM_MYSQL:
    case CONSTANT.UPDATE_FORM_MYSQLREPLICA:
    case CONSTANT.UPDATE_FORM_PHYSICS:
      openForm.call(this, state, action);
      return state;

    case CONSTANT.ADDLISTENER_FORM_BALANCING:
      addBalanceListener.call(this, state, action);
      return state;

    case CONSTANT.MANAGEBACKEND_FORM_LISTEN:
      manageListenBackends.call(this, state, action);
      return state;

    case CONSTANT.MANAGEPOLICY_FORM_LISTEN:
      manageListenPolicies.call(this, state, action);
      return state;

    case CONSTANT.ADDRULE_FORM_FIREWALL:
      createFirewallRule.call(this, state, action);
      return state;

    case CONSTANT.VIEWRULE_FORM_FIREWALL:
      manageFirewallRule.call(this, state, action);
      return state;
    case CONSTANT.PPTP_FORM_ROUTER:
      createPPTP.call(this, state, action);
      return state;

    case CONSTANT.OPENVPN_FORM_ROUTER:
      createOpenVPN.call(this, state, action);
      return state;

    case CONSTANT.MANAGEUSER_FORM_PPTP:
      managePPTPUsers.call(this, state, action);
      return state;

    case CONSTANT.CREATEINSTANCE_FORM_MYSQL:
      createMysqlInstance.call(this, state, action);
      return state;

    case CONSTANT.SAVE_FORMS:
      saveForms.call(this, state, action);
      return state;

    case CONSTANT.PUBLISH_FORMS:
      publishForms.call(this, state, action);
      return state;

    case CONSTANT.CLEAR_FORMS:
      clearForms.call(this, state, action);
      return state;

    case CONSTANT.DELETE_CONNECTION:
      removeConnModal.call(this, state, action);
      return state;

    case CONSTANT.RESTORE_DATA:
      restoreDataConfirm.call(this, state, action);
      return state;

    case CONSTANT.DELETE_FORM_VM:
    case CONSTANT.DELETE_FORM_HARDDISK:
    case CONSTANT.DELETE_FORM_IP:
    case CONSTANT.DELETE_FORM_VLAN:
    case CONSTANT.DELETE_FORM_BALANCE:
    case CONSTANT.DELETE_FORM_LISTEN:
    case CONSTANT.DELETE_FORM_FIREWALL:
    case CONSTANT.DELETE_FORM_ROUTER:
    case CONSTANT.DELETE_FORM_PPTP:
    case CONSTANT.DELETE_FORM_OPENVPN:
    case CONSTANT.DELETE_FORM_MYSQL:
    case CONSTANT.DELETE_FORM_MYSQLREPLICA:
    case CONSTANT.DELETE_FORM_PHYSICS:

      openDeleteModal.call(this, state, action);
      return state;
    default:
      return state;
  }
}
