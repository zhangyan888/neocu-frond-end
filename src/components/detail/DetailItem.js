import './Detail.less';

class DetailItem extends React.Component {
    static propTypes = {        
        name: React.PropTypes.string,
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array,
        ]),
    };

    renderValue() {
        const value = this.props.value;
        return (
                value.map((item, index) => {
                    for (let prop in item) {
                        if (prop.indexOf("name") >= 0) {
                            let itemValue = item[prop];
                            return (<p key={index}> {itemValue} </p>);
                        }
                    }
                })
        )
    }

    render () {
        const { name, value } = this.props;
        if (typeof value !== 'string') {
            return (
                <dl className="neo-detailItem">
                    <dt>{name}：</dt>
                    <dd>
                        {this.renderValue()}
                    </dd>
                </dl>
            )
        }
        return (
            <dl className="neo-detailItem">
                <dt>{name}：</dt>
                <dd>{value}</dd>
            </dl>
        )
    }
}

export default DetailItem;