enum requestMethodEnum {
    post = "POST",
    get = "GET ",
    put = "PUT",
    delete = "DELETE ",
}

export interface RequestConfigType {
    method?: requestMethodEnum
    domain: string;
    url: string;
    lng?: string;
    headers: Record<string, string>;
    signal?: AbortSignal | null | undefined
}

export type ResponseHandlerType = {
    onError?: (data?: any) => any;
    onFinally?: (data?: any) => any;
    messageApi?: any;
    content?: string;
};

export const paramsSting = (params: any) => {
    const sortedParams = Object.keys(params)
        .sort()
        .reduce((result: any, key) => {
            result[key] = params[key];
            return result;
        }, {});

    const paramString = Object.keys(sortedParams)
        .map((key) => `${key}=${sortedParams[key]}`)
        .join("&");
    return paramString;
};



export function getTimestampManager() {
    let firstTimestamp: number | null = null;

    function getFirstTimestamp() {
        if (firstTimestamp === null) {
            firstTimestamp = Date.now();
        }
        return firstTimestamp;
    }

    function getNewTimestamp() {
        return Date.now();
    }

    return {
        getFirstTimestamp,
        getNewTimestamp,
    };
}

export const confDomain = ""
// export const confDomain = "http://timish.woa.com"
// domain: "http://annualparty-server.annualpart-server.odprrp.woa.com",
export const jsonFetch = async (
    _config: Partial<RequestConfigType>,
    query: any,
    resHandler?: ResponseHandlerType
) => {
    const config = {
        domain: confDomain,
        url: "",
        ..._config,
    };
    let endHeaders = {
        "Content-Type": "application/json",
        ..._config.headers,
    };
    try {
        const response = await fetch(config.domain + config.url, {
            method: "POST",
            headers: endHeaders,
            cache: "no-store",
            signal: config.signal,
            body: JSON.stringify(query),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const text = await response.text();

        try {
            const result = JSON.parse(text); // 使用JSON.parse来尝试解析文本
            return result;
        } catch (jsonError) {
            // 如果解析失败，返回原始文本
            return text;
        }
    } catch (error: any) {
        // throw error;

    } finally {
        if (resHandler?.onFinally) resHandler.onFinally();
    }
};

export const getFetch = async (
    _config: Partial<RequestConfigType>,
    query: any,
    resHandler?: ResponseHandlerType
) => {
    const config = {

        domain: confDomain,
        url: "",
        ..._config,
    };
    let endHeaders = {
        ..._config.headers,
    };
    try {
        const response = await fetch(config.domain + config.url + "?" + paramsSting(query), {
            method: "GET",
            headers: endHeaders,
            cache: "no-store",
            signal: config.signal,
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const text = await response.text();

        try {
            const result = JSON.parse(text); // 使用JSON.parse来尝试解析文本
            return result;
        } catch (jsonError) {
            return text;
        }
    } catch (error: any) {
        if (resHandler?.onError) resHandler.onError();
        // throw error;
    } finally {
        if (resHandler?.onFinally) resHandler.onFinally();
    }
};
