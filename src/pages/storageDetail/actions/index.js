/**
 * Created by ssehacker on 2017/4/13.
 */
import * as CONSTANT from '../constant';

export const createStorage = () => ({
  type: CONSTANT.CREATE_STORAGE,
});

export const editStorage = entity => ({
  type: CONSTANT.EDIT_STORAGE,
  entity,
});

export const removeStorage = (id) => ({
  type: CONSTANT.REMOVE_STORAGE,
  id,
});

export const manageConnection = (id, multiattach) => ({
  type: CONSTANT.MANAGE_CONNECTION,
  id,
  multiattach,
});

export const createSnapshoot = (storageId) => ({
  type: CONSTANT.CREATE_SNAPSHOOT,
  id: storageId,
});

export const resizeStorage = (entity) => ({
  type: CONSTANT.RESIZE_STORAGE,
  entity,
});

export const autoSnapshoot = () => ({
  type: CONSTANT.AUTO_SNAPSHOOT,
});

export const copyStorage = (form) => ({
  type: CONSTANT.COPY_STORAGE,
  form,
});

export const removeAllStorage = () => ({
  type: CONSTANT.REMOVE_ALL_STORAGE,
});

export const fetchStorageList = (query, resourceId, isBackward) => ({
  type: CONSTANT.FETCH_STORAGE_LIST,
  query,
  resourceId,
  isBackward,
});
