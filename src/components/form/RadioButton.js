/**
 * Created by ssehacker on 2016/10/19.
 */
import classnames from 'classnames';

  
class RadioButton extends React.Component {

  handleChange(event){
    // this.setState({selectedValue: event.target.value});
    if(this.props.onSelectedValueChanged){
     this.props.onSelectedValueChanged(event);
    }
  }
 
  render() {
    return (
      <label htmlFor={this.props.id}>
          <input type="radio"
          id={this.props.id}
          name={this.props.name}
          value={this.props.value}
          checked={this.props.checked}
          onChange = {this.handleChange.bind(this)}/>
          {this.props.text}
    </label>
    );
  }
}

export default RadioButton;
