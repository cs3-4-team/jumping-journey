import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import PauseWindow from '../PauseWindow.vue';

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(PauseWindow, { props: { msg: 'Pause' } });

    expect(wrapper.text()).toContain('Pause');
  });
});
