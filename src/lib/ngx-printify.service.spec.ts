import { TestBed } from '@angular/core/testing';
import { NgxPrintifyService } from './ngx-printify.service'; // Adjust the path as necessary
import { NgxPrintifyUtil } from './ngx-printify-util';
import { TemplateRef } from '@angular/core';

describe('NgxPrintifyService', () => {
  let service: NgxPrintifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxPrintifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call NgxPrintifyUtil.preparePrintWindow with correct parameters', () => {
    const printParams = {
      printItemsId: 'elementId',
      printTemplate: {} as TemplateRef<any>, // Mock TemplateRef
      printTitle: 'Test Title',
      printDescription: 'Test Description',
      useExistingCss: false,
      printStyle: {},
      styleSheetFile: '',
      printWindowOptions: { width: 800, height: 600 },
      closeWindow: false,
      previewOnly: false
    };

    spyOn(NgxPrintifyUtil, 'preparePrintWindow');

    service.print(printParams);

    expect(NgxPrintifyUtil.preparePrintWindow).toHaveBeenCalledWith({
      ...printParams,
      printWindowOptions: {
        width: 800,
        height: 600,
        menubar: 'no',
        toolbar: 'no',
        location: 'no',
        status: 'no',
        resizable: 'yes',
        scrollbars: 'yes',
      }
    });
  });
});