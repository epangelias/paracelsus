export class UnauthorizedError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class BadRequestError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "BadRequestError";
    }
}

export function setCatchHeader(res: Response) {
    res.headers.set("cache-control", "public, must-revalidate, max-age=" + 60 * 60);
    return res;
}

export function isStaticAsset(req: Request) {
    const base = req.url.split("/")[3];
    if (req.method == "POST" || base === "") return false;
    const isStatic = "src|_fresh|img|favicon.ico|manifest.json|css.css".includes(base);
    return isStatic;
}