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

    // Set the source to 'about:blank' initially so we can use page load evt later. 
    iframe.src = "about:blank";

    // Set the dimensions of the iframe
    iframe.width = "100%";

    root.appendChild(iframe);

    Object.assign(iframe.style, {
        position: "absolute",
        width: "100%",
        margin: 0,
        padding: 0,
        border: 0,
        fontSize: `100%`,
        font: `inherit`,
        verticalAlign: `baseline`,
        overflow: "hidden",
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

    Object.assign(iDoc.body.style, {
        padding: margin,
        backgroundColor: "#fff",
        width: "fit-content",
        overflow: "hidden",
    });

    // Ensure full height is visible
    iframe.height = `${iDoc.body.scrollHeight}px`;

    // Ensure full width is visible regardless of user specified width
    const { width: bWidth, x: bX } = iDoc.body.getBoundingClientRect();
    iframe.style.width = `max(${width}, ${bWidth + bX}px)`;
    iframe.width = `max(${width}, ${bWidth + bX}px)`;

    const dataUrl = await htmlToImage.toPng(iDoc.body, {
        pixelRatio,
        backgroundColor: "#fff",
    });

    // Cleanup
    root.removeChild(iframe);

    return dataUrl;
};
