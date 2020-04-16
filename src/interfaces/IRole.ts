export interface IRole {
  _id: string;
  title: string;
  description: string;
  userCount: number;
  resourceAccessLevels: [
    {
      resource: {
        type: string;
        _id: string;
      },
      permissions: {
        name: string;
        _id: string;
      }
    }
  ];
  deleted: boolean;
}

export interface IRoleInputDTO {
  title: string;
  description: string;
  resourceAccessLevels: [
    {
      resourceId: string;
      name: string;
      permissionIds: string[];
    }
  ];
}
