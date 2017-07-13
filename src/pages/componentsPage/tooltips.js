
import Tooltip from '../../components/tooltip';

class TooltipComponet extends React.Component {

  render() {
    const text = <span>这是一行提示！<br />又一行...</span>;
    const tooltipTitle = <i className="iconfont icon-question1"></i>;
    return (
      <div style={{margin: '30px 150px'}} >
        <Tooltip className="m-r" title="我的提示-向左" tips="这是一行提示！" placement="left" />
        <Tooltip className="m-r" title="我的提示-默认" tips="这是一行提示！" />
        <Tooltip className="m-r" title="我的提示-向下" tips="这是一行提示！" placement="bottom" />
        <Tooltip className="m-r" title="我的提示-向右" tips="这是一行提示！" placement="right" />
        <Tooltip className="m-r" title="我的提示-默认" tips={text} />
        <Tooltip title={tooltipTitle} tips="新大小必须大于当前设置" />
      </div>
    );
  }
}

export default TooltipComponet;