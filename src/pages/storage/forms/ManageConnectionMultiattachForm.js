/**
 * Created by ssehacker on 2017/5/10.
 */

import classnames from 'classnames';

import StorageSharedConnect from '../storageSharedConnect';

class ManageConnectionMultiattachForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  getForm() {
    return this.state.list;
  }

  getList(list) {
    this.setState({
      list: list,
    });
  }

  render() {
    const { volume_id } = this.props;
    return (
      <div className={classnames({ 'neo-form-storage': true})} >
          <StorageSharedConnect volume_id={volume_id} getList={this.getList.bind(this)} />
      </div>
    );
  }
}

export default ManageConnectionMultiattachForm;
