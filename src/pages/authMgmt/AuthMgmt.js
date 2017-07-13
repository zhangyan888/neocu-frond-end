import '../../app/common.less';
import './AuthMgmt.less';
import Button from '../../components/button';
import Label from '../../components/label';
import SubPage from '../../components/subPage';
import { error, success } from '../../components/dialog';
import { Msg, request } from '../../util';

class AuthMgmt extends React.Component {
  constructor(props) {
    super(props);
    this.baseUrl = '/platformlicense/config';
    const now = new Date();
    this.state = {
      author: '',
      timeOfLoadFile: '',
      expires: '',
      isExpires: false,
      loaded: false,
    };
  }

  componentDidMount() {
    const me = this;
    me.fetchData((data) => {
      me.setState({
        author: data.author,
        timeOfLoadFile: data.timeOfLoadFile,
        expires: data.expires,
        isExpired: data.isExpired,
        loaded: true,
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const me = this;
    const formNode = ReactDOM.findDOMNode(this.form);
    if (formNode && !prevState.loaded && me.state.loaded) {
      formNode.querySelector('input[name=file]').onchange = function() {
        const that = this;
        const file = that.files[0];
        const size = file.size;
        if (size > 1 * 1024 * 1024) {
          error('文件不得大于1M');
          this.value = '';
        } else {
          me.handleUpload(() => {
            that.value = '';
          });
        }
      };
    }
  }

  fetchData(callback) {
    request.get(this.baseUrl)
      .then((res) => {
        if (res.ok) {
          callback(res.data);
        } else {
          error(res.msg);
        }
      })
      .catch(() => {
        error(Msg.FETCH_DATA_ERROR);
      });
  }

  handleUpload(callback) {
    const formData = new FormData(ReactDOM.findDOMNode(this.form));
    request.upload('/platformlicense/upload', formData)
      .then((res) => {
        if (res.ok) {
          success('导入成功');
        } else {
          error(res.msg);
        }
        callback && callback();
      })
      .catch(() => {
        error(Msg.OPERATE_ERROR);
        callback && callback();
      });
  }

  handleUploadBtnClick() {
    const formNode = ReactDOM.findDOMNode(this.form);
    formNode.querySelector('input[name=file]').click();
  }

  render() {
    const me = this;
    const { handleUploadBtnClick } = me;
    const { author, timeOfLoadFile, expires, isExpired, loaded } = me.state;
    return (
      <SubPage loaded={loaded} title="当前授权信息">
        <div className="neo-authMgmt">
          <div className="neo-authMgmt-wrapper">
            <p><Label>授权人：</Label><span>{author}</span></p>
            <p>
              <Label>授权文件导入时间：</Label>
              <span>{timeOfLoadFile}</span>
            </p>
            <p>
              <Label>使用有效期：</Label>
              <span>{expires}</span>
              <a style={{ display: isExpired ? 'inline-block' : 'none' }} className="neo-warning">（已过期）</a>
            </p>
            <div className="neo-upload-btn">
              <Button onClick={handleUploadBtnClick.bind(me)}>导入新的授权文件</Button>
              <form ref={(form) => { this.form = form; }}>
                <input style={{ display: 'none' }} type="file" className="normalBtn" name="file" />
              </form>
              <p>导入新授权文件后，需注销并重新登录后方可生效</p>
            </div>
          </div>
        </div>
      </SubPage>
    );
  }
}

export default AuthMgmt;
