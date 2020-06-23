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

import { ErrorEvent } from './error-event';
import { ExceptionEvent } from './exception-event';

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
     * Adds a Promise rejection case to trigger an error event.
     *
     * @param promise Promise to be extended
     *
     * @return Extended promise instance
     * @since  v2.0.0
     */
    public static async addEventGeneratorToPromise(promise: Promise<unknown>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        promise.catch((reason: any) => {
            if (!(reason instanceof Error)) {
                reason = new ExceptionEvent(reason);
            }

            this.handleException(reason);
        });

        return promise;
    }

    /**
     * Adds a Promise rejection case and executes the promise with the remaining
     * parameters given.
     *
     * @return Extended promise instance
     * @since  v2.0.0
     */
    public static async addEventGeneratorAndExecutePromise(...args: unknown[]) {
        if (args.length < 1) {
            throw new Error('No callback given to wrap');
        }

        const callback = args.pop() as (...args: unknown[]) => Promise<unknown>;
        return this.addEventGeneratorToPromise(callback(...args));
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
     * Generates an exception event for the given instance.
     *
     * @param exception Native error instance or initialized error event
     *
     * @since v2.0.0
     */
    protected static handleException(exception: Error | ErrorEvent) {
        if (exception instanceof Error) {
            exception = new ExceptionEvent(exception);
        }

        void Handler.fireEvent(exception);
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

    /**
     * Registers the 'djt-notification-handler' for global error events as well.
     *
     * @since v2.0.0
     */
    public static registerAsGlobalErrorHandler() {
        self.onerror = (
            (error) => {
                let errorInstance;

                if (typeof error == 'string') {
                    errorInstance = new Error(error);
                } else {
                    errorInstance = new Error(error.toString());
                }

                this.handleException(errorInstance);
            }
        );
    }

    /**
     * Adds an exception catch block and executes the callback with the remaining
     * parameters given.
     *
     * @return Result
     * @since  v2.0.0
     */
    public static wrapEventGeneratorAndExecuteCallback(...args: unknown[]) {
        try {
            if (args.length < 1) {
                throw new Error('No callback given to wrap');
            }

            const callback = args.pop() as (...args: unknown[]) => unknown;
            return callback(...args);
        } catch (handledException) {
            this.handleException(handledException);

            throw handledException;
        }
    }

    /**
     * Wraps a Promise rejection catch block and executes the promise with the
     * remaining parameters given.
     *
     * @return Extended promise instance
     * @since  v2.0.0
     */
    public static async wrapExceptionTrapAndExecutePromise(...args: unknown[]) {
        if (args.length < 1) {
            throw new Error('No callback given to wrap');
        }

        const callback = args.pop() as (...args: unknown[]) => Promise<unknown>;
        return this.wrapExceptionTrapAndWaitForPromise(callback(...args));
    }

    /**
     * Wraps a Promise rejection catch block and returns the promise result or the
     * exception thrown.
     *
     * @param promise Promise to wait for
     *
     * @return Result or exception thrown
     * @since  v2.0.0
     */
    public static async wrapExceptionTrapAndWaitForPromise(promise: Promise<unknown>) {
        try {
            return await promise;
        } catch (handledException) {
            this.handleException(handledException);

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return handledException;
        }
    }

    /**
     * Wraps an exception catch block and executes the callback with the remaining
     * parameters given.
     *
     * @return Result or exception thrown
     * @since  v2.0.0
     */
    public static wrapExceptionTrapAndExecuteCallback(...args: unknown[]) {
        try {
            return this.wrapEventGeneratorAndExecuteCallback(...args);
        } catch (handledException) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return handledException;
        }
    }
}
