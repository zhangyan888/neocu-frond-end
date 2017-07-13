import classnames from 'classnames';
import './Detail.less';
import Dropdown from '../dropdown';

class DetailTitle extends React.Component {
    static propTypes = {        
        title: React.PropTypes.string,
        operate: React.PropTypes.object,
    };

    static defaultProps = {
        title: '标题',
        operate: {
            title: '操作',
            options: [
                {
                    id: 1,
                    name: '编辑',
                    disable: true,
                    callback: null,
                }, {
                    id: 2,
                    name: '删除',
                    disable: true,
                    callback: null,
                },
            ]
        },
    };

    constructor(props) {
        super(props);
        // this.state = {
        //     isFlag: false,
        // }
    }

    render () {
        const { title, operate} = this.props;
        return (
            <div className="neo-detail-title" >
                <h4 className='neo-title'>{title}</h4>
                {
                    !!operate ? 
                    <Dropdown 
                        options={operate.options}
                        title={operate.title}
                        btnType="default"
                        btnSize="small"
                        placement="bottomRight"
                    /> :
                    null
                }
            </div>
        )
    }
}

export default DetailTitle;