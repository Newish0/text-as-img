import markdownit from "markdown-it";
import hljs from "highlight.js";

import mk from "@vscode/markdown-it-katex";
import mt from "markdown-it-textual-uml";

import { Result, Style, StyleType } from "@/markdown/types";

import oneDarkLightCSS from "highlight.js/styles/atom-one-light.min.css?raw";

const md = markdownit({
    html: true,
    linkify: true,
    typographer: false,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) {
                /** empty */
            }
        }

        return ""; // use external default escaping
    },
});

md.use(mk);
md.use(mt);

export function parse(mdStr: string): string {
    return `<div class="markdown-body">${md.render(mdStr)}</div>`;
}

export function getStyles(): Style[] {
    const styles: Style[] = [
        {
            type: StyleType.Inline,
            content: oneDarkLightCSS,
        },
        {
            type: StyleType.Href,
            content:
                "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css",
        },
        {
            type: StyleType.Href,
            content: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
        },
    ];

    return styles;
}
