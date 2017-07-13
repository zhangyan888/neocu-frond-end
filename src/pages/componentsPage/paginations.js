
import Pagination from '../../components/pagination';


class PaginationComponet extends React.Component {
  state = {
    current: 3,
  };
  onChange = (page) => {
    console.log(page);
    this.setState({
      current: page,
    });
  }
  render() {
    return <Pagination onChange={this.onChange} current={this.state.current} total={250} />;
  }
}

export default PaginationComponet;