import { sendApi } from '../api/api.js';
const GET = 'GET';

const GITHUB_API = 'https://api.github.com';

export function fetchReleaseNotes(owner, repo) {
    return sendApi({
        method: GET,
        url: `${GITHUB_API}/repos/${owner}/${repo}/releases`,
    });
}

export function fetchRepositories(query) {
    return sendApi({
        method: GET,
        url: `${GITHUB_API}/search/repositories?q=${query}&sort=&order=desc`,
    });
}
