export const help = () => `

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
                          filter packages by regular expression.
    -d|--dir <dirname>
                          use different dirname instead of current working
                          directory.
    --from <tagname>
                          start from git tag or hash.
    --to <tagname>
                          end with git tag or hash.

`
