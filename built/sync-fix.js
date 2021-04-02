"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Automate fixing late user sync issues with Altspace.
 *
 * Usage:
 *		1. Create an instance of UserSyncFix with the constructor.  Pass it the minimum number of milliseconds
 *			between synchronizations.
 *			e.g.: syncfix = new UserSyncFix(5000);
 *		2. As you create items that need the synchronization fix (such as buttons/button behavior and attached objects),
 *			call addSyncFunc( <sync func> ).
 *			e.g. syncId = syncfix.addSyncFunc(reattachItem);
 *			For attached objects, the function should detach and reattach them.
 *			For a button, the function should set the ButtonBehaviors that were already set.
 *		3. In the App's userJoined() callback, call UserSyncFix's userJoined() function.
 *			e.g. syncfix.userJoined()
 *		4. As you delete an object (or want to stop synchronizing for some reason), call removeSyncFunc().
 *			e.g. syncfix.removeSyncFunc(syncId)
 *			'syncId' is the return value from a previous call to addSyncFunc().
 *
 */
class UserSyncFix {
    // Constructor.
    constructor(minSyncIntervalms) {
        this.minSyncIntervalms = minSyncIntervalms;
        // Map of syncId's to functions to call at each sync time.
        this.syncFuncs = new Map();
        // The next ID to be used when a function is added.
        this.nextId = 0;
    }
    // Call when a user has joined.
    userJoined() {
        // If a timer hasn't already been created, add it.
        if (!this.syncTimer) {
            this.syncTimer = new Promise(resolve => setTimeout(resolve, this.minSyncIntervalms))
                .then(() => this.runSyncFuncs());
        }
    }
    // Run all the sync funcs.
    runSyncFuncs() {
        // Set the syncTimer to null to prepare for the next user.
        this.syncTimer = null;
        // Loop through and execute all the sync functions.
        this.syncFuncs.forEach((f, id) => {
            f();
        });
    }
    // Add a sync function.
    addSyncFunc(f) {
        this.syncFuncs.set(this.nextId, f);
        return this.nextId++;
    }
    // Remove a sync function.
    removeSyncFunc(id) {
        if (this.syncFuncs.has(id)) {
            this.syncFuncs.delete(id);
        }
    }
}
exports.UserSyncFix = UserSyncFix;
//# sourceMappingURL=sync-fix.js.map