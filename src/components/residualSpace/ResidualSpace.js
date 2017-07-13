import classnames from 'classnames';
import ResidualSpaceItem from './ResidualSpaceItem';
import './ResidualSpace.less';

class ResidualSpace extends React.Component {

  static propTypes = {
    data: React.PropTypes.object,
    newData: React.PropTypes.number,
  }

  static defaultProps = {
    // newData: 0,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {data, newData} = this.props;
    return (  
      <div className="neo-residualSpace">
        <h4 className="neo-residualSpace-title">{data.name}</h4>
        {
          data.list.map(item => <ResidualSpaceItem key={item.id} {...item} />)
        }
      </div>
    );
  }
}

export default ResidualSpace;