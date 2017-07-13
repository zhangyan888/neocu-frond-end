/**
 * Created by ssehacker on 2017/2/21.
 */

const config = {
  contentType: 'application/json; charset=utf-8',
  dataType: 'json',
};

function request(url, option) {
  return new Promise((resolve, reject) => {
    $.ajax({
      ...config,
      ...option,
      url,
      success: (res) => {
        resolve(res);
      },
      error: (...args) => {
        const res = args[0];
        if (res.status === 401) {
          window.location.href = '/auth/login';
        }
        reject(...args);
      },
    });
  });
}
export const get = (url, option) => request(url, {
  ...option,
  method: 'GET',
});

export const post = (url, data, rest) => request(url, {
  method: 'POST',
  data: JSON.stringify(data),
  ...rest,
});

export const put = (url, data) => request(url, {
  method: 'PUT',
  data: JSON.stringify(data),
});

export const del = (url) => request(url, {
  method: 'DELETE',
});

export const patch = (url, data) => request(url, {
  method: 'PATCH',
  data: JSON.stringify(data),
});

export const upload = (url, formData) => request(url, {
  method: 'POST',
  data: formData,
  cache: false,
  contentType: false,
  processData: false,
  xhr: () => $.ajaxSettings.xhr(), // Custom XMLHttpRequest
});
