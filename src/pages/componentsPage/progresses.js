
import Progress from '../../components/progress';
import Button from '../../components/button';
import Form from '../../components/form';
const { RadioButtonList } = Form;
const {ProgressGroup, ProgressBar} = Progress;

class ProgressComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      percent: 30,
    }
  }

  changePercent() {
    const value = parseInt(Math.random() * 100, 10);
    this.setState({
      percent: value,
    })
  }

  render() {
    const progressbars = [{type: "normal", percent: '20'}, {type: "primary", percent: '30'}, {type: "warning", percent: '30'}];
    const remain = 100 - 20;
    const newData = this.state.percent < remain ? this.state.percent : remain;
    return (
      <div style={{"width": "400px", "margin": "30px"}}>
        <Progress percent={50} />
        <Progress percent={30} striped />
        <Progress percent={60} striped active />
        <Progress percent={100} />
        <Progress percent={60} type="success" size="large" />
        <Progress percent={this.state.percent} dynamic />
        <Progress percent={60} type="primary" />
        <Progress percent={50} type="info" />
        <Progress percent={60} type="warning" size="small" />
        <Progress percent={60} type="danger" size="large" />
        <Progress percent={60} round />
        <Button className="m-b" onClick={this.changePercent.bind(this)} name="点击" type='normal' />

        <ProgressGroup>
          <ProgressBar percent={20} />
          <ProgressBar percent={newData} type="primary" room={remain} dynamic />
        </ProgressGroup>

        <RadioButtonList />
      </div>  
    )
  }
}

export default ProgressComponent;