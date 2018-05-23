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
import { EventInterface, EventLevel } from './event-interface';
import { ExceptionEvent } from './exception-event';
import { Handler } from './handler';

/**
 * Generic notification event.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-notification-handler
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export class Event implements EventInterface {
    /**
     * Event data
     */
    // tslint:disable-next-line:no-any
    protected _data: any = { };
    /**
     * Event ID
     */
    protected _id: string;
    /**
     * Event level
     */
    protected _level?: EventLevel;

    /**
     * Constructor (Event)
     *
     * @param id Event ID
     * @param data Event data
     * @param level Event level
     * @param autoFire True to fire event at the end of the instance construction.
     *
     * @since v1.0.0
     */
    // tslint:disable-next-line:no-any
    constructor(id?: string, data?: any, level?: number, autoFire = true) {
        this._data = data;
        this._id = (id ? id : 'djt.Event');
        this._level = level;

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
        return this._data;
    }

    /**
     * Sets event data
     *
     * @param data Event data
     *
     * @since v1.0.0
     */
    // tslint:disable-next-line:no-any
    public set eventData(data: any) {
        this._data = data;
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
        return (this._level ? this._level : EventLevel.INFO);
    }

    /**
     * Fires the event instance.
     *
     * @since v1.0.0
     */
    protected fireEvent() {
        Handler.fireEvent(this);
    }

    /**
     * String representation of the object.
     *
     * @return String representation
     * @since  v1.0.1
     */
    public toString() {
        let _return = `djt-notification-handler.Event: ${this.eventId} (Level ${this.eventLevel})`;

        if (this.eventData) {
            _return += ' with data ' + JSON.stringify(this.eventData);
        }

        return _return;
    }
}
