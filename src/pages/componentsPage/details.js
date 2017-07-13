
import Detail from '../../components/detail';

var items = [
    {
        id: 1,
        name: '概述',
        operate: {
            title: '操作',
            options: [
                {
                    id: 1,
                    name: '编辑网络',
                    disable: true,
                    callback: null,
                }, {
                    id: 2,
                    name: '删除网络',
                    disable: true,
                    callback: null,
                },
            ]
        },
        options: [
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
    },{
        id: 2,
        name: '配置',
        operate: {
            title: '操作',
            options: [
                {
                    id: 1,
                    name: '编辑网络',
                    disable: true,
                    callback: null,
                }, {
                    id: 2,
                    name: '删除网络',
                    disable: true,
                    callback: null,
                },
            ]
        },
        options: [
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
                value: [{
                    service_id: '11111',
                    service_name: 'service_nameservice_name',
                }],
            },
        ]
    },
];




class DetailComponent extends React.Component {
    static propTypes = {        
        title: React.PropTypes.string,
        operate: React.PropTypes.object,
        list: React.PropTypes.array,
    };
    
    render () {
        return (
            <div className='neo-detail-content'>
               {
                   items.map(item => (<Detail key={item.id} title={item.name} operate={item.operate} list={item.options} />))
               }
            </div>
        )
    }
}
export default DetailComponent;