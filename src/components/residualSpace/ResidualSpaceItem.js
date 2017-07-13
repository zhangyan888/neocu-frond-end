import classnames from 'classnames';
import Progress from '../progress';
import './ResidualSpace.less';

const {ProgressGroup, ProgressBar} = Progress;

class ResidualSpaceItem extends React.Component {
  render() {
    const {name, used, total, unit, newData} = this.props;
    const oldP = parseInt(used / total * 100);
    const newP = parseInt(newData / total * 100);
    const roomP = ((total - used) / total * 100);
    return (
      <div className="neo-residualSpace-item">
        <dl className="neo-residualSpace-info">
          <dt>{name}</dt>
          <dd>已使用( {used} {unit} ) <span className="neo-residualSpace-useable">总计( {total} {unit} )</span></dd>
        </dl>
        <ProgressGroup>
          <ProgressBar percent={oldP} />
          <ProgressBar percent={newP} type="primary" room={roomP} dynamic />
        </ProgressGroup>
      </div>
    )
  }
}

export default ResidualSpaceItem;