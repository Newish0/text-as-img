export enum StyleType {
    Inline,
    Href,
}

export interface Style {
    type: StyleType;
    content: string;
}

export type Result = {
    html: string;
    postProcess: () => void | Promise<void>;
};
