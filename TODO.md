# TODO

Here is tracked what needs to be done / or cloud be done in the future.


## Tasks

* conceptualize data loading
	* graceful error handling (meaningful error messages)
	* offline (remote, local, combined)
	* stale data, non-matching version
	* background synchronization (using a separate worker)

* Service Worker: fallback to index.html for non-root URLs (by router)

* search feature

* allow users to better manage the offline content (downloaded packages)
	* currently: When the package is opened, it is downloaded and cached. All local data can be deleted.

* login / user account
	* syncing progress across user's devices
	* allow content creation / editing

* branding
	* better name? + domain name
	* logo, a provisional one is [here](./app/images/app-icon)

* improve routing
	* typed routes (use generics)
	* route state

* examine sticky focus behavior, especially on mobile devices

* show success rate by each question on CategoryPage

* randomize choices order during practice


## Issues to watch

* https://github.com/webpack/webpack/issues/11660
