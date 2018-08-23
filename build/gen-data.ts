
import * as file from 'fs';

import * as Rx from 'rxjs';
import { noop } from 'rxjs/util/noop';

import fetch from 'node-fetch';

import { GitHub } from '../source/script/github';

import { identity, setState } from '../source/script/helper';


const {
    npm_package_config_github_login: login,
    npm_package_config_github_token: token,

} = process.env;


load(login, token).toArray().subscribe(data => {
    file.writeFile('./dist/data.json', JSON.stringify(data), noop);
});


function load (user = '', token = '') {

    let headers = {};

    if (/^[a-z0-9]{16,}$/i.test(token)) {
        headers['Authorization'] = `token ${ token }`;
    }

    const getJSON = function <T> (url = '') {
        return fetch(url, {
            headers: {
                ...headers,
            }
        }).then(res => res.json<T>());
    };

    const urls = {
        repos: `https://api.github.com/users/${ user }/repos?per_page=100`,
    };

    const repos$ = Rx.Observable
        .of(urls.repos)
        .flatMap(url => getJSON<GitHub.Repos>(url))
        .flatMap(identity)
        .filter(item => item.fork === true)
        .pluck('url')
        .flatMap((url: string) => getJSON<{parent: GitHub.Repo}>(url))
        .map(data => data.parent)
        .map(repo => {
            const pseudo = <GitHub.RepoOrg>{
                url: '',
                description: '',
                language: '',
                fork: true,
                forks_count: 0,
                stargazers_count: 0,
                full_name: '',
                html_url: '',
                name: '',
            };

            return setState(pseudo, repo);
        })
        .multicast(new Rx.ReplaySubject<GitHub.Repo>(Number.MAX_VALUE))
        .refCount()
    ;

    const commits$ = repos$
        .pluck('url')
        .map(url => `${ url }/commits?author=${ user }`)
        .toArray()
        .flatMap(list =>
            Rx.Observable.forkJoin(
                list.map(url => getJSON<GitHub.Commits>(url))
            )
        )
        .flatMap(identity)
        .map(data => [].concat(data).map(GitHub.parseCommit))
    ;

    return Rx.Observable.zip(repos$, commits$)
        .filter(([repo, commits]) => commits.length > 0)
        .map(([repo, commits]) => ({repo, commits}))
    ;
}

