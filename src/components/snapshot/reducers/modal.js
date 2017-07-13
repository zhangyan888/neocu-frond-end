/**
 * Created by ssehacker on 2017/3/24.
 */
import * as CONSTANT from '../constant';
import dialog, { error, success } from '../../../components/dialog';
import { request } from '../../../util';
import service from '../../../services';
import {
  NewStorageForm,
  SnapshotForm,
  PureSnapshotForm,
} from '../forms';

function confirm(title, content) {
  dialog(<div className="neo-confirm">{content}</div>, {
    title,
    style: { maxWidth: '400px' },
    confirmTitle: i18n('OK'),
  });
}

function openNewStorageForm(state, action) {
  const that = this;
  dialog(<NewStorageForm ctx={that} />, {
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
        console.log(form);
      }
      return valid;
    },
  });
}

function openEditSnapshotForm(state, action) {
  const ctx = this;
  dialog(<PureSnapshotForm ctx={ctx} {...action.form} />, {
    title: '编辑快照',
    style: { maxWidth: '700px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      const valid = this.child.isValid();
      // 表单验证
      if (!valid) {
        this.child.showRequired();
      } else {
        const form = this.child.getForm();
        service.editSnapshot(action.form.id, form)
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
            } else {
              // todo: 错误处理
              console.error(res);
            }
          });
      }
      return valid;
    },
  });
}

function openShowSnapshotForm(state, action) {
  const ctx = this;
  dialog(<SnapshotForm ctx={ctx} id={action.id} />, {
    title: '查看快照',
    style: { maxWidth: '700px' },
    confirmTitle: i18n('OK'),
  });
}

// todo: 删除操作
function openRemoveSnapshotForm(state, action) {
  const ctx = this;
  dialog(<div className="neo-confirm">删除操作不可撤销，您确定要删除吗？</div>, {
    title: '提示',
    style: { maxWidth: '400px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      console.log('要删除的ID：' + action.id);
      service.removeSnapshot(action.id)
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

// todo: 批量删除接口
function openRemoveAllSnapshotConfirm(state, action) {
  const ctx = this;
  dialog(<div className="neo-confirm">批量删除操作不可撤销，您确定要删除吗？</div>, {
    title: '提示',
    style: { maxWidth: '400px' },
    abortTitle: i18n('Cancel'),
    confirm() {
      const selectedSnapshots = state.rows.filter(item => item.select).map(item => item.id);
      selectedSnapshots.forEach((id) => {
        service.removeSnapshot(id)
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
      console.log(selectedSnapshots.join(' '));
    },
  });
}


// 在此处this指向Storage, 通过this.setState可以操作state
export default function (state, action) {
  console.log('action', action);
  console.log('state', state);
  switch (action.type) {
    case CONSTANT.CREATE_STORAGE:
      openNewStorageForm.call(this, state, action);
      return state;

    case CONSTANT.REMOVE_ALL_SNAPSHOT:
      openRemoveAllSnapshotConfirm.call(this, state, action);
      return state;

    case CONSTANT.EDIT_SNAPSHOT:
      openEditSnapshotForm.call(this, state, action);
      return state;

    case CONSTANT.REMOVE_SNAPSHOT:
      openRemoveSnapshotForm.call(this, state, action);
      return state;

    case CONSTANT.SHOW_SNAPSHOT_DETAIL:
      openShowSnapshotForm.call(this, state, action);
      return state;

    default:
      return state;
  }
}
