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

import { ErrorEvent } from './error-event';
import { EventLevel } from './event-interfaces';

/**
 * Event for exceptions occurring while processing.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-notification-handler
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export class ExceptionEvent extends ErrorEvent {
    /**
     * Constructor (ExceptionEvent)
     *
     * @param data Error instance or string
     * @param id Event ID
     * @param level Event level
     *
     * @since v1.0.0
     */
    constructor(data?: Error | string, id?: string, level?: number) {
        if (typeof data == 'string' && (!id)) {
            id = 'djt.Exception';
        }

        if (!level) {
            level = EventLevel.EXCEPTION;
        }

        super(data, id, level);
    }
}
