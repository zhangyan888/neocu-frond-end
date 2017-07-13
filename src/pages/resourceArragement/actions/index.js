/**
 * Created by ssehacker on 2017/4/13.
 */
import * as CONSTANT from '../constant';

export const saveForms = () => ({
  type: CONSTANT.SAVE_FORMS,
});

export const publishForms = () => ({
  type: CONSTANT.PUBLISH_FORMS,
});

export const clearForms = () => ({
  type: CONSTANT.CLEAR_FORMS,
});

export const deleteConnection = (from, to) => ({
  type: CONSTANT.DELETE_CONNECTION,
  from,
  to,
});

export const restoreData = () => ({
  type: CONSTANT.RESTORE_DATA,
});
