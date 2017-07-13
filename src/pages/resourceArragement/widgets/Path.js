/**
 * Created by ssehacker on 2017/3/20.
 */
import util from './util';
import * as action from '../actions';

const PropTypes = React.PropTypes;
class Path extends React.Component {
  static contextTypes = {
    dispatch: React.PropTypes.func,
  };

  static propTypes = {
    from: PropTypes.object,
    to: PropTypes.object,
    points: PropTypes.array,
  };

  constructor(props) {
    super(props);
  }

  onClick() {
    const { dispatch } = this.context;
    const { from, to } = this.props;
    dispatch(action.deleteConnection(from.id, to.id));
  }

  render() {
    const { from, to, points } = this.props;
    const me = this;
    let d;
    if (points) {
      d = util.getPathDesc(points);
    } else {
      const res = util.getMinValidDistance(from, to);
      d = util.getPathDesc(res.minPoints, res.startMode, res.endMode);
    }

    return (
      <path
        d={d}
        stroke="#ccc"
        strokeWidth="2"
        strokeDasharray="4 2"
        fill="none"
        className="neo-path-line"
        onClick={me.onClick.bind(me)}
      />
    );
  }
}

export default Path;
