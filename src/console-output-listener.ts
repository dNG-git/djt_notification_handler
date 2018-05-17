/**
 * direct JavaScript Toolbox
 * All-in-one toolbox to provide more reusable JavaScript features
 *
 * (C) direct Netware Group - All rights reserved
 * https://www.direct-netware.de/redirect?djt;notification_handler
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/.
 *
 * https://www.direct-netware.de/redirect?licenses;mpl2
 *
 * @license Mozilla Public License, v. 2.0
 */

import { EventInterface, EventLevel } from './event-interface';
import { ListenerInterface } from './listener-interface';

/**
 * Notification listener interface.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-notification-handler
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export class ConsoleOutputListener implements ListenerInterface {
    public async onDjtNotificationEvent(event: EventInterface) {
        if (console) {
            let consoleMethodName = 'log';

            switch (event.eventLevel) {
                case EventLevel.DEBUG:
                    consoleMethodName = 'debug';
                    break;
                case EventLevel.INFO:
                    consoleMethodName = 'info';
                    break;
                case EventLevel.WARNING:
                    consoleMethodName = 'warn';
                    break;
                case EventLevel.ERROR:
                    consoleMethodName = 'error';
                    break;
                case EventLevel.EXCEPTION:
                    consoleMethodName = 'error';
                    break;
            }

            if (!(consoleMethodName in console)) {
                consoleMethodName = 'log';
            }

            if (consoleMethodName in console) {
                (console as any)[consoleMethodName](event.toString());
            }
        }
    }
}
