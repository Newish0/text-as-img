import * as htmlToImage from "html-to-image";
import { HTMLToImageOptions } from "./types";

/**
 *
 * @param html
 * @param cssStyles
 * @returns PNG data URL
 */
export const convert = async (
    html: string,
    {
        width = "8.5in",
        margin = "0.5in",
        pixelRatio = 2,
        doc = document,
        before,
        after,
    }: HTMLToImageOptions = {}
) => {
    const root = doc.querySelector("body")!;

    const iframe = doc.createElement("iframe");

    // Set the source to 'about:blank' initially
    iframe.src = "about:blank";

    // Set the dimensions of the iframe
    iframe.width = width;

    root.appendChild(iframe);

    Object.assign(iframe.style, {
        position: "absolute",
        width,
        margin: 0,
        padding: 0,
        border: 0,
        fontSize: `100%`,
        font: `inherit`,
        verticalAlign: `baseline`,
    });

    const iDoc = iframe.contentDocument;
    const iWin = iframe.contentWindow;

    if (!iDoc || !iWin) throw new Error("iframe document/window are undefined");

    const loadPromise = new Promise<unknown>((r) => {
        // for waiting iframe content to load
        iframe.addEventListener("load", r);
    });

    // Triggers before MW before rendering contents
    if (before) await before(iDoc);

    iDoc.open();
    iDoc.write(html);
    iDoc.close();

    await loadPromise;

    // Triggers after MW when finish rendering contents
    if (after) await after(iDoc);

    iDoc.body.style.padding = margin;
    iDoc.body.style.backgroundColor = "#fff";

    // Ensure full height is visible
    iframe.height = `${iDoc.body.scrollHeight}px`;

    const dataUrl = await htmlToImage.toPng(iDoc.body, {
        pixelRatio,
        backgroundColor: "#fff",
    });

    // Cleanup
    root.removeChild(iframe);

    return dataUrl;
};
