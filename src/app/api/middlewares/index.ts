import attachCurrentUser from './attachCurrentUser';
import isAuth from './isAuth';
import checkRole from './checkRole';
import { clearAllCache, clearCache, getCache, setCache } from './cache';
import { rateLimiterUsingThirdParty } from './rateLimit';
import profilePhotoUploadLimiter from './profilePhotoUploadLimiter';

export default {
	attachCurrentUser,
	isAuth,
	checkRole,
	getCache,
	setCache,
	clearCache,
	clearAllCache,
	rateLimiterUsingThirdParty,
	profilePhotoUploadLimiter,
};

// const middlewares = {
//   attachCurrentUser,
//   isAuth,
//   checkRole,
//   getCache,
//   setCache,
//   clearCache,
//   clearAllCache,
//   rateLimiterUsingThirdParty,
// }
//
// export default middlewares;

// should be defined this way to enable testing of the middlewares
