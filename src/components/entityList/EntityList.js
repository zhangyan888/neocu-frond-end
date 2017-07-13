import classnames from 'classnames';
import Table from '../table';
import './EntityList.less';


class EntityList extends React.Component {

  static propTypes = {
    columns: React.PropTypes.array,
    data: React.PropTypes.array,
    pageDown: React.PropTypes.func,
    pageUp: React.PropTypes.func,
    hasMoreData: React.PropTypes.bool,
    hasPrevData: React.PropTypes.bool,
  };

  render() {
    const { columns, data, pageUp, pageDown, hasMoreData, hasPrevData } = this.props;

    return (
      <div className="neo-entity-list">
        <Table emptyText={() => i18n('No Data')} columns={columns} data={data} />
        <div className="neo-entity-list-page">
          <span>正在显示 {data.length} 项</span>
          <p>
            <a className={classnames({ disable: !hasPrevData })} onClick={hasPrevData && pageUp}><i className="iconfont icon-arrow" /></a>
            <a className={classnames({ disable: !hasMoreData })} onClick={hasMoreData && pageDown}><i className="iconfont icon-jiantou" /></a>
          </p>
        </div>
      </div>
    );
  }
}

export default EntityList;
