export interface PrintWindowOptions {
    width?: number;
    height?: number;
    menubar?: string;
    toolbar?: string;
    location?: string;
    status?: string;
    resizable?: string;
    scrollbars?: string;
}

export class NgxPrintifyUtil {
    // Formats the print window options into a string
    static formatPrintWindowOptions(options: PrintWindowOptions): string {
        const entries = Object.entries(options);
        let result = '';

        for (let i = 0; i < entries.length; i++) {
            const key = entries[i][0];
            const value = entries[i][1];
            result += `${key}=${value}`;
            if (i < entries.length - 1) {
                result += ','; // Add comma between entries
            }
        }

        return result;
    }


    // Common printing logic
    // Common printing logic
    static async preparePrintWindow({
        printItemsId,
        printTitle,
        printTemplate,
        useExistingCss = false,
        printStyle = {},
        styleSheetFile,
        printWindowOptions = { width: 800, height: 600, menubar: 'no', toolbar: 'no', location: 'no', status: 'no', resizable: 'yes', scrollbars: 'yes' },
        closeWindow = true,
        previewOnly = false
    }: {
        printItemsId?: string;
        printTitle?: string;
        printTemplate?: any;
        useExistingCss?: boolean;
        printStyle?: { [key: string]: { [property: string]: string } };
        styleSheetFile?: string;
        printWindowOptions?: PrintWindowOptions;
        closeWindow?: boolean;
        previewOnly?: boolean;
    }): Promise<void> {
        if (printItemsId || printTemplate) {
            const printWindow = window.open('', '_blank', this.formatPrintWindowOptions(printWindowOptions));

            if (!printWindow || !printWindow.document) {
                console.error('Failed to open print window. Please check your popup settings.');
                return;
            }

            const headContent: string[] = [];
            const bodyContent: string[] = [];

            const loadStylesheet = (href: string): Promise<void> => {
                return new Promise((resolve, reject) => {
                    const link = printWindow.document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = href;
                    link.media = 'all';

                    link.onload = () => {
                        resolve();
                    };
                    link.onerror = () => {
                        console.error(`Failed to load stylesheet: ${href}`);
                        reject(`Failed to load stylesheet: ${href}`);
                    };

                    printWindow.document.head.appendChild(link);
                });
            };

            if (useExistingCss) {
                const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
                const loadPromises = Array.from(stylesheets).map(sheet => {
                    const linkElement = sheet as HTMLLinkElement;
                    headContent.push(`<link rel="stylesheet" href="${linkElement.href}" media="all">`);
                    return loadStylesheet(linkElement.href);
                });
                await Promise.all(loadPromises);

                // Clone existing style tags
                const styleTags = document.querySelectorAll('style');
                styleTags.forEach(style => {
                    const clonedStyle = style.cloneNode(true) as HTMLStyleElement;
                    headContent.push(clonedStyle.outerHTML);
                });
            }

            if (styleSheetFile) {
                const customStylesheets = styleSheetFile.split(',');
                const loadPromises = customStylesheets.map(sheetUrl => {
                    headContent.push(`<link rel="stylesheet" href="${sheetUrl.trim()}" media="all">`);
                    return loadStylesheet(sheetUrl.trim());
                });
                await Promise.all(loadPromises);
            }

            if (printTitle) {
                headContent.push(`<title>${printTitle}</title>`);
            }

            if (printTemplate) {
                const tempDiv = document.createElement('div');
                const embeddedView = printTemplate.createEmbeddedView({});
                embeddedView.rootNodes.forEach(node => {
                    const printTemplateNode = node.cloneNode(true) as HTMLElement;
                    this.applyStyles(printTemplateNode, printStyle); // Apply styles here
                    tempDiv.appendChild(printTemplateNode);
                });

                const templateContent = tempDiv.innerHTML;
                bodyContent.push(`<div>${templateContent}</div>`);
                embeddedView.destroy(); // Clean up
            }

            if (printItemsId) {
                for (const printItemId of printItemsId.split(',')) {
                    const printContent = document.getElementById(printItemId);
                    if (printContent) {
                        const printContentNode = printContent.cloneNode(true) as HTMLElement;
                        this.applyStyles(printContentNode, printStyle); // Apply styles here
                        bodyContent.push(printContentNode.outerHTML);
                    }
                }
            }

            const body = document.body;
            const bodyClass = body.className;
            const bodyStyles = body.getAttribute('style') || '';

            const fullHtml = `
                <html>
                    <head>${headContent.join('')}</head>
                    <body class="${bodyClass}" style="${bodyStyles}">${bodyContent.join('')}</body>
                </html>
            `;

            printWindow.document.write(fullHtml);
            printWindow.document.close();

            printWindow.onload = () => {
                if (closeWindow) {
                    printWindow.onafterprint = () => {
                        printWindow.close();
                    };
                }

                if (!previewOnly) {
                    printWindow.print();
                }
            };
        }
    }

    // Apply styles based on the provided printStyle object
    private static applyStyles(element: HTMLElement, styles: { [key: string]: { [property: string]: string } }) {
        const tagName = element.tagName.toLowerCase();

        // Apply styles for tag names
        if (styles[tagName]) {
            const styleProperties = styles[tagName];
            Object.keys(styleProperties).forEach(property => {
                element.style[property as any] = styleProperties[property];
            });
        }

        // Apply styles for class selectors
        const classList = Array.from(element.classList);
        classList.forEach(className => {
            const classKey = `.${className}`;
            if (styles[classKey]) {
                const styleProperties = styles[classKey];
                Object.keys(styleProperties).forEach(property => {
                    element.style[property as any] = styleProperties[property];
                });
            }
        });
    }
}