import { TestBed } from '@angular/core/testing';
import { NgxPrintifyUtil } from './ngx-printify-util'; // Adjust the path as necessary
import { TemplateRef, EmbeddedViewRef } from '@angular/core';

describe('NgxPrintifyUtil', () => {
    let printWindowMock: any;

    beforeEach(() => {
        // Create a mock for the print window
        printWindowMock = {
            document: {
                write: jasmine.createSpy('write'),
                close: jasmine.createSpy('close')
            },
            onafterprint: null,
            focus: jasmine.createSpy('focus'),
            print: jasmine.createSpy('print'),
            close: jasmine.createSpy('close'),
            onload: null
        };

        // Mock the window.open method to return the printWindowMock
        spyOn(window, 'open').and.returnValue(printWindowMock);
    });

    it('should open a new print window with correct options', () => {
        NgxPrintifyUtil.preparePrintWindow({
            printItemsId: 'elementId',
            printTitle: 'Test Print',
            printTemplate: undefined,
            useExistingCss: false,
            printStyle: {},
            styleSheetFile: '',
            printWindowOptions: {
                width: 800,
                height: 600,
                menubar: 'no',
                toolbar: 'no',
                location: 'no',
                status: 'no',
                resizable: 'yes',
                scrollbars: 'yes'
            },
            closeWindow: true,
            previewOnly: false
        });

        expect(window.open).toHaveBeenCalledWith('', '_blank', 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes');
        expect(printWindowMock.document.write).toHaveBeenCalled();
        expect(printWindowMock.document.close).toHaveBeenCalled();
    });

    it('should trigger print when not in preview mode', (done) => {
        NgxPrintifyUtil.preparePrintWindow({
            printItemsId: 'elementId',
            printTitle: 'Test Print',
            printTemplate: undefined,
            useExistingCss: false,
            printStyle: {},
            styleSheetFile: '',
            printWindowOptions: { width: 800, height: 600 },
            closeWindow: true,
            previewOnly: false
        });

        // Simulate the onload event to trigger the print function
        printWindowMock.onload = () => {
            expect(printWindowMock.print).toHaveBeenCalled();
            done(); // Indicate that the test is complete
        };

        // Simulate loading the window
        if (printWindowMock.onload) {
            printWindowMock.onload(); // Call the onload function
        }
    });

    it('should close the print window after printing if closeWindow is true', (done) => {
        NgxPrintifyUtil.preparePrintWindow({
            printItemsId: 'elementId',
            printTitle: 'Test Print',
            printTemplate: undefined,
            useExistingCss: false,
            printStyle: {},
            styleSheetFile: '',
            printWindowOptions: { width: 800, height: 600 },
            closeWindow: true,
            previewOnly: false
        });

        // Simulate the onload event to trigger the print function
        printWindowMock.onload = () => {
            // Trigger the print function
            printWindowMock.print();

            // Simulate the onafterprint event
            if (printWindowMock.onafterprint) {
                printWindowMock.onafterprint(); // Call the onafterprint function
            }

            // Use a short timeout to wait for the close call
            setTimeout(() => {
                expect(printWindowMock.close).toHaveBeenCalled(); // Verify that close was called
                done(); // Indicate that the test is complete
            }, 0);
        };

        // Simulate loading the window
        if (printWindowMock.onload) {
            printWindowMock.onload(); // Call the onload function
        }
    });
});