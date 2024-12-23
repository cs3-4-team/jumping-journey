import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import PauseWindow from '../PauseWindow.vue';

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(PauseWindow, {
      props: {
        data: {
          msg: 'Pause',
          handler: () => {},
          btnText: 'Continue'
        }
      }
    });

    expect(wrapper.text()).toContain('Pause');
  });
});
