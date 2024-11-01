# NgxPrintify

`NgxPrintify` is an Angular utility library that simplifies the process of printing content in your Angular applications. It provides a directive for easy integration into your components and a service for programmatic printing.

## Table of Contents

- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage](#usage)
  - [Directive Usage](#directive-usage)
  - [Service Usage](#service-usage)
- [API Reference](#api-reference)
- [License](#license)

## Installation

To install `ngx-printify`, use npm:

npm install ngx-printify --save

## Dependencies

### Version Compatibility

The `NgxPrintify` library supports the following Angular versions based on its releases:

| NgxPrintify Version | Angular Versions Supported    |
|----------------------|------------------------------|
| 1.1.6                | Angular 10.0.0 to 14.2.3     |
| 1.2.2                | Angular 15.0.0               |
| 1.3.1                | Angular 16.0.0               |
| 1.4.1                | Angular 17.0.0               |
| 1.5.2                | Angular 18.0.0               |


Ensure that your Angular project is within the specified version range to utilize the features of `NgxPrintify` effectively.
## Usage

### Directive Usage

The `NgxPrintify` directive allows you to trigger print functionality directly from your templates.

#### Step 1: Import the Module

Make sure to import the `NgxPrintifyModule` in your Angular module.

```typescript
import { NgxPrintifyModule } from 'ngx-printify';

@NgModule({
  imports: [
    NgxPrintifyModule,
    // other imports
  ],
})
export class AppModule {}
```

#### Step 2: Using the Directive in Templates

You can use the `ngxPrintify` directive in your component templates as follows:

```html
<div id="printArea1">
  <h1>Content of Print Area 1</h1>
  <p>This is the content that will be printed from printArea1.</p>
</div>

<div id="printArea2">
  <h1>Content of Print Area 2</h1>
  <p>This is the content that will be printed from printArea2.</p>
</div>

<ng-template #printTemplate>
  <h1>Print This Title</h1>
  <p>This is the content to print.</p>
  <div class="highlight">Highlighted content.</div>
</ng-template>

<button ngxPrintify 
        [printItemsId]="'printArea1,printArea2'"  <!-- Allow multiple IDs separated by commas -->
        [printTemplate]="printTemplate" 
        [printTitle]="'Print Example'" 
        [useExistingCss]="true" 
        [printStyle]="{ h1: { color: 'red' }, '.highlight': { border: 'solid 1px' } }" 
        [closeWindow]="true" 
        [previewOnly]="false">
  Print
</button>
```

### Service Usage

The `NgxPrintifyService` can be used for more programmatic control over printing.

#### Step 1: Import the Service

Inject the `NgxPrintifyService` into your component:

```typescript
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgxPrintifyService } from 'ngx-printify';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  @ViewChild('printTemplate') printTemplate!: TemplateRef<any>;

  constructor(private printService: NgxPrintifyService) {}

  print() {
    this.printService.print({
      printItemsId: 'printArea1,printArea2', // Allow multiple IDs separated by commas
      printTemplate: this.printTemplate, // Pass the TemplateRef here
      printTitle: 'Print Example',
      useExistingCss: true,
      printStyle: {
        h1: { color: 'red' },
        '.highlight': { border: 'solid 1px', color: 'blue' }
      },
      closeWindow: true,
      previewOnly: false,
      printWindowOptions: {
        width: 800,
        height: 600
      }
    });
  }
}
```

### API Reference

#### NgxPrintifyDirective

**Inputs:**
- `printItemsId?: string`: Comma-separated IDs of elements to print (supports multiple IDs).
- `printTitle?: string`: Title for the print window.
- `useExistingCss?: boolean`: Whether to use existing styles.
- `printStyle?: { [key: string]: { [property: string]: string } }`: Styles to apply to elements.
- `styleSheetFile?: string`: Custom stylesheets to include.
- `previewOnly?: boolean`: If true, shows the print preview without printing.
- `closeWindow?: boolean`: Whether to close the print window after printing.
- `printWindowOptions?: PrintWindowOptions`: Additional options for the print window.
- `printTemplate?: TemplateRef<any>`: Angular template to render.

#### NgxPrintifyService

**Method:**
- `print(params: { ... }): void`: Prepares and executes the print operation with the specified parameters.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.