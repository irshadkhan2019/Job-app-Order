import { getNotificationsById } from '@order/services/notification.service';
import { IOrderNotifcation } from '@irshadkhan2019/job-app-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const notifications = async (req: Request, res: Response): Promise<void> => {
  const notifications: IOrderNotifcation[] = await getNotificationsById(req.params.userTo);
  res.status(StatusCodes.OK).json({ message: 'Notifications', notifications });
};

export { notifications };