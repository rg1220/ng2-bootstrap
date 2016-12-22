import { Component } from '@angular/core';
import { AffixStatusChange } from '../../../components/affix/affix.directive';

// webpack html imports
let template = require('./affix-demo.html');

@Component({
  selector: 'affix-demo',
  template: template
})
export class AffixDemoComponent {

  public onAffixChange(event:AffixStatusChange):void {
    console.log('Navbar changed from ' + event.oldStatus + ' to ' + event.newStatus);
  }
}
