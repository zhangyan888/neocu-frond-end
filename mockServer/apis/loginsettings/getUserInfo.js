/**
 * Created by ssehacker on 2017/5/23.
 */

module.exports = {
  method: 'GET',
  url: '/project/settings/userinfo/api/:userId',
  data: {
    "ok": true,
    "msg": "",
    "data": {
      "username": "uxe",
      "realname": "nihao",
      "department": "dev",
      "email": "yyy@163.com",
      "phone": "18019191919",
      "project-role": [
        {
          id: "projectA",
          roles: ["role-A", "role-B"],
        },
        {
          id: "projectB",
          roles: ["role-A", "role-B"],
        }
      ],
    }
  }
};