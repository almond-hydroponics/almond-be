import attachCurrentUser from './attachCurrentUser';
import isAuth from './isAuth';
import checkRole from './checkRole';
import {clearAllCache, clearCache, getCache, setCache} from "./cache";

export default {
  attachCurrentUser,
  isAuth,
  checkRole,
  getCache,
  setCache,
  clearCache,
  clearAllCache
};
