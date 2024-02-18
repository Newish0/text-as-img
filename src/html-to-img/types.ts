export type HTMLToImageOptions = {
    width?: string;
    margin?: string;
    pixelRatio?: number;
    doc?: Document;
    before?: Middleware;
    after?: Middleware;
};

export type Middleware = (
    /** Document of the current context */ doc: Document
) => void | Promise<void>;
