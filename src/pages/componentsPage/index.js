import ButtonComponent from './buttons';
import DropdownComponent from './dropdowns';
import DetailComponent from './details';
import PaginationComponet from './paginations';
import ProgressComponent from './progresses';
import TooltipComponent from './tooltips';

class ComponentsPage extends React.Component {
    render () {
        return (
            <div>
                <ButtonComponent/>
                <DropdownComponent/>
                <DetailComponent />
                <PaginationComponet />
                <ProgressComponent />
                <TooltipComponent />
            </div>
        );
    }
}

ReactDOM.render((<ComponentsPage />), document.querySelector('.site-recycle-mgmt') || document.querySelector('#app'));