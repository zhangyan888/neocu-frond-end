
import './EntityDetailCustom.less';

class EntityDetailCustom extends React.Component {

  render() {
    return (
      <div className="neo-entityDetailCustom">
        {this.props.children}
      </div>
    );
  }
}

export default EntityDetailCustom;
