# textlint-plugin-asciidoc-loose

[AsciiDoc](http://www.methods.co.nz/asciidoc/ "AsciiDoc")/[Asciidoctor](http://asciidoctor.org/ "Asciidoctor") **loose** support for [textlint](https://github.com/textlint/textlint "textlint").

## Limitation

- Support only "Paragraph" and "Str"
- Work on Node.js. This limitation come from [vscode-textmate](https://github.com/Microsoft/vscode-textmate "vscode-textmate").
    - Oniguruma is native module.

If you interesting in the plugin, please pull request to improve!

## Installation

    npm install textlint-plugin-asciidoc-loose

## Usage

```
{
    "plugins": [
        "asciidoc-loose"
    ]
}
```

## File Extension

This plugin recognize these file extension as asciidoc file. 

- ".asciidoc",
- ".adoc",
- ".asc"

http://asciidoctor.org/docs/asciidoc-recommended-practices/

## FAQ

### npm ERR! oniguruma@6.1.0 install: `node-gyp rebuild`

Travis CI fail to build.

You can fix this issue by adding following setting to `.travis.yml`

```yml
os:
- linux
sudo: false
language: node_js
node_js:
- "stable"
addons:
  apt:
    sources:
    - ubuntu-toolchain-r-test
    packages:
    - g++-4.8
install:
- export CXX=g++-4.8
- npm install
```

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
