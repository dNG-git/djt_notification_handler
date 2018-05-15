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
import { Handler } from './handler';

/**
 * Event for errors and exceptions occurring while processing.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-notification-handler
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export class ErrorEvent implements EventInterface {
    /**
     * Cause stored for the error event instance.
     */
    protected cause?: Error;
    /**
     * Error event message
     */
    protected message: string;
    /**
     * Event ID
     */
    protected _id: string;
    /**
     * Event level
     */
    protected _level: EventLevel;

    /**
     * Constructor (ErrorEvent)
     *
     * @param data Error instance or string
     * @param id Event ID
     * @param level Event level
     * @param autoFire True to fire event at the end of the instance construction.
     *
     * @since v1.0.0
     */
    constructor(data?: Error | string, id?: string, level?: number, autoFire = true) {
        if (Error.isPrototypeOf(data)) {
            this.cause = data as Error;
            this.message = (data as Error).message;
        } else {
            this.message = data as string;
        }

        this._level = (level ? level : EventLevel.ERROR);

        if (id) {
            this._id = id;
        } else if (this.cause) {
            this._id = this.cause.name;
        } else {
            this._id = 'djt.Error';
        }

        if (autoFire) {
            this.fireEvent();
        }
    }

    /**
     * Event data
     *
     * @return Event data
     * @since  v1.0.0
     */
    public get eventData() {
        return (this.cause ? this.cause : { });
    }

    /**
     * Event ID
     *
     * @return Event ID
     * @since  v1.0.0
     */
    public get eventId() {
        return this._id;
    }

    /**
     * Event level
     *
     * @return Event level
     * @since  v1.0.0
     */
    public get eventLevel() {
        return this._level;
    }

    /**
     * Fires the event instance.
     *
     * @since v1.0.0
     */
    public fireEvent() {
        Handler.fireEvent(this);
    }
}
