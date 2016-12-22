import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AffixDirective } from './affix.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [AffixDirective],
  exports: [AffixDirective]
})
export class AffixModule {
}
