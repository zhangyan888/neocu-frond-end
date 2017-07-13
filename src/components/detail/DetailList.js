import './Detail.less';
import DetailItem from './DetailItem';

class DetailList extends React.Component {
    static propTypes = {        
        list: React.PropTypes.array,
    };

    static defaultProps = {
        list: [
            {
                id: 0,
                name: '名称',
                value: 'provider',
            },
            {
                id: 1,
                name: 'MTU',
                value: '9000',
            },
            {
                id: 2,
                name: '状态',
                value: '活跃',
            },
            {
                id: 3,
                name: '项目',
                value: 'admin',
            },
            {
                id: 4,
                name: '可用域 	',
                value: 'nova',
            },
        ]
    };

    render () {
        const { list, } = this.props;
        return (
            <div className="neo-detail-list" >
                {
                    list.map(item => (<DetailItem key={item.id} name={item.name} value={item.value} />))
                }
            </div>
        )
    }
}

export default DetailList;