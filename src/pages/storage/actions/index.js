/**
 * Created by ssehacker on 2017/4/13.
 */
import * as CONSTANT from '../constant';

export const createStorage = () => ({
  type: CONSTANT.CREATE_STORAGE,
});

export const editStorage = (form) => ({
  type: CONSTANT.EDIT_STORAGE,
  form,
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

export const resizeStorage = (form) => ({
  type: CONSTANT.RESIZE_STORAGE,
  form,
});

export const autoSnapshoot = (id) => ({
  type: CONSTANT.AUTO_SNAPSHOOT,
  id,
});

export const copyStorage = (id) => ({
  type: CONSTANT.COPY_STORAGE,
  id,
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
