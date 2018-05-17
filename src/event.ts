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
        return `djt-notification-handler.Event: ${this.eventId} (Level ${this.eventLevel})`;
    }

    /**
     * Generates an exception event for the given instance.
     *
     * @param exception Native error instance or initialized error event
     *
     * @since v1.0.0
     */
    protected static handleException(exception: Error | ErrorEvent) {
        if (Error.prototype.isPrototypeOf(exception)) {
            exception = new ExceptionEvent(exception as Error);
        }

        Handler.fireEvent(exception as ErrorEvent);
    }

    /**
     * Adds a Promise rejection case to trigger an error event.
     *
     * @param promise Promise to be extended
     *
     * @return Extended promise instance
     * @since  v1.0.0
     */
    // tslint:disable-next-line:no-any
    public static async addEventGeneratorToPromise(promise: Promise<any>) {
        // tslint:disable-next-line:no-any
        promise.catch((reason: any) => {
            if (!Error.prototype.isPrototypeOf(reason)) {
                reason = new ExceptionEvent(reason);
            }

            Event.handleException(reason);
        });

        return promise;
    }

    /**
     * Adds a Promise rejection case and executes the promise with the remaining
     * parameters given.
     *
     * @return Extended promise instance
     * @since  v1.0.0
     */
    // tslint:disable-next-line:no-any
    public static async addEventGeneratorAndExecutePromise(...args: any[]) {
        if (args.length < 1) {
            throw new Error('No callback given to wrap');
        }

        // tslint:disable-next-line:no-any
        const callback: (...args: any[]) => Promise<any> = args.pop();
        return this.addEventGeneratorToPromise(callback(...args));
    }

    /**
     * Adds an exception catch block and executes the callback with the remaining
     * parameters given.
     *
     * @return Result
     * @since  v1.0.0
     */
    // tslint:disable-next-line:no-any
    public static wrapEventGeneratorAndExecuteCallback(...args: any[]) {
        try {
            if (args.length < 1) {
                throw new Error('No callback given to wrap');
            }

            // tslint:disable-next-line:ban-types
            const callback: Function = args.pop();

            return callback(...args);
        } catch (handledException) {
            Event.handleException(handledException);

            throw handledException;
        }
    }

    /**
     * Wraps a Promise rejection catch block and executes the promise with the
     * remaining parameters given.
     *
     * @return Extended promise instance
     * @since  v1.0.0
     */
    // tslint:disable-next-line:no-any
    public static async wrapExceptionTrapAndExecutePromise(...args: any[]) {
        if (args.length < 1) {
            throw new Error('No callback given to wrap');
        }

        // tslint:disable-next-line:no-any
        const callback: (...args: any[]) => Promise<any> = args.pop();
        return this.wrapExceptionTrapAndWaitForPromise(callback(...args));
    }

    /**
     * Wraps a Promise rejection catch block and returns the promise result or the
     * exception thrown.
     *
     * @param promise Promise to wait for
     *
     * @return Result or exception thrown
     * @since  v1.0.0
     */
    // tslint:disable-next-line:no-any
    public static async wrapExceptionTrapAndWaitForPromise(promise: Promise<any>) {
        try {
            return await promise;
        } catch (handledException) {
            Event.handleException(handledException);

            return handledException;
        }
    }

    /**
     * Wraps an exception catch block and executes the callback with the remaining
     * parameters given.
     *
     * @return Result or exception thrown
     * @since  v1.0.0
     */
    // tslint:disable-next-line:no-any
    public static wrapExceptionTrapAndExecuteCallback(...args: any[]) {
        try {
            return this.wrapEventGeneratorAndExecuteCallback(...args);
        } catch (handledException) {
            return handledException;
        }
    }
}
