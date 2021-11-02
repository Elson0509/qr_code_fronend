//import pages
import VisitorList from '../../pages/Visitor/VisitorList';
import VisitorAdd from '../../pages/Visitor/VisitorAdd';
import VisitorEdit from '../../pages/Visitor/VisitorEdit';

const ResidentRoutes = [
    {
        key: 'visitorList',
        path: '/visitors/list',
        component: VisitorList
    },
    {
        key: 'visitorAdd',
        path: '/visitors/add',
        component: VisitorAdd
    },
    {
        key: 'visitorEdit',
        path: '/visitors/edit',
        component: VisitorEdit
    },

    
]

export default ResidentRoutes;