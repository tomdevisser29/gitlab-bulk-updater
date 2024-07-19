# gitlab-bulk-updater

## Instructions

### Create a personal access token on GitLab

1. Visit GitLab
2. On the left sidebar, select your avatar
3. Select Edit profile
4. On the left sidebar, select Access Tokens
5. Select Add new token
6. Enter a name and expiry date, if you don't enter an expiry date, it's automatically set to 365 days
7. Set the scope to api
8. Select Create personal access token
9. Save your token in the .env file as GITLAB_PERSONAL_ACCESS_TOKEN
