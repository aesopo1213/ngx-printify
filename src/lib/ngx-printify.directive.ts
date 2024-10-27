import { Directive, HostListener, Input, TemplateRef, ViewChild } from "@angular/core";
import { NgxPrintifyUtil } from "./ngx-printify-util";

interface PrintWindowOptions {
    width?: number;
    height?: number;
    menubar?: string;
    toolbar?: string;
    location?: string;
    status?: string;
    resizable?: string;
    scrollbars?: string;
}

@Directive({
    selector: '[ngxPrintify]'
})
export class NgxPrintifyDirective {
    @Input() printItemsId?: string = "";
    @Input() printTitle?: string;
    @Input() useExistingCss?: boolean;
    @Input() printStyle?: { [key: string]: { [property: string]: string } };
    @Input() styleSheetFile?: string;
    @Input() previewOnly: boolean = false;
    @Input() closeWindow: boolean = true;
    @Input() printWindowOptions: PrintWindowOptions = {};
    @Input() printTemplate?: TemplateRef<any>;

    constructor() { }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        const printWindowOptions: PrintWindowOptions = {
            width: 800,
            height: 600,
            menubar: 'no',
            toolbar: 'no',
            location: 'no',
            status: 'no',
            resizable: 'yes',
            scrollbars: 'yes',
        };

        NgxPrintifyUtil.preparePrintWindow({
            printItemsId: this.printItemsId,
            printTitle: this.printTitle,
            printTemplate: this.printTemplate, // Pass the TemplateRef here
            useExistingCss: this.useExistingCss,
            printStyle: this.printStyle,
            styleSheetFile: this.styleSheetFile,
            previewOnly: this.previewOnly,
            closeWindow: this.closeWindow,
            printWindowOptions: Object.assign(printWindowOptions, this.printWindowOptions)
        });
    }
}