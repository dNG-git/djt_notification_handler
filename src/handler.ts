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
import { ListenerInterface, ListenerOptions } from './listener-interface';

/**
 * Interface for registered listeners
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-notification-handler
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export interface RegisteredListenerType {
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

/**
 * The notification handler singleton can be used to register for and trigger
 * events.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-notification-handler
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export class Handler {
    /**
     * Handler singleton
     */
    protected static handlerInstance: Handler;
    /**
     * List of registered callback handlers
     */
    protected registeredListeners: RegisteredListenerType[] = [ ];

    /**
     * Fires all registered listeners for the event given.
     *
     * @param event Triggering event
     *
     * @return Executing listeners promise
     * @since  v1.0.0
     */
    protected async fireRegisteredListenersForEvent(event: EventInterface) {
        return Promise.all(this.getRegisteredPromisesForEvent(event));
    }

    /**
     * Returns all registered listeners matching the event given.
     *
     * @param event Event to look up listeners for
     *
     * @return List of matching listeners
     * @since  v1.0.0
     */
    protected getRegisteredPromisesForEvent(event: EventInterface) {
        const _return = [ ];

        for (const registeredListener of this.registeredListeners) {
            if (
                (
                    event.eventId === registeredListener.eventId
                    || registeredListener.eventId === undefined
                ) && (
                    event.eventLevel === registeredListener.eventLevel
                    || registeredListener.eventLevel === undefined
                )
            ) {
                _return.push(registeredListener.instance.onDjtNotificationEvent(event));
            }
        }

        return _return;
    }

    /**
     * Registers the given event listener to be triggered for matching events.
     *
     * @param listener Notification listener
     * @param target Options to match to be triggered
     *
     * @since v1.0.0
     */
    protected registerListener(listener: ListenerInterface, target?: ListenerOptions) {
        if (!target) {
            target = { };
        }

        for (const registeredListener of this.registeredListeners) {
            if (
                registeredListener.instance === listener
                && registeredListener.eventId === target.eventId
                && registeredListener.eventLevel === target.eventLevel
            ) {
                listener = null;
                break;
            }
        }

        if (listener) {
            this.registeredListeners.push(Object.assign({ instance: listener }, target));
        }
    }

    /**
     * Fires the event given.
     *
     * @param event Triggering event
     *
     * @return Executing listeners promise
     * @since  v1.0.0
     */
    public static async fireEvent(event: EventInterface) {
        return this.getInstance().fireRegisteredListenersForEvent(event);
    }

    /**
     * Returns the handler singleton.
     *
     * @return Handler singleton
     * @since  v1.0.0
     */
    public static getInstance(): Handler {
        if (!this.handlerInstance) {
            this.handlerInstance = new Handler();
        }

        return this.handlerInstance;
    }

    /**
     * Registers the given event listener to be triggered for matching events.
     *
     * @param listener Notification listener
     * @param target Options to match to be triggered
     *
     * @since v1.0.0
     */
    public static register(listener: ListenerInterface, target?: ListenerOptions) {
        this.getInstance().registerListener(listener, target);
    }
}
