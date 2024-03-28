---
title: Version control
uuid: 269b8452-da0b-11ee-9a0e-ca8ae82b63ae
version: 5
created: '2024-03-04T09:37:50Z'
tags:
  - programming
  - imported/markdown
  - versioncontrol
---

# Version control

Version control is central to every programming project. It controls how your code is saved, shared and potentially rolled back. Besides using version control there are a couple of best practises which are very important, but first lets get into the basics of what version control is.

# The idea

The way git stores versioning is very interesting. It does not save a new copy of a file when you create a new version, it just saves the changes made to each file. This makes the size of your version control very small. Only when you delete a lot of files from your version control this is maintained. Also if you create a different branch it will only save the changes made on this branch and not copy the changes from the origin branch. Every commit, which is a version of changes, has a commit id to keep track which change is which.

# Repository

A repository is a project within Git (the most used and only one that I will refer to) which has managed versioning. To initialise a project use

```bash
git init -y
```

This will create a project for you, you can also initialise a project by **cloning** a repository which is the way I mostly start a project. My preferred place to store my repositories is on `Github` where you can clone your project from by using the following command

```bash
git clone https://github.com/thebetar/<project-name> <project-folder>
```

This is of course assuming you have already authenticated with your computer. If not you need to create an access token where I would recommend only adding the minimum amount of access that is needed and putting an expiration date on it. Then before trying to connect to your remote execute

```bash
git config credential.helper store
```

This will save your credentials for the next time you try to pull changes.

# Commits

Commits are an integral part of Git. A commit adds the latest changes to your Git History. It is good practise to keeps these commits atomic. Like for every single independent change like changing some code, A COMMIT, writing your tests, A COMMIT, refactoring the code, A COMMIT.

Also the commit messages are very important, this is also talked about in the [Linting](Linting,%20formatting%20and%20auditing.md) page. It is important that if something all of a sudden seems broken you can easily find which commit you changed code in the place that errors are occurring and you can easily debug or rollback the changes.

To see what changes are currently present in your local filesystem and the HEAD (latest) commit `git status` can be used.

To create a commit you have to start by staging some changes, most of the time this is done like this

```bash
git add .
```

While you can also try and add some specific changes like this

```bash
git add client/src/data
```

After this you can start making a commit by commit these changes with a message

```bash
git commit -m "feat: new feature added to home page"
```

To also write a body for your commit you can add another `-m` like this

```jsx
git commit -m "feat: new feature added to home page" \
-m "Added new card to homepage where a user can enter their details and be set on a mailing list"
```

The commit messages should be structured based on the conventions described in the [conventional commits](Conventional%20commits.md) page.

## Amend

Sometimes you forget a simple change in a commit or you see that some tests are still failing which you thought were fixed in your last commit. For this the `--amend` argument can be used to add the changes to the latest commit (or actually reverting that commit and replacing it with a new commit that has the changes from that commit and your new changes).

## Restore

When working on a commit but you can’t seem to make it work and have broken some logic and want to start over you can use `git restore <path>` to restore a selected file or path to the HEAD (latest) commit. Keep in mind this only removes changes from files that existed in the previous commit.

When using restore the `--patch` or `-p` argument can be used to stop at every file that will be restored and ask if this specific file should be restored or not. This is nice when you do not want to restore everything just a select few files.

## Clean

When newly created files need to be deleted the `git clean` command can be used. This does not impact files that existed in the previous commit and were changed.

When using `git clean` one of three arguments has to be provided

- `-n` to show which files would be removed but not remove it

- `-i` to interactively remove fiels

- `-f` to recursively remove all files from the given path

## Reset

To go back a commit git reset can be used. `git reset --hard` can be used to hard reset to the latest HEAD commit on the remote repository. But you can also use this to revert the last commit by using `git reset --soft HEAD\~1` to go back one commit and `git reset --soft HEAD\~2` for two, etc. With the `--soft` argument the files that were changed in the last commit will be added as staged changes. When the files should also be revert use `git reset --hard HEAD\~1`

## Log

The log command can be used to view a list of commits and their description and ID. This comes in handy when a specific commit has to be targeted for another command.

