
import { GitHub } from './github';

import { compare } from './helper';



export default class DataPresent {

    constructor (private $node: JQuery) {

        this.$node.removeClass('hidden');

        this.load(this.$node.data('load'));
    }


    private $sheet = this.$node.find('[sheet]');
    private $commitEntry = this.$sheet.find('[commit-entry]').detach();
    private $repoEntry = this.$sheet.find('[entry]').detach();


    private load (url = '') {

        type Item = {
            repo: GitHub.Repo,
            commits: GitHub.Commits
        };

        fetch(url)
            .then(data => data.json() as Promise<Item[]>)
            .then(list => {
                list.forEach(({repo, commits}) => this.append(repo, commits));
            })
        ;
    }

    private append (repo: GitHub.Repo, commits: GitHub.Commits) {

        this.updateCounter(~~!!repo, commits.length);

        const $tmpl = this.$repoEntry.clone();

        {  // repo
            const [author, project] = [
                repo.full_name.replace(`/${ repo.name }`, ''),
                repo.name,
            ];

            const $repo = $tmpl.find('[repo]');

            $repo
                .find('[names]').attr('href', repo.html_url).end()
                .find('[author]').text(author).end()
                .find('[project]').text(project).end()
                .find('[description]').text(repo.description).end()
                .find('[language]').text(repo.language).end()
                .find('[star]').text(repo.stargazers_count.toLocaleString()).end()
                .find('[fork]').text(repo.forks_count.toLocaleString()).end()
            ;
        }

        {  // commits
            $tmpl.find('[commits]').append(commits
                .sort((foo, bar) =>
                    compare(foo.date.valueOf(), bar.date.valueOf())
                )
                .reverse()
                .map((commit, index) => {
                    const $commit = this.$commitEntry.clone();

                    $commit
                        .find('[title]').text(commit.title).end()
                        .find('[date]').text(new Date(commit.date).toDateString()).end()
                        .find('[sha]').text(commit.sha.slice(0, 7)).end()
                        .find('[link]').attr('href', commit.html_url).end()
                        .find('[avatar] [author]').attr('src', `${ commit.author.avatar_url }&s=72`).end()
                    ;

                    const $committer = $commit.find('[avatar] [committer]');

                    if (commit.author.id === commit.committer.id) {
                        $committer.remove();
                    } else {
                        $committer.attr('src', `${ commit.committer.avatar_url }&s=32`);
                    }

                    return $commit;
                })
            );
        }

        this.$sheet.append($tmpl);
    }

    private updateCounter (repos = 0, commits = 0) {

        this.$node
            .find('[header-bar] [repos]')
            .text((index, text) => `${ ~~text + repos }`)
        ;

        this.$node
            .find('[header-bar] [commits]')
            .text((index, text) => `${ ~~text + commits }`)
        ;
    }
}

