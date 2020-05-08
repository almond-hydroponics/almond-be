import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import { IRoleInputDTO } from '../../interfaces/IRole';
import { IScheduleInputDTO } from '../../interfaces/ISchedule';
import { AppLogger } from '../../loaders/logger';
import PermissionService from '../../services/permissions';
import ResourceService from '../../services/resource';
import RoleService from '../../services/role';
import ScheduleService from '../../services/schedule';
import middlewares from '../middlewares';

const logger = new AppLogger('Schedule');
const {
  isAuth,
  checkRole,
  attachCurrentUser,
  cacheSchedules,
} = middlewares;
const role = Router();

export default (app: Router) => {
  app.use('/', role);

  /**
   * @api {POST} api/role
   * @description Create a new role
   * @access Private
   */
  role.post('/roles', isAuth, attachCurrentUser, checkRole('User'),
    celebrate({
      body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        resourceAccessLevels: Joi.array(),
       }),
      }),
      async (req: Request, res: Response) => {
        logger.debug(`Calling Role endpoint with body: ${JSON.stringify(req.body)}`);
        try {
          const roleServiceInstance = Container.get(RoleService);
          const { role } = await roleServiceInstance.CreateRole(req.body as IRoleInputDTO);

          return res.status(201).send({
            success: true,
            message: 'Role added successfully',
            data: role,
          })
        } catch (e) {
          logger.error('🔥 error: %o', e.stack);
          const serverError = 'Server Error. Could not complete the request';
          return res.json({serverError}).status(500);
        }
      }
    );

  /**
   * @api {GET} api/role
   * @description Get all roles
   * @access Private
   */
  role.get('/roles', isAuth, attachCurrentUser, checkRole('User'),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling GetAllRoles endpoint');
      try {
        // let query_strings: Array<string> = [];
        // let additional_data = {};
        // let include = req.query.include;
        // query_strings.push(include);

        const roleServiceInstance = Container.get(RoleService);
        const resourceServiceInstance = Container.get(ResourceService);
        const permissionServiceInstance = Container.get(PermissionService);

        const roles = await roleServiceInstance.GetRoles();
        const resources = await resourceServiceInstance.GetResources();
        const permissions = await permissionServiceInstance.GetPermission();

        const additional_resources = {
          permission: permissions,
          resources: resources
        };

        // for (let i; i < query_strings.length; i ++) {
        //   if (query_strings[i] in additional_resources) {
        //     let pair = { query_strings[i]:  }
        //   }
        // }

        // for (let key in additional_resources) {
        //   logger.debug(`key: ${key}`);
        //   if (query_strings.includes(key)) {
        //     const pair = { key: additional_resources[key] };
        //     // let pair = `${key} : ${additional_resources[key]}`;
        //     // logger.debug(`${JSON.parse(pair)}`);
        //     // pair = JSON.parse(pair);
        //     // console.log(`{ ${key}: ${additional_resources[key]} }`);
        //     additional_data = { ...additional_data, ...pair};
        //     logger.debug(`${JSON.stringify(additional_data)}`);
        //   }
        // }

        // for (let query of query_strings) {
        //   logger.debug(`query: ${query}`);
        //   if (query_strings[i] in additional_resources) {
        //     return true
        //   }
          // for (let key in additional_resources) {
          //   if (key === query_strings[i]) {
          //     // return { ...additional_data, ...additional_resources[query] }
          //     return Object.assign(additional_data, { key: query_strings[i] })
          //   }
          // }
        // }

        if (roles.length !== null) {
          return res.status(200).send({
            permissions,
            resources,
            success: true,
            message: 'User roles fetched successfully',
            data: roles,
          });
        }
        return res.status(202).send({
          success: false,
          message: 'You have not created any roles.',
          data: [],
        });
      } catch (e) {
        logger.error('🔥 error: %o', e.stack);
        return next(e)
      }
   });

  /**
   * @api {PATCH} api/role/:id
   * @description Edit a role
   * @access Private
   */
  role.patch('/role/:id', isAuth, attachCurrentUser, checkRole('User'),
    celebrate({
      body: Joi.object({
        role: Joi.string(),
        roleId: Joi.string().required(),
      }),
    }),
     async (req: Request, res: Response) => {
       logger.debug(`Calling PatchRole endpoint with body: ${JSON.stringify(req.body)}`);
       try {
         const { params: { id } } = req;
         const roleServiceInstance = Container.get(RoleService);
         const { role } = await roleServiceInstance.EditRole(id, req.body as IRoleInputDTO);
         if (role) {
           return res.status(200).send({
             success: true,
             message: 'User role has been updated successfully',
             data: role,
           });
         }
         return res.status(404).send({
           success: false,
           message: 'User role does not exist',
         });
       } catch (e) {
         logger.error('🔥 error: %o', e.stack);
         return res.send({
           success: false,
           message: 'Server Error. Could not complete the request',
         }).status(500)
       }
     }
  );

  /**
   * @api {DELETE} api/role/:id
   * @description Delete a role by id
   * @access Private
   */
  role.delete('/roles/:id', isAuth, attachCurrentUser, checkRole('User'),
    async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling DeleteRoleById endpoint');
    try {
      const { params: { id } } = req;
      const roleServiceInstance = Container.get(RoleService);
      const role = await roleServiceInstance.DeleteRoleById(id);
      if (role.n > 0) {
        const message = 'User role has been deleted successfully';
        return res.status(200).json({ message });
      }
      const error = 'Role does not exist';
      return res.status(404).json({ error });
    } catch (e) {
      logger.error('🔥 error: %o', e.stack);
      const serverError = 'Server Error. Could not complete the request';
      return res.json({serverError}).status(500);
    }
  });
}
