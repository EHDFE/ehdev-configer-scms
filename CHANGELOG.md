# CHANGELOG

## v0.1.7
---
CHANGE:
  - use [mini-css-extract-plugin] (https://github.com/webpack-contrib/mini-css-extract-plugin) to extract css in production mode.
> ⚠️ Must be used with Jarvis@0.4.3 or above.

## v0.1.5
---
CHANGE:
  - add `legacy-dynamic-import-plugin` for supports dynamic import commonjs code directly.

## v0.1.4
---
CHANGE:
  - add config for allChunk in extactTextPlugin.


## v0.1.3
---
CHANGE:
  - remove publishPath in manifest's path

## v0.1.2
---
BUGFIX:
  - disable mangle in production uglify build

## v0.1.1
---
BUGFIX:
  - fix the issue that extract css failed in async loaded chunks.

## v0.1.0
---
FEATURE:
  - supports webpack v4
  - deps upgrade:
    - autoprefixer: `^7.2.1` to `^8.1.0`
    - copy-webpack-plugin: `^4.4.2` to `^4.5.0`
    - less: `^2.7.3` to `^3.0.1`
    - postcss-loader: `^2.0.9` to `^2.1.1`
    - posthtml-loader: `^0.11.0` to `^1.0.1`
    - url-loader: `^0.6.2` to `^1.0.0`
    - webpack-manifest-plugin: `^1.3.2` to `^2.0.0-rc.2`
    
## v0.0.10
---
BUGFIX:
  - less: add strictMath: true

## v0.0.7
---
BUGFIX:
  - remove 'webpack-chunk-hash' plugin

## v0.0.6
---
BUGFIX:
  - change projectConfig `HtmlWebpackPlugin` to `htmlWebpackPlugin`

## v0.0.5
---
BUGFIX:
  - minimize css in production build

## v0.0.4
---
FEATURE:
  - support import anything by file-loader by add query '?asFile'

## v0.0.3
---
FEATURE:
  - support dynamic publicPath setting in devlopment mode

BUGFIX:
  - fix the conflict with angular template express by changing posthtml's delimiters.

## v0.0.2
---
FEATURE:
  - add `posthtml-loader` and `posthtml-expression`, which supports  local variables and expressions in your html templates

## v0.0.1
---
- init