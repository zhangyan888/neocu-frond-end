import '../../app/common.less';
import '../../app/commonForm.less';
import './UserInfo.less';
import SubPage from '../../components/subPage';
import Label from '../../components/label';
import { error, success } from '../../components/dialog';
import { request, Msg, handleResError } from '../../util';

class UserInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      username: '',
      realname: '',
      department: '',
      email: '',
      phone: '',
      projects: [],
    };
  }

  componentDidMount() {
    request.get(`/project/settings/userinfo/api/${window.userId || '123'}`)
      .then(res => {
        if (res.ok) {
          const data = res.data;
          this.setState({
            username: data.username,
            realname: data.realname,
            department: data.department,
            email: data.email,
            phone: data.phone,
            projects: data['project-role'] || [],
            loaded: true,
          });
        } else {
          error(res.msg || Msg.FETCH_DATA_ERROR);
        }
      }).catch(handleResError);
  }

  renderRoleInfo() {
    const { projects } = this.state;
    return projects.map(item => {
      return (
        <div key={item.id} className="neo-form-line">
          <Label>{item.id}：</Label>
          <p>{item.roles.join('、')}</p>
        </div>
      );
    });
  }

  render() {
    if(!window.is_admin){
      const me = this;
      const { loaded, username, realname, department, email, phone, projects } = this.state;
      return (
          <div className="neo-user-info-page">
            <SubPage loaded={loaded} title="基本信息">
              <div className="neo-UserInfo">
                <div className="neo-form">
                  <div className="neo-form-line">
                    <Label>用户名：</Label>
                    <p>{username}</p>
                  </div>
                  <div className="neo-form-line">
                    <Label>姓名：</Label>
                    <p>{realname}</p>
                  </div>
                  <div className="neo-form-line">
                    <Label>部门：</Label>
                    <p>{department}</p>
                  </div>
                  <div className="neo-form-line">
                    <Label>邮箱：</Label>
                    <p>{email}</p>
                  </div>
                  <div className="neo-form-line">
                    <Label>手机号：</Label>
                    <p>{phone}</p>
                  </div>
                </div>
              </div>
            </SubPage>
            <SubPage loaded={loaded} title="角色信息">
              <div className="neo-UserInfo">
                <div className="neo-form">
                  {me.renderRoleInfo()}
                </div>
              </div>
            </SubPage>
          </div>
      );
    } else {
      const me = this;
      const { loaded, username, realname, department, email, phone, projects } = this.state;
      return (
          <div className="neo-user-info-page">
            <SubPage loaded={loaded} title="基本信息">
              <div className="neo-UserInfo">
                <div className="neo-form">
                  <div className="neo-form-line">
                    <Label>用户名：</Label>
                    <p>{username}</p>
                  </div>
                  <div className="neo-form-line">
                    <Label>姓名：</Label>
                    <p>{realname}</p>
                  </div>
                  <div className="neo-form-line">
                    <Label>部门：</Label>
                    <p>{department}</p>
                  </div>
                  <div className="neo-form-line">
                    <Label>邮箱：</Label>
                    <p>{email}</p>
                  </div>
                  <div className="neo-form-line">
                    <Label>手机号：</Label>
                    <p>{phone}</p>
                  </div>
                </div>
              </div>
            </SubPage>
          </div>
      );
    }
  }
}

export default UserInfo;
