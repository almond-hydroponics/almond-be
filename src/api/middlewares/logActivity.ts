import {any} from "joi";
import {IActivityLogDto} from "../../interfaces/IActivityLog";

const logActivity = () =>{
  const items = <IActivityLogDto>{
    action: 'Creating Schedule',
    actionDesc: 'Time schedule added successfully',
    actionType: 'SCHEDULER',
    stationIp: ip,
    stationOs: JSON.stringify('')//{ip,os,browser,location})
  };
  return items
}
export default logActivity();
