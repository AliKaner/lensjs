import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LensImage, LensProvider } from '../src/react';

describe('LensImage component', () => {
  it('should be a function', () => {
    expect(typeof LensImage).toBe('function');
  });

  it('should create an element', () => {
    const element = React.createElement(LensImage, { src: 'test.jpg', effect: 'neon' });
    expect(element.props.src).toBe('test.jpg');
    expect(element.props.effect).toBe('neon');
  });

  it('should render the invert effect on the lotr image', () => {
    const html = renderToStaticMarkup(
      React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lord of the Rings', effect: 'invert' })
    );
    expect(html).toContain('data-lens-effect="invert"');
    expect(html).toContain('src="/lotr.jpg"');
  });

  it('should render the invert-full effect on the ikiru image', () => {
    const html = renderToStaticMarkup(
      React.createElement(LensImage, { src: '/ikiru.jpg', alt: 'Ikiru', effect: 'invert-full' })
    );
    expect(html).toContain('data-lens-effect="invert-full"');
    expect(html).toContain('src="/ikiru.jpg"');
  });

  it('should render the invert effect on the ikiru image', () => {
    const html = renderToStaticMarkup(
      React.createElement(LensImage, { src: '/ikiru.jpg', alt: 'Ikiru', effect: 'invert' })
    );
    expect(html).toContain('data-lens-effect="invert"');
    expect(html).toContain('src="/ikiru.jpg"');
  });

  it('should render a canvas overlay for pixel effects', () => {
    const html = renderToStaticMarkup(
      React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', effect: 'vortex' })
    );
    expect(html).toContain('<canvas');
    expect(html).toContain('crossorigin="anonymous"');
  });

  it('should apply color filter presets via data attribute', () => {
    const html = renderToStaticMarkup(
      React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', filter: 'bladerunner' })
    );
    expect(html).toContain('data-lens-filter="bladerunner"');
  });

  it('should expose intensity, lens size and shape for the stylesheet', () => {
    const html = renderToStaticMarkup(
      React.createElement(LensImage, {
        src: '/lotr.jpg',
        alt: 'Lotr',
        effect: 'invert',
        intensity: 1.5,
        lensSize: 200,
        lensShape: 'square',
      })
    );
    expect(html).toContain('--lens-intensity:1.5');
    expect(html).toContain('--lens-size:200px');
    expect(html).toContain('data-lens-shape="square"');
  });

  it('should render the reveal image when effect is reveal', () => {
    const html = renderToStaticMarkup(
      React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', effect: 'reveal', revealSrc: '/ikiru.jpg' })
    );
    expect(html).toContain('lens-reveal-img');
    expect(html).toContain('src="/ikiru.jpg"');
  });

  it('should inherit global config from LensProvider', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        LensProvider,
        { value: { lensSize: 220, lensShape: 'square', intensity: 1.8 } },
        React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', effect: 'invert' })
      )
    );
    expect(html).toContain('--lens-size:220px');
    expect(html).toContain('--lens-intensity:1.8');
    expect(html).toContain('data-lens-shape="square"');
  });

  it('should override global config with local component props', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        LensProvider,
        { value: { lensSize: 220, lensShape: 'square', intensity: 1.8 } },
        React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', effect: 'invert', lensSize: 150, lensShape: 'circle', intensity: 0.5 })
      )
    );
    expect(html).toContain('--lens-size:150px');
    expect(html).toContain('--lens-intensity:0.5');
    expect(html).toContain('data-lens-shape="circle"');
  });
});
