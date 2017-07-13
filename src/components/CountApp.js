/**
 * Created by ssehacker on 2016/10/9.
 */

class Counter extends React.Component {
  static propTypes = {
    isRed: React.React.PropTypes.bool.isRequired,
    count: React.PropTypes.number.isRequired,
    onIncreaseClick: React.PropTypes.func.isRequired,
    onReduceClick: React.PropTypes.func.isRequired,
    onColorClick: React.PropTypes.func.isRequired,
  };

  render() {
    const { isRed, count, onIncreaseClick, onReduceClick, onColorClick } = this.props;

    return (
      <div>
        <span style={{ color: isRed ? 'red' : 'black' }}>{count}</span>
        <button onClick={onIncreaseClick}>Increase</button>
        <button onClick={onReduceClick}>Reduce</button>
        <button onClick={onColorClick}>Color</button>
      </div>
    );
  }
}


export default Counter;
