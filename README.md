# magnificent-sloth
Point of Sale for Dead Mongoose

### How to install

#### Prerequisites
To install the package locally, you first have to install `nvm`. Instructions can be found [here](https://github.com/nvm-sh/nvm#installing-and-updating)
Make sure you install at least the latest LTS release.

#### Install locally
1. Clone the repo to a directory of your choice.
1. Enter the directory: `cd /path/to/your/directory`.
1. Run `npm i`. This will use nvm that you've installed before.
1. Copy over `sample.env` and name it `.env`. 
1. To update the values in `.env`, simply enter the file using your favorite editor, e.g. `nano .env`.
1. Start the application with `npm start`.

#### Update semantic-ui
If changes are made to files in the semantic folder, these changes will become active only after you run the following command:
`npm run build-semantic`.