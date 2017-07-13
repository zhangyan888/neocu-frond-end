/**
 * Created by ssehacker on 2017/3/24.
 */
import * as CONSTANT from '../constant';
import dialog, { error, success } from '../../../components/dialog';
import { request, Msg, handleResError, indexBy } from '../../../util';
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
} from '../forms';

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
  service.fetchPureStorage(action.form.id).then((res) => {
    if (res.ok) {
      const data = res.data;
      const { name, description } = data;
      dialog(<PureStorageForm ctx={ctx} name={name} desc={description} />, {
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
            service.editStorage(action.form.id, { name: form.name, description: form.desc })
              .then((res) => {
                if (res.ok) {
                  let { rows } = ctx.state;
                  rows = rows.map((item) => {
                    if (item.id === action.form.id) {
                      return {
                        ...item,
                        ...form,
                      };
                    }
                    return item;
                  });
                  ctx.setState({
                    rows,
                  });
                  success(res.msg || Msg.OPERATE_SUCCESS);
                } else {
                  error(res.msg || Msg.OPERATE_ERROR);
                }
              }).catch(handleResError);
          }
          return valid;
        },
      });
    } else {
      handleResError('无法获取云硬盘详情');
    }
  }).catch(handleResError);
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
            let { rows } = ctx.state;
            rows = rows.filter(item => item.id !== action.id);
            ctx.setState({
              rows,
            });
            success(res.msg);
          } else {
            error(res.msg);
          }
        });
    },
  });
}

function openResizeStorageForm(state, action) {
  const that = this;
  service.fetchStorageUsages().then(res => {
    if (res.ok) {
      const data = res.data;
      const totalCount = data.maxTotalVolumeGigabytes;
      const usedCount = data.totalGigabytesUsed;
      dialog(<ResizeStorageForm ctx={that} totalCount={totalCount} usedCount={usedCount} {...action.form} />, {
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
            service.resizeStorage(action.form.id, form.size)
              .then((res) => {
                if (res.ok) {
                  let { rows } = that.state;
                  rows = rows.map((item) => {
                    if (item.id === action.form.id) {
                      return {
                        ...item,
                        size: form.size,
                      };
                    }
                    return item;
                  });
                  that.setState({
                    rows,
                  });
                  success(res.msg);
                } else {
                  error(res.msg || Msg.OPERATE_ERROR);
                }
              }).catch(handleResError);
          }
          return valid;
        },
      });
    } else {
      error(res.msg || Msg.FETCH_DATA_ERROR);
    }
  });
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
          .then(res => {
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
  service.fetchAutoSnapshotSetting(action.id)
    .then((res) => {
      if (res.ok) {
        const data = res.data;
        const period = data.executeTime;
        const type = data.executeCycle;
        const hour = data.executeCycleHour;
        const minute = data.executeCycleMinute;
        const maxCount = data.snapshotLimit;
        const status = data.executeStatus;
        const form = { period, type, hour, minute, maxCount, status };
        dialog(<AutoSnapshootForm ctx={that} {...form} />, {
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
              const setting = {
                executeTime: form.period, // day：每天（默认）， week：每周
                executeCycleHour: form.hour && parseInt(form.hour), // 凌晨1点， None：无
                executeCycleMinute: form.minute && parseInt(form.minute), // 凌晨1点10分， None：无
                snapshotLimit: form.maxCount && parseInt(form.maxCount), // 保留快照的个数 10个， 默认10 最小1 最大10
                executeStatus: form.status,
                executeCycle: form.type || null, // 当executeTime是week时才显示， None:无， 1：周一， 2：周二 ...
              };
              service.saveAutoSnapShotSetting(action.id, setting)
                .then((res2) => {
                  if (res2.ok) {
                    success(res2.msg);
                  } else {
                    error(res2.msg);
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
      const { rows } = that.state;
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
  service.fetchStorage(id)
    .then((res) => {
      if (res.ok) {
        const attached_to = res.data.attached_to;

        let hasAttached = attached_to.length;
        if (!hasAttached) {
          openManageConnectionForm(id);
        } else {
          openManageConnectionCancelForm(id, attached_to[0]);
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
      const tableActions = indexBy(data.table_actions || [], 'id');
      const hasMoreData = data.has_more_data;
      const hasPrevData = data.has_prev_data;
      const rows = data.rows;
      const createEnable = !!tableActions.create && tableActions.create.enabled;
      const deleteEnable = !!tableActions.delete && tableActions.delete.enabled;
      console.log(rows);
      this.setState({
        rows,
        hasPrevData,
        hasMoreData,
        createEnable,
        deleteEnable,
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
