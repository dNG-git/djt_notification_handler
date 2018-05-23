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
     *
     * @since v1.0.0
     */
    constructor(data?: Error | string, id?: string, level?: number) {
        if (Error.prototype.isPrototypeOf(data)) {
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
    }

    /**
     * Event data
     *
     * @return Event data
     * @since  v1.0.0
     */
    public get eventData() {
        // tslint:disable-next-line:no-any
        const _return: any = { message: this.message };

        if (this.cause) {
            _return['stack'] = this.cause.stack;
        }

        return _return;
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
     * String representation of the object.
     *
     * @return String representation
     * @since  v1.0.1
     */
    public toString() {
        let _return = `djt-notification-handler.ErrorEvent: ${this.eventId} (Level ${this.eventLevel})`;
        _return += ' with data ' + JSON.stringify(this.eventData);

        return _return;
    }
}
