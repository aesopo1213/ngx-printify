import { Injectable, TemplateRef } from '@angular/core';
import { NgxPrintifyUtil, PrintWindowOptions } from './ngx-printify-util';

@Injectable({
  providedIn: 'root'
})
export class NgxPrintifyService {

  constructor() { }

  public print(params: {
    printItemsId?: string;
    printTitle?: string;
    printTemplate?: TemplateRef<any>; // Add TemplateRef for ng-template
    useExistingCss?: boolean;
    printStyle?: { [key: string]: { [property: string]: string } };
    styleSheetFile?: string;
    previewOnly?: boolean;
    closeWindow?: boolean;
    printWindowOptions?: PrintWindowOptions;
  }): void {
    const printWindowOptions: PrintWindowOptions = {
      width: 800,
      height: 600,
      menubar: 'no',
      toolbar: 'no',
      location: 'no',
      status: 'no',
      resizable: 'yes',
      scrollbars: 'yes'
    };

    // Merge custom options with default options
    params.printWindowOptions = Object.assign(printWindowOptions, params.printWindowOptions);

    // Call the print utility with the parameters
    NgxPrintifyUtil.preparePrintWindow(params);
  }
}