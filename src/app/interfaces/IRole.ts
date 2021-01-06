import { IResource } from './IResource';
import { IPermissions } from './IPermissions';

export interface IRole {
	_id?: string;
	title: string;
	description: string;
	userCount: number;
	resourceAccessLevels: ResourceAccessLevels[] | IResourceAccessLevels[];
	deleted: boolean;
}

interface ResourceAccessLevels {
	_id: string;
	permissions: string[];
	resource: string;
}

interface IResourceAccessLevels {
	resource: IResource;
	permissions: IPermissions;
}

interface IResourceAccessLevelsDTO {
	resourceId: string;
	name: string;
	permissionIds: string[];
}

export interface IRoleInputDTO {
	title: string;
	description: string;
	resourceAccessLevels: IResourceAccessLevelsDTO[];
}
