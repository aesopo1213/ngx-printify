import { TemplateRef } from '@angular/core';

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
        return Object.entries(options)
            .map(([key, value]) => `${key}=${value}`)
            .join(',');
    }

    // Common printing logic
    static preparePrintWindow({
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
        printTemplate?: TemplateRef<any>;
        useExistingCss?: boolean;
        printStyle?: { [key: string]: { [property: string]: string } };
        styleSheetFile?: string;
        printWindowOptions?: PrintWindowOptions;
        closeWindow?: boolean;
        previewOnly?: boolean;
    }): void {
        if (printItemsId || printTemplate) {
            const printWindow = window.open('', '_blank', this.formatPrintWindowOptions(printWindowOptions));

            if (!printWindow || !printWindow.document) {
                console.error('Failed to open print window. Please check your popup settings.');
                return;
            }

            const headContent: string[] = [];
            const bodyContent: string[] = [];

            if (useExistingCss) {
                const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
                stylesheets.forEach(sheet => {
                    const clonedSheet = sheet.cloneNode(true) as HTMLLinkElement;
                    headContent.push(clonedSheet.outerHTML);
                });
            }

            if (printTitle) {
                headContent.push(`<title>${printTitle}</title>`);
            }

            if (styleSheetFile) {
                const customStylesheets = styleSheetFile.split(',');
                customStylesheets.forEach(sheetUrl => {
                    const link = `<link rel="stylesheet" href="${sheetUrl.trim()}">`;
                    headContent.push(link);
                });
            }

            if (printTemplate) {
                const tempDiv = document.createElement('div');
                const embeddedView = printTemplate.createEmbeddedView({});
                embeddedView.rootNodes.forEach(node => {
                    const printTemplateNode = node.cloneNode(true) as HTMLElement;

                    // Apply styles to the print template node
                    this.applyStyles(printTemplateNode, printStyle);
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
                        this.applyStyles(printContentNode, printStyle); // Apply styles to the content node
                        bodyContent.push(printContentNode.outerHTML);
                    }
                }
            }

            const fullHtml = `
                <html>
                    <head>${headContent.join('')}</head>
                    <body>${bodyContent.join('')}</body>
                </html>
            `;

            printWindow.document.write(fullHtml);
            printWindow.document.close();

            if (previewOnly) {
                return; // Exit without triggering print
            }

            if (closeWindow) {
                printWindow.onafterprint = () => {
                    printWindow.close();
                };
            }

            printWindow.focus();
            if (!previewOnly) {
                printWindow.print();
            }
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