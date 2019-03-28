# chrono

![chrono version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

chrono enhances Firefox's history capabilties with browsing history stats, improved searching and additional features. More details can be found [here](https://sereneblue.github.io/chrono).

## Installation

chrono is available on [AMO](https://addons.mozilla.org/firefox/addon/chrono-ext) or visit the link above.

## Features

#### Stats

View browsing history stats over several time ranges: 1 year and 1/3/6 month(s)

#### Visualized

Visualize browser history by month and clear history by date range

#### Search

chrono extends Firefox's search capabilities with a couple of operators to filter by date range and remove search results. Results can also be grouped by domain.

#### Themes

chrono has 19 color themes and a dark/light mode. Made possible with [Vuetify](https://github.com/vuetifyjs/vuetify).

## Contribute

Feel free to submit a pull request or create an issue (**for bugs only**).

## Credits

chrono icon made by [Smashicons](https://www.flaticon.com/authors/smashicons) from [www.flaticon.com](https://www.flaticon.com/) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/")

## Disclaimer

chrono suffers from some performance issues if you have a lot of browsing history, just give it some time. I believe this is due to the design of the [history](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/history) WebExtensions API and the getVisits/search functions.