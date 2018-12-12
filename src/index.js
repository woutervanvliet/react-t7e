// @flow
import * as React from 'react';
import MoEngine from './mo-engine';

type Replacements = {
  [key: string]: string | number,
}

type TranslateProps = {
  source: string,
  sourcePlural?: string,
  count?: number,
  context?: string,
  replacements?: Replacements,
  domain?: string,
}

const replace = (input, replacements: Replacements) => {
  let result = input;

  const replacementKeys = Object.keys(replacements);
  for (let i = 0; i < replacementKeys.length; i += 1) {
    const from = replacementKeys[i];
    const to = replacements[from];
    result = result.split(`{${from}}`)
      .join(`${to}`);
  }

  return result;
};

interface TranslateEngine {
  translate(
    source: string,
    sourcePlural?: string,
    count?: number,
    context?: string,
    textDomain?: string
  ): string;
}

class MockTranslateEngine implements TranslateEngine {
  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  translate(source: string, sourcePlural?: string, count?: number, context?: string) {
    if (sourcePlural && count !== undefined && (count === 0 || count > 1)) {
      return sourcePlural;
    }

    return source;
  }
}

class TranslationProxy {
  engine: *;

  _perDomainCache = {

  }

  constructor(engine: TranslateEngine) {
    this.engine = engine;
  }

  forDomain(domain: string) {
    if (this._perDomainCache[domain] === undefined) {
      const engine = {
        translate: (source, sourcePlural, count, context, textDomain = domain) => (
          this.engine.translate(source, sourcePlural, count, context, textDomain)
        ),
      };

      this._perDomainCache[domain] = new TranslationProxy(engine);
    }

    return this._perDomainCache[domain];
  }

  _ = (
    source: string,
    context?: string,
    replacements: Replacements = {},
    domain?: string,
  ) => this._n(source, undefined, undefined, context, replacements, domain)

  _n = (
    singularSource: string,
    pluralSource: string,
    count: number,
    context?: string,
    replacements: Replacements = {},
    domain?: string,
  ) => replace(
    this.engine.translate(
      singularSource,
      pluralSource,
      count,
      context,
      domain,
    ),
    replacements,
  )
    .replace(/%d/g, count && count.toFixed(0))
    .replace(/%f/g, count && count.toFixed(2));
}

const {
  Provider: TranslationContextProvider,
  Consumer: TranslationContext,
} = React.createContext(new TranslationProxy(new MockTranslateEngine()));

function T(props: TranslateProps) {
  return (
    <TranslationContext>
      {(engine: TranslateEngine) => {
        const { count } = props;
        if (count === undefined || !props.sourcePlural) {
          return engine._(
            props.source,
            props.context,
            props.replacements,
            props.domain,
          );
        }

        return engine._n(
          props.source,
          props.sourcePlural,
          count,
          props.context,
          props.replacements,
          props.domain,
        );
      }}
    </TranslationContext>
  );
}

type TranslationProviderProps = {
  engine: TranslateEngine,
  children: React.Node,
}

function TranslationProvider({ engine, children }: TranslationProviderProps) {
  return (
    <TranslationContextProvider value={new TranslationProxy(engine)}>
      {children}
    </TranslationContextProvider>
  );
}

function _(
  source: string,
  context?: string,
  replacements: Replacements = {},
  domain?: string,
): React.Node {
  return (
    <T
      source={source}
      context={context}
      replacements={replacements}
      domain={domain}
    />
  );
}

function withTextDomain(domain: string) {
  return Component => function withDomain(props) {
    return (
      <TranslationContext>
        {
          engine => (
            <TranslationContextProvider value={engine.forDomain(domain)}>
              <Component {...props} />
            </TranslationContextProvider>
          )
        }
      </TranslationContext>
    );
  };
}

function _n(
  singularSource: string,
  pluralSource: string,
  count: number,
  context?: string,
  replacements: Replacements = {},
  domain?: string,
): React.Node {
  return (
    <T
      source={singularSource}
      sourcePlural={pluralSource}
      count={count}
      context={context}
      replacements={replacements}
      domain={domain}
    />
  );
}

export {
  TranslationContext,
  TranslationProvider,
  withTextDomain,
  MoEngine,
  T,
  _,
  _n,
};
