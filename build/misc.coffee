
{ promisify, coroutine } = require 'bluebird'

copyfiles = promisify require 'copyfiles'

replace = require 'replace-in-file'

zip = require 'lodash.zip'

pkg = require 'read-pkg'





files = [
    'source/index.html'

].concat 'dist'


dependencies = do ->

    { dependencies: dep, devDependencies: devDep } = do pkg.sync

    for name, version of Object.assign dep, devDep
        [
            /// (\.\./node_modules/ #{ name }) / ///
            "$1@#{ version.match /\d.*/ }/"
        ]


[from, to] = zip [
    dependencies...

    [/// \./dist ///g, '']
    [/// \.\./node_modules/ ///g, 'https://unpkg.com/']
    [/// @time@ ///g, Date.now()]
]...


do coroutine ->

    yield copyfiles files, 1

    yield replace {
        from: from
        to: to
        allowEmptyPaths: true
        files: [
            'dist/index.html'
        ]
    }
