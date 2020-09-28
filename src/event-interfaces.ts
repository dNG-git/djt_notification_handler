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

/**
 * Event levels
 *
 * @since v1.0.0
 */
export enum EventLevel {
    DEBUG = 1,
    INFO = 2,
    WARNING = 3,
    ERROR = 4,
    EXCEPTION = 5
}

/**
 * Notification event interface.
 *
 * @since v1.0.0
 */
export interface EventInterface {
    /**
     * Event data
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventData: any;
    /**
     * Event ID
     */
    eventId: string;
    /**
     * Event level
     */
    eventLevel: EventLevel;
}
