import { lot } from './lot/lot';
import { equipment } from './equipment/equipment';
import { borrow } from './borrow/borrow';
import { add_borrow } from './borrow/add_borrow';
import { borrow_history} from './borrow/borrow_history';
import { employee } from './employee/employee';
import { CRUD_building } from './location/CRUD_building';
import { CRUD_department } from './location/CRUD_department';
import { CRUD_room } from './location/CRUD_room';

export const api = {
    lot,
    equipment,
    borrow,
    add_borrow,
    borrow_history,
    employee,
    CRUD_building,
    CRUD_department,
    CRUD_room,
};
