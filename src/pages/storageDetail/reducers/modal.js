/**
 * Created by ssehacker on 2017/3/24.
 */
import * as CONSTANT from '../constant';
import dialog, { error, success } from '../../../components/dialog';
import { request, handleResError, Msg } from '../../../util';
import service from '../../../services';
import * as actions from '../actions';
import {
  NewStorageForm,
  ResizeStorageForm,
  NewSnapshootForm,
  PureStorageForm,
  ManageConnectionForm,
  ManageConnectionCancelForm,
  ManageConnectionMultiattachForm,
  CopyStorageForm,
  AutoSnapshootForm,
} from '../../storage/forms';

function confirm(title, content) {
  dialog(<div className="neo-confirm">{content}</div>, {
    title,
    style: { maxWidth: '400px' },
    confirmTitle: i18n('OK'),
  });
}

function openNewStorageForm(state, action) {
  const ctx = this;
  dialog(<NewStorageForm ctx={ctx} />, {
    title: '创建云硬盘',
    style: { maxWidth: '700px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      const valid = this.child.isValid();
      // 表单验证
      if (!valid) {
        this.child.showRequired();
      } else {
        const form = this.child.getForm();
        service.createStorage({
          name: form.name,
          description: form.desc,
          volume_type: form.type,
          size: form.size,
          multiattach: form.shared,
        }).then((res) => {
          if (res.ok) {
            success('创建云硬盘成功！');
            dispatch.call(ctx, ctx.state, actions.fetchStorageList());
          } else {
            error(res.msg);
          }
        }).catch(handleResError);
      }
      return valid;
    },
  });
}

function openEditStorageForm(state, action) {
  const ctx = this;
  dialog(<PureStorageForm ctx={ctx} name={action.entity.name} desc={action.entity.description} />, {
    title: '编辑云硬盘',
    style: { maxWidth: '700px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      const valid = this.child.isValid();
      // 表单验证
      if (!valid) {
        this.child.showRequired();
      } else {
        const form = this.child.getForm();
        console.log(form);
        service.editStorage(action.entity.id, {
          name: form.name,
          description: form.desc,
        })
          .then((res) => {
            if (res.ok) {
              let { entity } = ctx.state;
              entity = {
                ...entity,
                name: form.name,
                description: form.desc,
              };
              ctx.setState({
                entity,
              });
            } else {
              error(res.msg || Msg.OPERATE_ERROR);
            }
          }).catch(handleResError);
      }
      return valid;
    },
  });
}

// todo: 删除操作
function openRemoveStorageForm(state, action) {
  const ctx = this;
  dialog(<div className="neo-confirm">删除操作不可撤销，您确定要删除吗？</div>, {
    title: '提示',
    style: { maxWidth: '400px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      console.log('要删除的ID：' + action.id);
      service.removeStorage(action.id)
        .then((res) => {
          if (res.ok) {
            success(res.msg);
            setTimeout(() => {
              service.gotoStorageList();
            }, 1000);
          } else {
            error(res.msg);
          }
        });
    },
  });
}

function openResizeStorageForm(state, action) {
  const that = this;
  service.fetchStorageUsages()
      .then(res => {
        console.log(res);

        if (res.ok) {
          const totalCount = res.data.maxTotalVolumes;
          const usedCount = res.data.volumesUsed;

          dialog(<ResizeStorageForm
              ctx={that}
              name={action.entity.name}
              size={action.entity.size}
              totalCount={totalCount}
              usedCount={usedCount}
          />, {
            title: '云硬盘扩容',
            style: { maxWidth: '700px' },
            abortTitle: i18n('Cancel'),
            confirm() {
              const valid = this.child.isValid();
              // 表单验证
              if (!valid) {
                this.child.showRequired();
              } else {
                const form = this.child.getForm();

                console.log(form);
              }
              return valid;
            },
          });
        } else {
          error(res.msg || Msg.OPERATE_ERROR);
        }
      }).catch(handleResError);

}

function openNewSnapshootForm(state, action) {
  const that = this;
  dialog(<NewSnapshootForm ctx={that} id={action.id} />, {
    title: '创建快照',
    style: { maxWidth: '700px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      const valid = this.child.isValid();
      // 表单验证
      if (!valid) {
        this.child.showRequired();
      } else {
        const form = this.child.getForm();
        service.createSnapshot(action.id, form.name, form.desc)
            .then((res) => {
              if (res.ok) {
                success(res.msg || Msg.OPERATE_SUCCESS);
              } else {
                error(res.msg || Msg.OPERATE_ERROR);
              }
            }).catch(handleResError);

      }
      return valid;
    },
  });
}


