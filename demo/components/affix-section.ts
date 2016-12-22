import { Component } from '@angular/core';

let doc = require('../../components/affix/readme.md');
let titleDoc = require('../../components/affix/title.md');

let ts = require('!!raw?lang=typescript!./affix/affix-demo.ts');
let html = require('!!raw?lang=markup!./affix/affix-demo.html');

@Component({
  selector: 'affix-section',
  template: `
    <demo-section [name]="name" [src]="src" [titleDoc]="titleDoc" [html]="html" [ts]="ts" [doc]="doc">
      <affix-demo></affix-demo>
    </demo-section>`
})
export class AffixSectionComponent {
  public name:string = 'Affix';
  public src:string = 'https://github.com/valor-software/ng2-bootstrap/blob/master/components/rating';
  public html:string = html;
  public ts:string = ts;
  public titleDoc:string = titleDoc;
  public doc:string = doc;
}

// @Component({
//   selector: 'affix-section',
//   template: `
//   <section id="${name.toLowerCase()}">
//     <h1>${name}<small>(<a href="${src}">src</a>)</small></h1>
//
//     <hr>
//
//     <div class="description">${titleDoc}</div>
//
//     <br/>
//
//     <div class="markup">
//       <tabset>
//         <tab heading="Markup">
//           <div class="card card-block panel panel-default panel-body">
//             <pre class="language-html"><code class="language-html" ngNonBindable>${html}</code></pre>
//           </div>
//         </tab>
//         <tab heading="TypeScript">
//           <div class="card card-block panel panel-default panel-body">
//             <pre class="language-typescript"><code class="language-typescript" ngNonBindable>${ts}</code></pre>
//           </div>
//         </tab>
//       </tabset>
//     </div>
//
//     <br/>
//
//     <div class="api">
//       <h2>API</h2>
//       <div class="card card-block panel panel-default panel-body">${doc}</div>
//     </div>
//   </section>
//   `,
//   directives: [AffixDemo, TAB_DIRECTIVES, CORE_DIRECTIVES]
// })
// export class AffixSectionComponent {
// }
