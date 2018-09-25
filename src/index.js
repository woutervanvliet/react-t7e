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
    result = result.split(`{${from}`)
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

  constructor(engine: TranslateEngine) {
    this.engine = engine;
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
  );
}

const {
  Provider: TranslationContextProvider,
  Consumer: TranslationContext,
} = React.createContext(new TranslationProxy(new MockTranslateEngine()));

const {
  Provider: TextDomainProvider,
  Consumer: TextDomainConsumer,
} = React.createContext('messages');

function T(props: TranslateProps) {
  return (
    <TextDomainConsumer>
      {(textDomain: string) => (
        <TranslationContext>
          {(engine: TranslateEngine) => {
            const { count } = props;
            if (count === undefined || !props.sourcePlural) {
              return engine._(props.source, props.context, props.replacements, textDomain);
            }

            return engine._n(
              props.source,
              props.sourcePlural,
              count,
              props.context,
              props.replacements,
              props.domain || textDomain,
            )
              .replace(/%d/g, count.toFixed(0))
              .replace(/%f/g, count.toFixed(2));
          }}
        </TranslationContext>
      )}
    </TextDomainConsumer>
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
      <TextDomainProvider value={domain}>
        <Component {...props} />
      </TextDomainProvider>
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
