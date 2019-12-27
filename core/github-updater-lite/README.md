# GitHub Updater (Lite)
Enable automatic updates for your GitHub-hosted WordPress plugins.

A fork of @gibbs189's [variant](https://github.com/FacetWP/github-updater-lite) of Andy Fragen's excellent [GitHub Updater](https://github.com/afragen/github-updater) plugin. If you need all the bells and whistles (BitBucket, private repositories, etc), please use Andy's plugin!

This fork fetches updates from GitHub's Releases. See below.

## Usage

Add the following line to your plugin's meta information, replacing `owner/repo` with your public repository.

```
GitHub URI: owner/repo
```

Then, add `github-updater.php` to your plugin folder, and `include()` it from within your main plugin file.

```php
include( dirname( __FILE__ ) . '/github-updater.php' );
```

The code fetches release binaries on the GitHub repo to determine whether updates are available. For this to work, the binary filename must match the plugin directory and release tag names like this.

```
Release tag name: 0.1.0
Plugin directory name: sample-plugin
Release binary filename: sample-plugin-0.1.0.zip
```

That's it, have fun!
