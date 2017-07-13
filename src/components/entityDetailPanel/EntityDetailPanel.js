
import Detail from '../../components/detail';
import './EntityDetailPanel.less';


class EntityDetailPanel extends React.Component {

    static propTypes = {
        items: React.PropTypes.array,
    };

  render() {
    const items = this.props.items;
    return (
      <div className="neo-entityDetailPanel">
        {
            items.map(item => (<Detail key={item.id} title={item.name} operate={item.operate} list={item.options} />))
        }
      </div>
    );
  }
}

export default EntityDetailPanel;
