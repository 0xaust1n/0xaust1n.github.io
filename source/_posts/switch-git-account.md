---
title: Multi-GitHub accounts through terminal
date: 2022-07-27 10:43:40
categories:
  - [Tech, Git]
---

# Intro
Cause my company requires all the employees to use the company's Github account.  
But sometimes I still need to use my personal account for different projects.  
And I'm too lazy to set the git local setting for all the repo.  
It's kinda annoying that you need to set the config whenever you create a new repo or project.  
So, Let's fix it,  
And Keep you lazy.


# Prepare
- [Github CLI](https://cli.github.com/)
- Any Text Editor 
- Nice terminal


# Configuration
After Installing all the required tools.  
Pop up your terminal, change the directory to your root (macOS/Linux)  

> If you're windows user, please google where is your root git-config sit at.  

There's a hidden file name `.gitconfig`  
( If not you need to create an empty file named `.gitconfig`)  
And replace its content by following below.

> If you got more than 2 accounts,you can add the `includeIf` as more as you want.  

```config
[includeIf "gitdir:<your-personal-directory-path>"]
  path = ~/.gitconfig.personal
[includeIf "gitdir:<your-working-directory-path>"]
  path = ~/.gitconfig.work

```
Example:  
```
[includeIf "gitdir:~/Documents/Aust1n/"]
  path = ~/.gitconfig.personal
```
All my repo are sitting inside the `Aust1n` folder.  
So that all the repo will use the setting inside the `.gitconfig.personal` .  
`includeIf` is like an if-function for the config.

Then you need to create a new file named `.gitconfig.personal` .

> You can naming the config file with any suffix  

The content looks like below  
```.gitconfig.personal
[user]
	name = <your-github-id>
	email = <your-github-mail>
```

After finishing all the config.  
Your `.gitconfig` will follow by your working directory.  


# Authentication
If you want to push your code, you still need the authentication for Github.  
Here comes the Github-CLI.  
Pop up your terminal Again, and change the directory to your `root/.config/gh`  

> If you're windows user, please google where is your github-cli config sit at.  

(If not you create a folder file named `gh`)  
Then you need to touch (create) four files in gh directory.  
(If files exist, you should modify the content)
```bash
touch config.yml
touch hosts.yml
touch hosts.yml.personal
touch hosts.yml.work
```

Put the below content into the `config.yml`
```config.yml
# What protocol to use when performing git operations. Supported values: ssh, https
git_protocol: ssh
aliases:
  personal: "!cp ~/.config/gh/hosts.yml.personal ~/.config/gh/hosts.yml && gh auth status"
  work: "!cp ~/.config/gh/hosts.yml.work ~/.config/gh/hosts.yml && gh auth status"
```

Put the below content into the `host.yml.<suffix>` with suffix.  
Each suffix stands for a different account.  
[Docs for GitHub personal token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

> Remeber check **all** the checkbox when you creating the Github personal token  

```host.yml.personal
github.com:
    oauth_token: <github-peronsal-token>
    git_protocol: ssh
    user: <your-github-username>
```
> Please remind there's a space after colon  
> Otherwise it won't work  


Then you can switch the account by using the command below:  

```bash
gh personal
```
If the terminal shows the below info:  

>github.com  
>  ✓ Logged in to github.com as 0xaust1n (oauth_token)  
>  ✓ Git operations for github.com configured to use ssh protocol.  
>  ✓ Token: *******************  
> 
Then set up the GitHub-CLI for authentication by using the command below:  

```bash
gh auth setup-git
```

Now it's work. Enjoy