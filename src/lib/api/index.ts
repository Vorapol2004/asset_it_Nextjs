import { lot } from './lot/lot';
import { equipment } from './equipment/equipment';
import { add_equipment } from './equipment/add_equipment';
import { borrow } from './borrow/borrow';
import { borrow_history} from './borrow/borrow_history';
import { employee } from './employee/employee';
import { building } from './location/building';
import { department } from './location/department';
import { room } from './location/room';
import { floor } from './location/floor';
import { role } from './role/role';
import { auth } from './auth/auth';
import { userApi } from './user/user';

export const api = {
    lot,
    equipment,
    add_equipment,
    borrow,
    borrow_history,
    employee,
    building,
    department,
    room,
    floor,
    role,
    auth,
    user: userApi,
    // สำหรับ backward compatibility
    login: auth.login,
    logout: auth.logout,
    getCurrentUser: auth.getCurrentUser,
};
