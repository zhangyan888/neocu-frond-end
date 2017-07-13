/**
 * Created by ssehacker on 2016/10/19.
 */
export const error = (msg) => {
  horizon.alert('error', msg);
};

export const success = (msg) => {
  horizon.alert('success', msg);
};

export default from './Dialog';
