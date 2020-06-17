import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { debounce } from '@ember/runloop';
import { classNames, tagName } from '@ember-decorators/component';
import classic from 'ember-classic-decorator';
import { lazyClick } from '../helpers/lazy-click';

@classic
@tagName('tr')
@classNames('task-group-row', 'is-interactive')
export default class TaskGroupRow extends Component {
  taskGroup = null;
  debounce = 300;

  @oneWay('taskGroup.count') count;

  onClick() {}

  click(event) {
    lazyClick([this.onClick, event]);
  }

  @computed('count', 'taskGroup.scaling.min')
  get isMinimum() {
    const scaling = this.taskGroup.scaling;
    if (!scaling || scaling.min == null) return false;
    return this.count <= scaling.min;
  }

  @computed('count', 'taskGroup.scaling.max')
  get isMaximum() {
    const scaling = this.taskGroup.scaling;
    if (!scaling || scaling.max == null) return false;
    return this.count >= scaling.max;
  }

  @action
  countUp() {
    const scaling = this.taskGroup.scaling;
    if (!scaling || scaling.max == null || this.count < scaling.max) {
      this.incrementProperty('count');
      this.scale(this.count);
    }
  }

  @action
  countDown() {
    const scaling = this.taskGroup.scaling;
    if (!scaling || scaling.min == null || this.count > scaling.min) {
      this.decrementProperty('count');
      this.scale(this.count);
    }
  }

  scale(count) {
    debounce(this, sendCountAction, count, this.debounce);
  }
}

function sendCountAction(count) {
  return this.taskGroup.scale(count);
}
