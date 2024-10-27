import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPrintifyDirective } from './ngx-printify.directive';
import { NgxPrintifyUtil } from './ngx-printify-util';

@Component({
    template: `
        <ng-template #printTemplate>
            <h1>Test Print Template</h1>
        </ng-template>
        <button ngxPrintify [printItemsId]="itemsId" [printTemplate]="printTemplate"
                [useExistingCss]="useCss" [printStyle]="printStyle" 
                [styleSheetFile]="styleSheet" [previewOnly]="preview" 
                [closeWindow]="closeWin">Print</button>
    `
})
class TestComponent {
    @ViewChild('printTemplate', { static: true }) printTemplate!: TemplateRef<any>;
    itemsId = 'elementId';
    useCss = true;
    printStyle = { color: 'red' };
    styleSheet = 'path/to/stylesheet.css';
    preview = false;
    closeWin = false;
}

describe('NgxPrintifyDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NgxPrintifyDirective, TestComponent]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Ensure the template is initialized
    });

    it('should call NgxPrintifyUtil.preparePrintWindow on click', () => {
        const preparePrintWindowSpy = spyOn(NgxPrintifyUtil, 'preparePrintWindow');

        const button = fixture.nativeElement.querySelector('button');
        button.click(); // Simulate click event

        expect(preparePrintWindowSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            printItemsId: component.itemsId,
            printTemplate: component.printTemplate, // Ensure this is set correctly
            useExistingCss: component.useCss,
            printStyle: component.printStyle,
            styleSheetFile: component.styleSheet,
            previewOnly: component.preview,
            closeWindow: component.closeWin,
            printWindowOptions: jasmine.objectContaining({
                width: 800,
                height: 600,
                menubar: 'no',
                toolbar: 'no',
                location: 'no',
                status: 'no',
                resizable: 'yes',
                scrollbars: 'yes'
            })
        }));
    });
});