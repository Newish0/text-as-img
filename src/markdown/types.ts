export enum StyleType {
    Inline,
    Href,
}

export interface Style {
    type: StyleType;
    content: string;
}

