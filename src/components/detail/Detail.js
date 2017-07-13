import classnames from 'classnames';
import DetailTitle from './DetailTitle';
import DetailList from './DetailList';
import './Detail.less';

class Detail extends React.Component {
    static propTypes = {        
        className: React.PropTypes.string,
        title: React.PropTypes.string,
        operate: React.PropTypes.object,
        list: React.PropTypes.array,
    };

    render() {
        const {className, list, title, operate} = this.props;
        return (
            <div className={classnames({'neo-detail': true, [`${className}`]: !!className})}>
            
                <DetailTitle
                    title={title}
                    operate={operate}
                />
                <DetailList
                    list={list}
                />
                
            </div>
        )
    }
}

export default Detail;