### Range

The log command can also be used to view a specific amount of commands this can be done by using a range for instance

```bash
git log HEAD~4..HEAD
```

### O**neline**

A good argument to add behind `git log` is the `--oneline` command this makes every commit take up one line so it is easier to find a commit id

```bash
git log --oneline
```

### **Pager**

A good option for using the `git log` is disabling the pager which is done by using the following command

```bash
git config --global pager.log false
```

If you do not want to change this setting this can also be done with

```bash
git --no-pager log
```

### Reverse

When using pager or just when scrolling through the logs with a pager it might be necessary to reverse the results, this can be done with `--reverse`. This looks something like this

```bash
git log --reverse
```

### Examples

When all these commands are combined this becomes very powerful in seeing log outputs here are some examples

```bash
## To show all commits from oldest to newest in the terminal
git --no-pager log --reverse --oneline

## To show the last 5 commits from newest to oldest in the terminal
git --no-pager log --oneline HEAD~5..HEAD

## To show the last 5 commits in the default editor
git log HEAD~5..HEAD
```

## Show

To see what changes were made in a single commit `git show <commit-id>` can be used.

## Blame

Blame can be used to see which line was lastly edited by whom and in which commit. This can be done by using `git blame <path>`

## Diff

The diff command can be used to show changes between two points using their commit IDs, tags or branch names this looks like this

`git diff <name> <second-name>`

## Revert

Reverting a single commit can be done by using the `git revert <commit-id>` this is a good way to revert a single commit that might have caused a bug

## Stash

If reverting previous commits isn’t enough the `git revert <commit-id>` can be used to revert a commit from anywhere in the history.

Git alsl allows the user to put the changes made into the `stash entry`. This is useful when making changes that should not be commited yet but should be stashed somewhere to be used later. This is done by using

```bash
git stash
```

This will push all the changes into the list of stash entries and reset the working directory to the HEAD commit. After this the list can be inspected by using

```bash
git stash list
```

this wil show a list of all stash entries. After this a specific stash can be observed by using

```bash
git stash show <stash-name>
```

After making sure the right name corresponds to the changes `git stash apply` can be used. When using this without a name the latest entry is used from the stash.

# Branches

When starting a project most of the time you work on the `develop` branch which is common name used for the branch to test changes on and then every new version you want to release move these changes to the `master` (sometimes `main`) branch. When working with more people or when you want to try to add something breaking which you are still not sure about you can also add another branch. This can be done with the following command

```bash
git checkout -b branch-name
```

For creating new branches there are also some best practises on naming these branches so the above command is not very good lets improve it

```bash
git checkout -b feature/new-feature-branch-name
```

These conventions are the following

- `feature/\*` is for adding, refactoring or removing a feature

- `bugfix/\*` is for fixing a bug

- `hotfix/\*` is for changing code with a temporary solution and/or without following the usual process (usually because of an emergency)

- `test/\*` is for experimenting outside of an issue/ticket

These branches are aside from the common branches which are

- `develop` common branch for developing (when working with more than one person always commit with pull requests and do not directly push to this branch)

- `master` common branch for releases, this branch is also targeted by the pipeline to run some deployment

- `prerelease` sometimes you want a branch which triggers a pipeline but does not release your changes to production yet, for instance if you want to test on a test environment first

## Merging

Within branches you have something called merging, this is when you merge two branches into one, for instance if you want to merge the changes you have made into the master branch while still being on the develop branch you will first navigate to the master branch using `git checkout` and then using `git merge develop` like this

```bash
git checkout master && git merge develop
```

### **Rebase**

Develop is not the preferred however and is mostly used if the divergence has become very big since it merged everything in one big commit, I prefer using `git rebase` which does all the commits from the targeted branch on your current branch separately, this makes it so your commits are not squashed to one single commit. The above code can be used with rebase like this

```bash
git checkout master && git rebase develop
```

**Interactive rebase**