function openAutoSnapshootForm(state, action) {
  const that = this;
  dialog(<AutoSnapshootForm ctx={that} />, {
    title: '自动快照',
    style: { maxWidth: '700px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      const valid = this.child.isValid();
      // 表单验证
      if (!valid) {
        this.child.showRequired();
      } else {
        const form = this.child.getForm();
        console.log(form);
      }
      return valid;
    },
  });
}

function openManageConnectionForm(id) {
  const that = this;
  service.fetchConnectableInstanceByStorage(id)
      .then((res) => {
        if (res.ok) {
          const instances = res.data.instances;
          if (!instances.length) {
            error('没有可连接的云主机');
            return;
          }
          dialog(<ManageConnectionForm ctx={that} instanceOption={instances} instance={instances[0].id} />, {
            title: '管理已连接云硬盘',
            style: { maxWidth: '700px' },
            abortTitle: i18n('Cancel'),
            confirm() {
              const valid = this.child.isValid();
              // 表单验证
              if (!valid) {
                this.child.showRequired();
              } else {
                const form = this.child.getForm();
                service.attachStorageToInstance(id, form.instance)
                    .then((res2) => {
                      if (res2.ok) {
                        success(res2.msg || Msg.OPERATE_SUCCESS);
                      } else {
                        error(res2.msg || Msg.OPERATE_ERROR);
                      }
                    }).catch(handleResError);
              }
              return valid;
            },
          });
        } else {
          error(res.msg || Msg.FETCH_DATA_ERROR);
        }
      }).catch(handleResError);
}

function openManageConnectionCancelForm(id, attached_to) {
  const that = this;
  service.fetchConnectableInstanceByStorage(id)
      .then((res) => {
        if (res.ok) {
          const data = res.data;
          const { instance_name, attachment_id, server_id, device } = data;
          dialog(<ManageConnectionCancelForm
              ctx={that}
              instance={instance_name}
              device={device}
          />, {
            title: '管理已连接云硬盘',
            style: { maxWidth: '700px' },
            abortTitle: i18n('Cancel'),
            confirmTitle: i18n('分离云硬盘'),
            confirm() {
              service.detachStorageToInstance(id, attachment_id, server_id, device)
                  .then((res2) => {
                    if (res2.ok) {
                      success(res2.msg || Msg.OPERATE_SUCCESS);
                    } else {
                      error(res2.msg || Msg.OPERATE_ERROR);
                    }
                  }).catch(handleResError);
            },
          });
        } else {
          error(res.msg || Msg.FETCH_DATA_ERROR);
        }
      });
}

function openManageConnectionMultiattachForm(state, action) {
  const that = this;
  dialog(<ManageConnectionMultiattachForm ctx={that} volume_id={action.id} />, {
    title: '管理连接',
    style: { maxWidth: '700px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      const form = this.child.getForm();
      console.log(form);
    },
  });
}
function openCopyStorageForm(state, action) {
  const that = this;
  Promise.all([service.fetchStorageUsages(), service.fetchStorageInfoBeforeCopy(action.id)])
      .then(res => {
        const usage = res[0];
        const info = res[1];
        if (!usage.ok) {
          error(usage.msg || Msg.FETCH_DATA_ERROR);
          return;
        }

        if(!info.ok) {
          error(usage.msg || Msg.FETCH_DATA_ERROR);
          return;
        }

        const usageData = usage.data;
        const infoData = info.data;

       const sourceOption = [
         {
           id:infoData.origin_id,
           name:infoData.origin_name,
         },
       ];
        const form = {
          volumeTotal: usageData.maxTotalVolumeGigabytes,
          volumeUsed: usageData.totalGigabytesUsed,
          volumeTotalCount: usageData.maxTotalVolumes,
          volumeUsedCount: usageData.volumesUsed,
          name: infoData.name,
          description: infoData.description,
          size: infoData.size,
          shared: infoData.multiattach,
          source: infoData.origin_id,
          volume_type: infoData.volume_type,
          sourceOption,
        };
        dialog(<CopyStorageForm ctx={that} {...form} />, {
          title: '复制云硬盘',
          style: { maxWidth: '700px' },
          abortTitle: i18n('Cancel'),
          confirm() {
            const valid = this.child.isValid();
            // 表单验证
            if (!valid) {
              this.child.showRequired();
            } else {
              const newForm = this.child.getForm();
              console.log(form);
              service.createStorage({
                name: newForm.name,
                description: newForm.description,
                size: newForm.size,
                multiattach: newForm.shared,
                source_volid: newForm.source,
                volume_type: form.volume_type,
              }).then((res2) => {
                if (res2.ok) {
                  dispatch.call(that, that.state, actions.fetchStorageList());
                  success(res2.msg || Msg.OPERATE_SUCCESS);
                } else {
                  error(res2.msg || Msg.OPERATE_ERROR);
                }
              }).catch(handleResError);
            }
            return valid;
          },
        });
      }).catch(handleResError);
}

