(function (window) {
'use strict';

// in window ? window['default'] : window;
// in $ ? $['default'] : $;

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

function bootWith(dependencies) {
    var setTimeout = window.setTimeout;
    var config = {
        frequency: 0x42,
        iteration: 0xFF,
    };
    var start = Date.now();
    return new Promise(function (resolve, reject) {
        var loop = function () {
            var lapsed = Date.now() - start;
            if (dependencies().every(Boolean) === true) {
                return resolve(lapsed);
            }
            if (config.iteration-- < 1) {
                return reject(lapsed);
            }
            setTimeout(loop, config.frequency);
        };
        loop();
    });
}
var ajax = new (function () {
    function class_1() {
        var _this = this;
        this.get = function (url) {
            var auth = (function (cookie) {
                var access_token = (cookie.match(/(github_access_token=)([a-z0-9]{30,})/) || ['']).pop();
                if (access_token) {
                    return {
                        Authorization: "token " + access_token,
                    };
                }
                return {};
            }(window.document.cookie));
            return _this.ajax
                .get(url, __assign({}, auth));
        };
    }
    Object.defineProperty(class_1.prototype, "ajax", {
        get: function () {
            return Rx.Observable.ajax;
        },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());


function compare(foo, bar) {
    if (foo === bar)
        return 0;
    return foo > bar ? 1 : -1;
}

var DataPresent = (function () {
    function DataPresent($node) {
        this.$node = $node;
        this.$sheet = this.$node.find('[sheet]');
        this.$commitEntry = this.$sheet.find('[commit-entry]').detach();
        this.$repoEntry = this.$sheet.find('[entry]').detach();
        this.$node.removeClass('hidden');
        this.load(this.$node.data('load'));
    }
    DataPresent.prototype.load = function (url) {
        var _this = this;
        if (url === void 0) { url = ''; }
        Rx.Observable.ajax(url)
            .flatMap(function (net) { return net.response; })
            .subscribe(function (_a) {
            var repo = _a.repo, commits = _a.commits;
            return _this.append(repo, commits);
        });
    };
    DataPresent.prototype.append = function (repo, commits) {
        var _this = this;
        this.updateCounter(~~!!repo, commits.length);
        var $tmpl = this.$repoEntry.clone();
        {
            var _a = [
                repo.full_name.replace("/" + repo.name, ''),
                repo.name,
            ], author = _a[0], project = _a[1];
            var $repo = $tmpl.find('[repo]');
            $repo
                .find('[names]').attr('href', repo.html_url).end()
                .find('[author]').text(author).end()
                .find('[project]').text(project).end()
                .find('[description]').text(repo.description).end()
                .find('[language]').text(repo.language).end()
                .find('[star]').text(repo.stargazers_count.toLocaleString()).end()
                .find('[fork]').text(repo.forks_count.toLocaleString()).end();
        }
        {
            $tmpl.find('[commits]').append(commits
                .sort(function (foo, bar) {
                return compare(foo.date.valueOf(), bar.date.valueOf());
            })
                .reverse()
                .map(function (commit, index) {
                var $commit = _this.$commitEntry.clone();
                $commit
                    .find('[title]').text(commit.title).end()
                    .find('[date]').text(new Date(commit.date).toDateString()).end()
                    .find('[sha]').text(commit.sha.slice(0, 7)).end()
                    .find('[link]').attr('href', commit.html_url).end()
                    .find('[avatar] [author]').attr('src', commit.author.avatar_url + "&s=72").end();
                var $committer = $commit.find('[avatar] [committer]');
                if (commit.author.id === commit.committer.id) {
                    $committer.remove();
                }
                else {
                    $committer.attr('src', commit.committer.avatar_url + "&s=32");
                }
                return $commit;
            }));
        }
        this.$sheet.append($tmpl);
    };
    DataPresent.prototype.updateCounter = function (repos, commits) {
        if (repos === void 0) { repos = 0; }
        if (commits === void 0) { commits = 0; }
        this.$node
            .find('[header-bar] [repos]')
            .text(function (index, text) { return "" + (~~text + repos); });
        this.$node
            .find('[header-bar] [commits]')
            .text(function (index, text) { return "" + (~~text + commits); });
    };
    return DataPresent;
}());

function main() {
    new DataPresent($('#data-present'));
}
bootWith(function () { return [window.Rx, window.jQuery]; })
    .then(function (lapsed) {
    $(main);
})
    .catch(function (lapsed) {
    console.error("[failed after " + lapsed + "ms]");
});

}(window,null,null));
