/**
 * Created by ssehacker on 2017/4/13.
 */
import * as CONSTANT from '../constant';

export const createStorage = () => ({
  type: CONSTANT.CREATE_STORAGE,
});

export const editSnapshot = (form) => ({
  type: CONSTANT.EDIT_SNAPSHOT,
  form,
});

export const removeSnapshot = (id) => ({
  type: CONSTANT.REMOVE_SNAPSHOT,
  id,
});

export const rollbackSnapshot = (id) => ({
  type: CONSTANT.ROLLBACK_SNAPSHOT,
  id,
});

export const removeAllSnapshot = () => ({
  type: CONSTANT.REMOVE_ALL_SNAPSHOT,
});

export const showSnapshotDetail = (id) => ({
  type: CONSTANT.SHOW_SNAPSHOT_DETAIL,
  id,
});
