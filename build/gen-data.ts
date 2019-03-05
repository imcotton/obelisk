
import * as file from 'fs';

import { of, noop, ReplaySubject, forkJoin, zip } from 'rxjs';
import { flatMap, map, pluck, filter, multicast, refCount, toArray } from 'rxjs/operators';

import fetch from 'node-fetch';

import { GitHub } from '../source/script/github';

import { identity, pick } from '../source/script/helper';


const {
    npm_package_config_github_login: login,
    npm_package_config_github_token: token,

} = process.env;


load(login, token).pipe(toArray()).subscribe(data => {
    file.writeFile('./dist/data.json', JSON.stringify(data), noop);
});


function load (user = '', token = '') {

    let headers = {};

    if (/^[a-z0-9]{16,}$/i.test(token)) {
        headers['Authorization'] = `token ${ token }`;
    }

    const getJSON = async function <T> (url = '') {
        const res = await fetch(url, {
            headers: {
                ...headers,
            }
        });
        return await res.json() as T;
    };

    const urls = {
        repos: `https://api.github.com/users/${ user }/repos?per_page=100`,
    };

    const repos$ = of(urls.repos).pipe(
        flatMap(url => getJSON<GitHub.Repos>(url)),
        flatMap(identity),
        filter(item => item.fork === true),
        pluck('url'),
        flatMap((url: string) => getJSON<{parent: GitHub.Repo}>(url)),
        map(data => data.parent),
        map(repo => {
            return pick(repo, 'url', 'description', 'language', 'fork', 'forks_count', 'stargazers_count', 'full_name', 'html_url', 'name');
        }),
        multicast(new ReplaySubject<GitHub.Repo>(Number.MAX_VALUE)),
        refCount(),
    );

    const commits$ = repos$.pipe(
        pluck('url'),
        map(url => `${ url }/commits?author=${ user }`),
        toArray(),
        flatMap(list =>
            forkJoin(list.map(url => getJSON<GitHub.Commits>(url)))
        ),
        flatMap(identity),
        map(data => [].concat(data).map(GitHub.parseCommit)),
    );

    return zip(repos$, commits$).pipe(
        filter(([repo, commits]) => commits.length > 0),
        map(([repo, commits]) => ({repo, commits})),
    );
}