// todo: 批量删除接口
function openRemoveAllStorageConfirm(state, action) {
  const ctx = this;
  dialog(<div className="neo-confirm">批量删除操作不可撤销，您确定要删除吗？</div>, {
    title: '提示',
    style: { maxWidth: '400px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      const selectedStorage = state.rows.filter(item => item.select).map(item => item.id);
      selectedStorage.forEach((id) => {
        service.removeStorage(id)
          .then((res) => {
            if (res.ok) {
              let { rows } = ctx.state;
              rows = rows.filter(item => item.id !== id);
              ctx.setState({
                rows,
                allSelected: false,
              });
              success(res.msg);
            } else {
              error(res.msg);
            }
          });
      });
      console.log(selectedStorage.join(' '));
    },
  });
}

function manageConnectionFunc(state, action) {
  const id = action.id;
  const ctx = this;
  service.fetchStorage(id)
      .then((res) => {
        if (res.ok) {
          const attached_to = res.data.attached_to;

          let hasAttached = attached_to.length;
          if (!hasAttached) {
            openManageConnectionForm(id);
          } else {
            openManageConnectionCancelForm.call(ctx, id, attached_to[0]);
          }

        } else {
          // todo： 错误处理
          // console.error(res);
          error(res.msg || Msg.FETCH_DATA_ERROR);
        }
      }).catch(handleResError);
}

function refreshList(state, action) {
  service.fetchStorages(action.query, action.resourceId, action.isBackward).then((res) => {
    // this.handleStorageRes(res);
    if (res.ok) {
      const data = res.data;
      const hasMoreData = data.has_more_data;
      const hasPrevData = data.has_prev_data;
      const rows = data.rows;
      console.log(rows);
      this.setState({
        rows,
        hasPrevData,
        hasMoreData,
      });
      if (rows.length) {
        this.firstRowId = rows[0].id;
        this.lastRowId = rows[rows.length - 1].id;
      }
    } else {
      handleResError(res.msg);
    }
  });
}

// 在此处this指向Storage, 通过this.setState可以操作state
function dispatch(state, action) {
  console.log('action', action);
  console.log('state', state);
  switch (action.type) {
    case CONSTANT.CREATE_STORAGE:
      openNewStorageForm.call(this, state, action);
      return state;

    case CONSTANT.REMOVE_ALL_STORAGE:
      openRemoveAllStorageConfirm.call(this, state, action);
      return state;

    case CONSTANT.EDIT_STORAGE:
      openEditStorageForm.call(this, state, action);
      return state;

    case CONSTANT.REMOVE_STORAGE:
      openRemoveStorageForm.call(this, state, action);
      return state;

    case CONSTANT.RESIZE_STORAGE:
      openResizeStorageForm.call(this, state, action);
      return state;

    case CONSTANT.CREATE_SNAPSHOOT:
      openNewSnapshootForm.call(this, state, action);
      return state;

    case CONSTANT.MANAGE_CONNECTION:
      if (action.multiattach) {        
        openManageConnectionMultiattachForm.call(this, state, action);
      } else {
        manageConnectionFunc.call(this, state, action);
      }
      return state;

    case CONSTANT.AUTO_SNAPSHOOT:
      openAutoSnapshootForm.call(this, state, action);
      return state;

    case CONSTANT.COPY_STORAGE:
      openCopyStorageForm.call(this, state, action);
      return state;

    case CONSTANT.FETCH_STORAGE_LIST:
      refreshList.call(this, state, action);
      return state;

    default:
      return state;
  }
}

export default dispatch;
