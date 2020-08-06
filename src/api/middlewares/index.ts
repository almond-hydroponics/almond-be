import attachCurrentUser from './attachCurrentUser';
import isAuth from './isAuth';
import checkRole from './checkRole';
import {clearAllCache, clearCache, getCache, setCache} from './cache';
import { rateLimiterUsingThirdParty } from './rateLimit';

export default {
  attachCurrentUser,
  isAuth,
  checkRole,
  getCache,
  setCache,
  clearCache,
  clearAllCache,
  rateLimiterUsingThirdParty
};
