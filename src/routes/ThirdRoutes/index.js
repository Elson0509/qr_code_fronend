//import pages
import ThirdList from "../../pages/Third/ThirdList";
import ThirdAdd from "../../pages/Third/ThirdAdd";
import ThirdEdit from "../../pages/Third/ThirdEdit";

const ThirdRoutes = [
    {
        key: 'ThirdList',
        path: '/thirds/list',
        component: ThirdList
    },
    {
        key: 'ThirdAdd',
        path: '/thirds/add',
        component: ThirdAdd
    },
    {
        key: 'ThirdEdit',
        path: '/thirds/edit',
        component: ThirdEdit
    },    
]

export default ThirdRoutes;