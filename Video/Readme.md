# Video Modules
This folder is meant for the building of video modules on Chouten. The process of making each module is relatively intuitive. To start, copy the `/Template` folder and rename it to the name of the provider you are making the module for. For example, `9anime` for [9anime](https://9anime.pl).

## Structure
The structure of each module should have the following files:
```
├── src
│   └── Home
│       └── code.ts
│   └── Info
│       └── code.ts
│   └── Media
│       └── code.ts
│   └── Search
│       └── code.ts
│   ├── metadata.json
│   └── icon.png
├── test
│   ├── commonCode.ts
│   └── index.ts
├── .eslintignore
├── .eslintrc
├── .prettierignore
├── .prettierrc.json
├── Makefile
├── package.json
├── tsconfig.json
├── types.d.ts
```

### Home
The `/src` directory is where you will be doing most of the coding. The `/src/Home` directory is where users will see the home page displayed. For example, if there is trending shows or recent episodes that have aired, the data should be displayed via the home page. 

### Info
The `/src/Info` directory contains the info page for each piece of media. The main `logic()` function is relatively intuitive, but note that there is also a `getEpList()` function for fetching episodes since the info directory also contains the logic for fetching episodes/seasons. If your provider is one that fetches episodes for multiple providers (eg. the Anify module), then seasons can be replaced by providers. If you don't know what that means, it likely doesn't apply for that provider.

### Media
For fetching sources and additional logic for parsing source files, the `/src/Media` directory handles that. Some providers may contain skip times for intros and outros as well as subtitles, so all that logic is handled in that directory.

### Search
Searching is all handled in the `/src/Search` directory for displaying results for a specific query. At the moment, advanced searching is not supported but likely will in the future. For now, just worry about handling searching by name or title.

### Metadata
The `metadata.json` file is for all information on what the module is about. Please note that the **name of the module cannot have spaces** and must be file friendly. For example, unicode characters won't work. The `metadata.json` file looks something like this:
```json
{
  "id": "anythingcangohere",
  "type": "Video",
  "moduleType": "source",
  "subtypes": ["anime"],
  "name": "Name_of_Module",
  "version": "0.1.0",
  "formatVersion": 1,
  "updateUrl": "https://raw.githubusercontent.com/Eltik/anify-module/master/module.json",
  "general": {
    "author": "Your Name",
    "description": "Template module",
    "lang": ["en-US"],
    "baseURL": "https://someurl.com",
    "bgColor": "#4CB875",
    "fgColor": "#000000"
  }
}
```
**Please make sure that the `id` field must be unique.**

## Building Modules
As of now, building modules is all handled by the `Makefile` and `npm` packages. To build your code to see if there are errors, run `npm run build`. This will delete and recreate the `/dist/` directory and use `tsc` to build the code. To build a module, run `make build-module`. This will run `npm run build` and zip the code in the `/dist/` folder into a `.module` file. **If your module does not contain a name** and you have provided it in the `/src/metadata.json` file, make sure you have `jq` installed. You can install it via the following:
```bash
# Homebrew (MacOS users)
$ brew install jq

# Choco (MacOS users)
$ choco install jq
```