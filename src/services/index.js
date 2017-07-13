/**
 * Created by ssehacker on 2017/5/16.
 */
import { request } from '../util';

const svc = {};

svc.fetchEntities = (entityType, filter, resourceIdOrPage, isBackward = true) => {
  const url = `/project/${entityType}/api/`;
  let prevMarker;
  let marker;
  let page;
  if (typeof resourceIdOrPage === 'number') {
    page = resourceIdOrPage;
  } else {
    if (isBackward) {
      marker = resourceIdOrPage;
    } else {
      prevMarker = resourceIdOrPage;
    }
  }
  return request.get(url, {
    data: {
      filter,
      prev_marker: prevMarker,
      marker,
      page,
    },
  });
};

// 硬盘 Storage
svc.fetchStorages = (filter, resourceIdOrPage, isBackward = true) => (
  svc.fetchEntities('storage', filter, resourceIdOrPage, isBackward)
);

svc.editStorage = (id, entity) => {
  const url = `/project/storage/api/${id}/edit/`;
  return request.post(url, entity);
};

svc.fetchStorage = (id) => {
  const url = `/project/storage/api/${id}/`;
  return request.get(url);
};

svc.fetchPureStorage = (id) => {
  const url = `/project/storage/api/${id}/edit/`;
  return request.get(url);
};

svc.fetchStorageUsages = () => {
  const url = '/project/storage/api/usages/';
  return request.get(url);
};

svc.createSnapshot = (storageId, name, description) => {
  const url = `/project/storage/api/${storageId}/create_snapshot/`;
  return request.post(url, {
    name,
    description,
  });
};

svc.removeStorage = (id) => {
  const url = `/project/storage/api/${id}/`;
  return request.delete(url);
};

svc.resizeStorage = (id, size) => {
  const url = `/project/storage/api/${id}/extend_volume/`;
  return request.post(url, { new_size: size });
};

svc.fetchStorageTypes = () => {
  const url = '/project/storage/api/volume_types/';
  return request.get(url);
};

// 三种情况，字段略有不同： 1. 普通新建云硬盘 2.从快照创建云硬盘 3.从现有云硬盘创建（复制）
svc.createStorage = (form) => {
  const url = '/project/storage/api/create_volume/';
  return request.post(url, form);
};

svc.fetchAutoSnapshotSetting = (id) => {
  const url = `/project/storage/api/${id}/auto_snapshot/`;
  return request.get(url);
};

svc.saveAutoSnapShotSetting = (id, setting) => {
  const url = `/project/storage/api/${id}/auto_snapshot/`;
  return request.post(url, setting);
};

svc.fetchStorageInfoBeforeCopy = (id) => {
  const url = `/project/storage/api/create_volume?source_volid=${id}`;
  return request.get(url);q
};

svc.fetchConnectableInstanceByStorage = (storageId) => {
  const url = `/project/storage/api/${storageId}/edit_attachments/`;
  return request.get(url);
};

svc.attachStorageToInstance = (storageId, instanceId) => {
  const url = `/project/storage/api/${storageId}/edit_attachments/`;
  return request.post(url, {
    attach_type: 'attach',
    instance_id: instanceId,
  });
};

svc.detachStorageToInstance = (storageId, attachment_id, server_id, device) => {
  const url = `/project/storage/api/${storageId}/edit_attachments/`;
  return request.post(url, {
    attach_type: 'detach',
    attachment_id,
    server_id,
    device,
  });
};

svc.gotoStorageList = () => {
  const url = '/project/storage/';
  window.location.href = url;
};

/****************  快照 Snapshot ***************************/
svc.fetchSnapshots = (filter, resourceIdOrPage, isBackward = true) => (
  svc.fetchEntities('snapshot', filter, resourceIdOrPage, isBackward)
);

svc.editSnapshot = (id, entity) => {
  const url = `/project/snapshot/api/${id}/edit/`;
  return request.post(url, entity);
};

svc.removeSnapshot = (id) => {
  const url = `/project/snapshot/api/${id}/`;
  return request.delete(url);
};

svc.fetchSnapshot = (id) => {
  const url = `/project/snapshot/api/${id}/`;
  return request.get(url);
};

export default svc;
