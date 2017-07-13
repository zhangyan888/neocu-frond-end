
import Button from '../../components/button';
import '../../app/common.less';

class ButtonComponent extends React.Component {
    render () {
        return (
            <div style={{padding: '30px'}}>
            <p className="m-b">
                <Button className="m-r" type='normal'>normal</Button>
                <Button className="m-r" type='ok'>OK</Button>
                <Button className="m-r" type='cancel'>cancel</Button>
                <Button className="m-r" type='create'>create</Button>
                <Button className="m-r" type='delete'>delete</Button>
            </p>
            <p className="m-b">
                <Button className="m-r" disabled={true} type='normal'>normal</Button>
                <Button className="m-r" disabled={true} type='ok'>OK</Button>
                <Button className="m-r" disabled={true} type='cancel'>cancel</Button>
                <Button className="m-r" disabled={true} type='create'>create</Button>
                <Button className="m-r" disabled={true} type='delete'>delete</Button>
            </p>
            <p className="m-b">
                <Button className="m-r" size='large' type='normal'>大尺寸按钮</Button>
                <Button className="m-r" type='normal'>默认按钮</Button>
                <Button className="m-r" size='small' type='normal'>小尺寸按钮</Button>
            </p>
            <p className="m-b">
                <Button className="m-r" type='primary'>主按钮</Button>
                <Button className="m-r" type='default'>次按钮</Button>
                <Button className="m-r" type='dashed'>虚线按钮</Button>
            </p>
            <p className="m-b">
                <Button className="m-r" type='info'>信息按钮</Button>
                <Button className="m-r" type='success'>成功按钮</Button>
                <Button className="m-r" type='warning'>警告按钮</Button>
                <Button className="m-r" type='danger'>危险按钮</Button>
            </p>
            <p className="m-b">
                <Button type='primary' block={true}>块按钮</Button>
            </p>
            </div>
        )
    }
}
export default ButtonComponent;