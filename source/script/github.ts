
import { setState } from './helper';



export namespace GitHub {

    export type Repo = Readonly<RepoOrg>
    export type Repos = Repo[]

    export interface RepoOrg {

        url: string

        fork: boolean
        language: string

        name: string
        full_name: string

        html_url: string
        description: string

        stargazers_count: number
        forks_count: number
    }


    export type Commit = Readonly<CommitOrg>
    export type Commits = Commit[]

    export interface CommitOrg {

        sha: string
        html_url: string

        title: string

        author: User
        committer: User

        date: Date
    }


    export type User = Readonly<UserOrg>

    interface UserOrg {

        id: number
        login: string
        avatar_url: string
        fullname: string
    }

    export function parseCommit (raw: {[key: string]: any}) {

        interface Info {

            message: string

            author: {
                name: string
                date: string
            }
            committer: {
                name: string
                date: string
            }
        }

        const pickUser = (name: 'author' | 'committer', info: Info) => {
            const pesudo = <UserOrg>{
                id: 0,
                login: '',
                fullname: '',
                avatar_url: '',
            };

            let user = raw[name] as UserOrg;
                user.fullname = info[name].name;

            return setState(pesudo, user);
        };

        const info = raw['commit'] as Info;

        const author = pickUser('author', info);
        const committer = pickUser('committer', info);

        let commit = <CommitOrg>{};
            commit.title = info.message;
            commit.sha = raw['sha'];
            commit.html_url = raw['html_url'];
            commit.date = new Date(info.author.date);

        return {author, committer, ...commit} as Commit;
    }
}

