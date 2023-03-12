# conv-changelog 

A [conventional commits][conventional commits] compatible changelog generator.

Attribute commit messages according to determine the next semver version of your
package.

With this, `conv-changelog` can generate the changelog in markdown format for
the whole git history or just the next unreleased version.

**Conventions:** (From [conventional commits][conventional commits])

The commit message should be structured as follows:

----
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```
----

Where:

| type     | note                                                                  |
| -------- | --------------------------------------------------------------------- |
| `feat!:` | **!** describes a BREAKING CHANGE (The major version needs increment) |
| `feat:`  | describes a feature change (The minor version needs increment)        |
| `fix:`   | describes a bugfix change (The patch version needs increment)         |
| `chore:` | types other than `feat:` or `fix:` are allowed, e.g. `build:`, `chore:`, `docs:`, `refactor:`, `perf:`, `test:` |

For breaking changes it is good practice to describe the reason with `BREAKING
CHANGE:` in the footer, e.g.

```
chore!: drop support for node 12

BREAKING CHANGE: Switch to ESM modules.
```

Additionally you can use the types `break:` or `BREAKING CHANGE:` in this
project, to describe breaking commits. E.g.

```
break: drop support for node 12

We are switching to ESM modules.
```

Any commit message which is not according to this convention is considered being
of type `fix:` and it's patch version is incremented.

If a `package.json` file is found in the working directory the version property
is updated to the next pre-release according to the above described conventions.

Otherwise a `VERSION` file is generated or updated.

How does is look like? Take a look at [CHANGELOG.md](./CHANGELOG.md).

# Usage 

Either install in your project or globally with:

```
npm install -g conv-changelog
```

Then run the cli, e.g. (this creates a CHANGELOG.md for the next version)

```
conv-changelog -o
```


# CLI

```
  conv-changelog [options]

  options:

    -h|-?|--help
                          this help
    -v|--version
                          show version
    -i|--in <filename>
                          input filename; defaults to CHANGELOG.md
    -o|--out [<filename>]
                          output filename; if <filename> is omitted then input
                          file gets pre-pended.
    -r|--revision <count>
                          generate <count> versions
                          default is 1; if set to 0 the full history is
                          processed.
    -t|--theme [groups|lines]
                          use theme groups or lines
                          default is lines.
    -u|--url <href>
                          Repo url.
    -f|--filter <regex>
                          filter commit subjects by regular expression.
    -d|--dir <dirname>
                          use different dirname instead of current working
                          directory.
    --from <tagname>
                          start from git tag or hash.
    --to <tagname>
                          end with git tag or hash.
```

# API

```js
import {changelog, handleFiles} from 'conv-changelog'

// this generates CHANGELOG.md for the complete git history.
const options = {
  cwd: process.cwd(),
  in: 'CHANGELOG.md',
  out: 'CHANGELOG.md',
  revisions: 0
}
const { changes, lastVersion, nextVersion } = await changelog(options)
await handleFiles(options, { changes, lastVersion, nextVersion })
```

Please check out `main()` in [./src/cli.js](./src/cli.js).

# License

[MIT](./LICENSE)


[conventional commits]: https://www.conventionalcommits.org/en/v1.0.0/
