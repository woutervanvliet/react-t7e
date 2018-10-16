// @flow
import { describe, it, afterEach } from 'mocha';
import React from 'react';
import setupJsdom from 'jsdom-global';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect } from 'chai';
import * as fs from 'fs';
import {
  _,
  _n,
  MoEngine,
  TranslationProvider,
  withTextDomain,
  TranslationContext,
} from './src/index';

function bufferToArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

const messages = bufferToArrayBuffer(fs.readFileSync('./test/messages.mo'));
const greetings = bufferToArrayBuffer(fs.readFileSync('./test/greetings.mo'));

const cleanupJsdom = setupJsdom();
afterEach(cleanupJsdom);

describe('without context', () => {
  it('should render out the input value', () => {
    const result = renderToStaticMarkup(<p>{_('Hello')}</p>);
    expect(result).to.equal('<p>Hello</p>');
  });
  it('should detect singular', () => {
    const result = renderToStaticMarkup(<p>{_n('Hello one person', 'Hello %d people', 1)}</p>);
    expect(result).to.equal('<p>Hello one person</p>');
  });
  it('should detect plural', () => {
    const result = renderToStaticMarkup(<p>{_n('Hello one person', 'Hello %d people', 2)}</p>);
    expect(result).to.equal('<p>Hello 2 people</p>');
  });
  it('should replace a replacement', () => {
    const result = renderToStaticMarkup(<p>{_('Hello {user}', undefined, { user: 'TheUser' })}</p>);
    expect(result).to.equal('<p>Hello TheUser</p>');
  });
});

describe('with context', () => {
  const engine = new MoEngine(messages);
  const render = element => renderToStaticMarkup(
    <TranslationProvider engine={engine}>{element}</TranslationProvider>,
  );

  it('should translate hello', () => {
    const result = render(<p>{_('Hello')}</p>);
    expect(result).to.equal('<p>Hallo</p>');
  });
  it('should detect singular', () => {
    const result = render(<p>{_n('Hello one person', 'Hello %d people', 1)}</p>);
    expect(result).to.equal('<p>Hallo een persoon</p>');
  });
  it('should detect plural', () => {
    const result = render(<p>{_n('Hello one person', 'Hello %d people', 2)}</p>);
    expect(result).to.equal('<p>Hallo 2 personen</p>');
  });
  it('should replace numbers also when using TranslationContext - singular', () => {
    const renderSpan = e => <span title={e._n('%d person', '%d people', 1)} />;
    const result = render(<TranslationContext>{renderSpan}</TranslationContext>);
    // noinspection CheckTagEmptyBody
    expect(result).to.equal('<span title="1 person"></span>');
  });
  it('should replace numbers also when using TranslationContext - plural', () => {
    const renderSpan = e => <span title={e._n('%d person', '%d people', 2)} />;
    const result = render(<TranslationContext>{renderSpan}</TranslationContext>);
    // noinspection CheckTagEmptyBody
    expect(result).to.equal('<span title="2 people"></span>');
  });
});

describe('multiple domains', () => {
  const engine = new MoEngine(messages, 'messages', {
    greetings,
  });
  const render = element => renderToStaticMarkup(
    <TranslationProvider engine={engine}>{element}</TranslationProvider>,
  );

  it('should translate hello from two different domains', () => {
    const HelloComponent = () => _('Hello');
    const HelloGreeting = withTextDomain('greetings')(HelloComponent);
    const HelloMessages = withTextDomain('messages')(HelloComponent);

    const result = render(
      <React.Fragment>
        <HelloGreeting />
        {' - '}
        <HelloMessages />
      </React.Fragment>,
    );

    expect(result).to.equal('Yolo - Hallo');
  });

  it('should find the domain directly in the _ call', () => {
    const result = render(_('Hello', undefined, undefined, 'greetings'));
    expect(result).to.equal('Yolo');
  });
  it('should find the domain directly in the _n call', () => {
    const result = render(_n('Hello one', 'Hello %d', 2, undefined, undefined, 'greetings'));
    expect(result).to.equal('Yolo 2');
  });
});
