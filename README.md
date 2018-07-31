# React T7E
The simplest way to do translations in React that I know of.

## How to use
You can get started with almost no setup, if all you need is a simple way to handle plurality, or if you intend to make
your app translatable later. 

```javascript
import { _, _n } from 'react-t7e';

function MyComponent(props) {
    return (
        <div>
            <h1>{_('Hello World')}</h1>
            <p>{_n('The world has one fish.', 'The world has %d fish in the sea.', props.fishCount)}</p>
        </div>
    )
}
```

This just works. But you probably want to be able to use it for actual translations. You need a `TranslationProvider` and
a `TranslationEngine` for that. The engine should be an instance with, at least, a single `translate` method. Such as:

```javascript
class ShoutEngine {
    translate(
        source: string,
        sourcePlural?: string,
        count?: number,
        context?: string
    ) {
        let result = count === 1 || !sourcePlural ? source : sourcePlural;

        return result
            .toUpperCase()
            .replace(
                /%([DF])/g,
                (match, letter: string) => `%${letter.toLowerCase()}`
            );
    }
}
```

Which you use as such, if indeed all you want is to uppercase your strings.

````javascript
import { TranslationProvider } from 'react-t7e';

const engine = new ShoutEngine();

function App() {
    return (
        <TranslationProvider engine={engine}>
            <MyComponent />
        </TranslationProvider>
    )
}
````

But to make it really useful, we use hook up [Jed](https://github.com/messageformat/Jed) and 
[jed-gettext-parser](https://github.com/WrinklyNinja/jed-gettext-parser).

```javascript
import ReactDOM from 'react-dom';
import { MoEngine, TranslationProvider } from 'react-t7e';

const language = 'nl_NL';

fetch('/language/' + language + '.mo')
    .then((response) => response.arrayBuffer())
    .then((moData) => {
        const engine = new MoEngine(moData);
        ReactDOM.render(
            <TranslationProvider engine={engine}>
                <MyComponent />
            </TranslationProvider>,
            document.getElementById('app'),
        )
    })
```

You can of course read the data from your .mo files any way you want, send another `engine` down the `TranslationProvider`
to change the language, wrap multiple `TranslationProvider`'s if you want some part of your app to read messages from
another language or write your own engine to read translations from somewhere else.

## Placeholders and formatting
Translation without some form of placeholders is practically useless. This module supports very basic placeholders,
and count formatting (in the `_n` function).

Simply pass an object with key-value pairs as 3rd argument to `_` or 5th argument to `_n`, and use the keys between curly
braces in your source string to get it replaced. Or use either `%d` or '%f' to get your `count` argument as an integer
or floating point (two positions) in your result string. This intentionally looks like 
[printf](https://www.gnu.org/software/libc/manual/html_node/Formatted-Output-Functions.html), but only these two 
formatting instructions are supported. More may be added in a future version.

```javascript
const withPlaceholder = _('Hello {name}, how are you?', 'Standard greeting, in menu', {
    name: this.props.name,
});

const withNumberFormatting = _n(
    'Hello {name}, you have one message', 
    'Hello {name}, you have %d messages', 
    props.messageCount, 
    'Standard greeting, in menu', {
        name: props.name,
    },
);
```

## Alternative syntax
The exported `_` and `_n` functions simply return a React.Node with the props filled in based on your positional arguments.
This makes it easy to scan your code for translatable strings, but isn't all that React-like. If you prefer, you can directly
import the `T` component and use that.

Pull requests to document how to generate .pot files from this are very much welcome.

## How to create .mo files
.mo files are combiled .po files. An editor such as [PoEdit](https://poedit.net) can be used to create both. It can
also be used to generate a template (.pot) file by scanning your code, but that can be tricky and it needs to understand
your exact setup of JavaScript to really work. Intead, I recommend 
[babel-gettext-extractor](https://github.com/getsentry/babel-gettext-extractor) to generate a full POT file every time
you build your code. Configuration of the plugin may look like this:

```javascript
[
    "babel-gettext-extractor",
    {
        baseDirectory: process.cwd(),
        headers: {
            "content-type": "text/plain; charset=UTF-8",
            "plural-forms": "nplurals=2; plural=(n!=1);"
        },
        fileName: 'translation-template.pot',
        functionNames: {
            _: ['msgid', 'msgctxt'],
            _n: ['msgid', 'msgid_plural', 'count', 'msgctxt'],
        },
    }
]
```

## Tips for loading and selecting translations
As shown in the example, you can load .mo files with the Fetch API. But that's not the only way. The only thing that
matters, is that you get the contents of your .mo file as `ArrayBuffer`.

If you use webpack, consider [arraybuffer-loader](https://github.com/pine/arraybuffer-loader) and you can it like so:

```javascript
import ReactDOM from 'react-dom';
import { MoEngine, TranslationProvider } from 'react-t7e';
import moData from './nl_NL.mo';
const engine = new MoEngine(moData);

ReactDOM.render(
    <TranslationProvider engine={engine}>
        <MyComponent />
    </TranslationProvider>,
    document.getElementById('app'),
)

```

Hook up something like [react-loadable](https://github.com/jamiebuilds/react-loadable) and things get even more fun #codesplitting.


```javascript
import { MoEngine, TranslationProvider } from 'react-t7e';

const render = (moData, props) => (
    <TranslationProvider engine={new MoEngine(moData.default)}>
        {props.children}
    </TranslationProvider>
);

const Loading = () => null;
const i18n = {
    nl: Loadable({
        loader: () => import("./nl_NL.mo"),
        render: render,
        loading: Loading
    }),
    da: Loadable({
        loader: () => import("./da_DK.mo"),
        render: render,
        loading: Loading
    })
};

const languageCode = 'nl';
const Language = i18n[languageCode]

ReactDOM.render(
    <Language>
        <MyComponent />
    </Language>,
    document.getElementById('app'),
)
```

## Server-side rendering
Works just the same. This module uses the stable `React.createContext` API to send the translation engine around.

## Motivation
Translations should be simple, use an implementation that's intuitive and almost as easy to use as just inserting 
strings. Inspiration for the API comes from the WordPress/PHP implementation of gettext. Code that's familiar to many.