Aside from rebasing on another branch there also exists something called **interactive rebasing** which is used to rewrite the git history of a branch. This is very useful for combining commits, improving commit messages or editing a mistake made in a commit. This can be done by using the `-i` parameter with rebase and then referring to a specific amount of commits back by using `HEAD\~4` to go back 4 commits this looks something like this

```bash
git rebase -i HEAD~4
```

After running this something that looks like this will show up

```bash
pick 5bd0423 chore: updated uppercase and added method naming
pick 324f670 chore: added naming constant in error message
pick d5a02a0 chore: added class naming eslint rule
pick 4f7b7a0 chore: removed unused eslint config property
```

With some extra instructions below it. To pick and action replace the word before the commit with the action that needs to be performed on the commit and close the editor. **keep in mind that with interactive rebase it lists oldest to newest this is the reverse of gitlog**.

The possible options when using interactive rebase are:

- **pick** for using this commit without changing it

- **reword** for using a commit but also changing the commit message

- **edit** for stopping at a commit so changes can be made using `--amend` before continuing on with `git rebase --continue`

- **squash** to squash a commit into the previous commit and write a new commit message

- **fixup** to squash a commit into the previous commit without a new message (so using the old one)

- **drop** to drop a commit

When editing a commit while using interactive rebase the changes should be amended to the commit that is being edited using `git commit --amend`

### **Squashing**

When merging the strategy can also be used to squash. This means that all the changes that were done on the working branch are all squashed into a single commit and that commit is added to the target branch. This can be done by using the `--squash` when merging like this.

```bash
git merge develop --squash
```

## Cherry picking

It happens sometimes that a commit is made on the wrong branch or a single commit has to be picked from a branch. For this cherry picking is used. If a commit exists on a branch that needs to be copied to another branch the commit ID can be used with the command `git cherry-pick <commit-id>`. Keep in mind that this will copy the commit and not remove it from the origin, to do this the commit needs to be reverted or if it is a commit on head it can be reset by using `git reset --hard HEAD\~1`

## Remote repositories

When creating branches and making commits at some point you want to store this in your remote repository. This can be added by using the `git remote add <name> <url>` command. The most commonly used name and the default within git is `origin`. After settings this up with the command

```bash
git remote add origin https://github.com/thebetar/GitInstructions
```

You can start pushing changes from your local repository to your remote repository. Keep in mind that `git push` will only push the commits of your local repository. This also works the other way around when using `git pull` to get commits from the remote repository. This is useful when working with multiple people on a branch or when using a different system to work on your repository.

When starting a project where a remote repository already exists the `git clone` command can be used to make a copy of the remote repository on your local system. This also adds the repository that is cloned from as a remote repository with the name `origin`.

## Worktree

In git worktrees can also be used to work on multiple branches concurrently. To use this a repository needs to be clone using the `--bare` argument. This doesn’t clone the contents of the repository into a directory but will copy the contents of the `.git` file into the directory. After this is done the directory can be entered and then using `git workflow add <branch>` a new directory can be created where the branch of this repository lives.

## GC

`git gc` can be used to clean up unnecessary files.

# Some common commands

Other commands that are used often are

- `git checkout branch` to move between branches

- `git pull` pull changes from remote branch

- `git push` push changes to remote branch

- `git branch -D branch` to remove a branch from local

- `git push origin -d branch` to remove a branch from remote

- `git push --set-upstream origin branch` to push to a remote and add the upstream as a branch

- `git status` to see what changes there are compared to your branch

- `git diff origin/branch` to see what changes are on your local branch compared to the remote branch

- `git fetch -a` to get all the changes to branches from remote

- `git revert` or `git revert commitId` to revert a commit

# Github

Github is an online platform to share your code and collaborate using remote repositories. In this page I have already talked about cloning a repository from Github, but where the real power comes in is the collaboration this enables. You can create a branch for some changes you discussed you would make, make the changes and create some commits, push it to the remote branch you create (something like `feature/new-feature-branch`) and then create a pull request. A pull request is basically a request to merge your changes to the `develop` branch and ask the other developers to review your code and approve it to merge.

Source: [https://git-scm.com/](https://git-scm.com/) 

Source: [https://github.com/](https://github.com/) 