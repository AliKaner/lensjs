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

  it('should expose filterIntensity for the blur-family filters', () => {
    const html = renderToStaticMarkup(
      React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', filter: 'blur-heavy', filterIntensity: 8 })
    );
    expect(html).toContain('--lens-filter-strength:8');
  });

  it('should render the reveal image when effect is reveal', () => {
    const html = renderToStaticMarkup(
      React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', effect: 'reveal', revealSrc: '/ikiru.jpg' })
    );
    expect(html).toContain('lens-reveal-img');
    expect(html).toContain('src="/ikiru.jpg"');
  });

  it('should render the back image for flip-reveal', () => {
    const html = renderToStaticMarkup(
      React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', effect: 'flip-reveal', revealSrc: '/ikiru.jpg' })
    );
    expect(html).toContain('lens-reveal-img');
    expect(html).toContain('src="/ikiru.jpg"');
  });

  it.each(['magnify', 'blur-lens', 'grayscale-lens'] as const)(
    'should render a viewport copy for the %s lens',
    (effect) => {
      const html = renderToStaticMarkup(
        React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', effect })
      );
      expect(html).toContain('lens-viewport');
      // The viewport contains a second copy of the source image
      expect(html.split('src="/lotr.jpg"').length - 1).toBe(2);
    }
  );

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

  it('should inherit a theme-level filter from LensProvider', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        LensProvider,
        { value: { filter: 'noir' } },
        React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', effect: 'zoom' })
      )
    );
    expect(html).toContain('data-lens-filter="noir"');
  });

  it('should apply the provider filter to wrapped children too', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        LensProvider,
        { value: { filter: 'cyberpunk' } },
        React.createElement(
          LensImage,
          { effect: 'pulse-glow' },
          React.createElement('button', null, 'Launch')
        )
      )
    );
    expect(html).toContain('data-lens-filter="cyberpunk"');
    expect(html).toContain('data-lens-effect="pulse-glow"');
    expect(html).toContain('<button>Launch</button>');
  });

  it('should let a local filter override the provider filter', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        LensProvider,
        { value: { filter: 'noir' } },
        React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', filter: 'matrix' })
      )
    );
    expect(html).toContain('data-lens-filter="matrix"');
  });

  it.each(['pop', 'jelly', 'gradient-border', 'color-pop', 'hue-cycle'] as const)(
    'should render the %s CSS effect via data attribute',
    (effect) => {
      const html = renderToStaticMarkup(
        React.createElement(LensImage, { src: '/lotr.jpg', alt: 'Lotr', effect })
      );
      expect(html).toContain(`data-lens-effect="${effect}"`);
      // Pure CSS effects never mount the pixel-processing canvas
      expect(html).not.toContain('<canvas');
    }
  );

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
