export declare class UserSyncFix {
    private minSyncIntervalms;
    private syncFuncs;
    private syncTimer;
    private nextId;
    constructor(minSyncIntervalms: number);
    userJoined(): void;
    private runSyncFuncs;
    addSyncFunc(f: {
        (): void;
    }): number;
    removeSyncFunc(id: number): void;
}
//# sourceMappingURL=sync-fix.d.ts.map