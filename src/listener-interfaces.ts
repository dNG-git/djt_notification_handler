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

import { EventInterface, EventLevel } from './event-interfaces';

/**
 * Notification listener interface.
 *
 * @since v1.0.0
 */
export interface ListenerInterface {
    onDjtNotificationEvent: (event: EventInterface) => Promise<void>;
}

/**
 * Listener options.
 *
 * @since v1.0.0
 */
export interface ListenerOptions {
    /**
     * Event ID
     */
    eventId?: string;
    /**
     * Event level
     */
    eventLevel?: EventLevel;
}

/**
 * Interface for registered listeners
 *
 * @since v1.0.0
 */
export interface RegisteredListenerInterface {
    /**
     * Listener instance
     */
    instance: ListenerInterface;
    /**
     * Event ID
     */
    eventId?: string;
    /**
     * Event level
     */
    eventLevel?: EventLevel;
}
