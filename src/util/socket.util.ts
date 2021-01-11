import { socket } from '../server';;
import NotificationData from '../api/notification/notifiaction-data.interface';

export class SocketUtil {

    /**
     * Notify data through notification event represented by key
     * @param key event key 
     * @param data notification data object 
    */
    static notify(broadcastId: any, data: NotificationData) {
        socket.emit(broadcastId, data);
    }

}