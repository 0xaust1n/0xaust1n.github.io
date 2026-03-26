---
title: Multi-Github accounts through terminal in 2026
date: 2026-03-26 15:30:00
lang: en
description: "How I handle personal and work GitHub accounts in 2026 with git includeIf and GitHub CLI"
keywords: GitHub CLI, git config, includeIf, multiple accounts, HTTPS
categories:
  - [Tech, Git]
---

## Intro

I already got an older post for this topic.  
That one still works, but config in old method consumed lot's of time.  
So I make a new one instead. By using latest gh-cli feature.  

>**Main idea still same:**  
> **- let Git switch commit identity by folder**  
> **- let GitHub CLI handle GitHub login state**  

So Let's go.

<!-- more -->

## What changed from the old version 
>Skip this section , If you didn't watch old post before

The old way I used before:
- manual create`hosts.yml` and multiple `hosts.yml.*`
- using the terminal command to copy file around when switching account
  
What changes? 
- use `gh auth login`
- no need to config ton of `hosts.yml`
- no need to create a personal token of each github account
- use `gh auth switch` to switch account

## Git identity vs GitHub auth

This part is important.  
People mix this up all the time.  

`user.name` and `user.email`  
is your commit identity.  

`gh auth login` / `gh auth switch`  
is your GitHub account login state.  

These are not same thing.  
 
If commit email is wrong,  
go check `.gitconfig`

If `gh` command is using wrong account,  
go check:  

```bash
gh auth status
```

Now you know, ezpz.  

## Step by step setup

First, decide your folder layout.

I use something like this:
- `~/Projects/personal/`
- `~/Projects/work/`

Then I let Git load different config by folder.

```text
~/Projects/
├── personal/
│   ├── blog/
│   ├── dotfiles/
│   └── random-side-project/
└── work/
    ├── internal-api/
    ├── dashboard/
    └── infra-scripts/
```

## Example `.gitconfig`

Put this in `~/.gitconfig`

```ini
[includeIf "gitdir:~/Projects/personal/"]
  path = ~/.gitconfig.personal

[includeIf "gitdir:~/Projects/work/"]
  path = ~/.gitconfig.work

[pull]
  rebase = true

[init]
  defaultBranch = main
```

`~/.gitconfig` is just the router.  
The actual identity still lives in the per-account files.

## Example `~/.gitconfig.personal`

```ini
[user]
  name = Austin
  email = austin.personal@example.com
```


## Example `~/.gitconfig.work`

```ini
[user]
  name = Austin
  email = austin@company.com
```



## GitHub CLI multi-account setup
If you want to push your code, you still need the authentication for Github.  
Here comes the Github-CLI.  

```bash
gh auth login
```

Do it again for N-1 times if you got another account:

```bash
gh auth login
```
Usually it opens abrowser login.  
Remember to Copy the code from the terminal,
I was confuse at first, When I saw the github website require me input some code..

Check current active account:

```bash
gh auth status
```

Switch account interactively:

```bash
gh auth switch
```

Switch directly to work account:

```bash
gh auth switch --hostname github.com --user your-work-handle
```

Switch directly to personal account:

```bash
gh auth switch --hostname github.com --user your-personal-handle
```

If you was to lazy, set alias for your terminal
put this into  `~/.zshrc` , then restart the terminal
```bash
# github cli 
alias gas="gh auth switch"
```

## How to verify it works

Check personal repo:

```bash
cd ~/Projects/personal/blog
git config user.name
git config user.email
git config --show-origin user.email
```

Check work repo:

```bash
cd ~/Projects/work/internal-api
git config user.name
git config user.email
git config --show-origin user.email
```

Check current GitHub CLI account:

```bash
gh auth status
```


## TL;DR

Suggested title: `Multi-Github accounts in 2026`

```ini
# ~/.gitconfig
[includeIf "gitdir:~/Projects/personal/"]
  path = ~/.gitconfig.personal

[includeIf "gitdir:~/Projects/work/"]
  path = ~/.gitconfig.work
```

```ini
# ~/.gitconfig.personal
[user]
  name = Austin
  email = austin@gmail.com
```

```ini
# ~/.gitconfig.work
[user]
  name = Austin
  email = austin@company.com
```

```bash
gh auth login
gh auth status
gh auth switch
```
