import { Style, StyleType } from "@/markdown/types";

export function tagFromStyle(style: Style): string {
    if (style.type === StyleType.Inline) {
        return `<style>${style.content}</style>`;
    } else if (style.type === StyleType.Href) {
        return `<link rel="stylesheet" href="${style.content}" crossorigin="anonymous">`;
    } else {
        throw new TypeError("Provided parameter is not of type `Style`");
    }
}
