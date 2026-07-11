import { describe, it, expect } from 'vitest';
import React from 'react';
import { LensImage } from '../src/react';

describe('LensImage component', () => {
  it('should be a function', () => {
    expect(typeof LensImage).toBe('function');
  });

  it('should create an element', () => {
    const element = React.createElement(LensImage, { src: 'test.jpg', effect: 'blur' });
    expect(element.props.src).toBe('test.jpg');
    expect(element.props.effect).toBe('blur');
  });
});
