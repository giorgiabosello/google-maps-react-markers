export function useScript(script?: {
    src: string;
    attributes?: any;
    callbacks?: {
        onLoadCallback?: Function;
        onErrorCallback?: Function;
    };
    elementIdToAppend?: string;
}, forcedStatus?: any): "idle" | "loading" | "ready" | "error";
//# sourceMappingURL=useScript.d.ts.map