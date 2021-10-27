# Creation Club Organizer

Automatically organizes loose Creation Club files into named folders for easy
import into [Mod Organizer 2](https://www.modorganizer.org/).

## Installation

Requires [Deno](https://deno.land/). All scripts can be run from Deno using URLs
or compiled into executables. Run the commands in an **empty** folder.

## Specifying your games' install locations

For both the update and organize scripts, you can specify your Skyrim SE and
Fallout 4 install locations using either:

1. `--lib` pointing to your Steam library folder (containing a `steamapps`
   folder)
2. `--sse` or `--fo4` (or both) pointing to your Skyrim SE or Fallout 4 install
   folder

If you don't specify any of these, the script will assume the default Steam
install location on the C drive.

### Examples

```
--lib E:\SteamLibrary
--sse E:\Games\SkyrimSE
--sse E:\Games\SkyrimSE --fo4 E:\Games\Fallout4
```

## Compiling Executables

You can compile the scripts into executables using the `deno compile` command.
Any command line arguments will be passed to the script. Make sure to pass in
`-p` to prevent the scripts from closing when they finish. You can also pass in
Deno's `--allow` parameters to remove permission requests. Examples:

```bat
: Requests permissions as needed. Easiest.
deno compile https://github.com/FayneAldan/cc-organizer/raw/deno/update.ts -p --lib E:\SteamLibrary

: Grants specific permissions.
deno compile --allow-read=E:\SteamLibrary --allow-write=. --allow-net=api.bethesda.net https://github.com/FayneAldan/cc-organizer/raw/deno/update.ts -p --lib E:\SteamLibrary

: Grants all permissions. Not recommended. -A is short for --allow-all
deno compile -A https://github.com/FayneAldan/cc-organizer/raw/deno/update.ts -p --lib E:\SteamLibrary
```

## Updating the datbase

Any time new Creation Club files are added to Skyrim, the database must be
updated. This will also need to be done at least once before organizing.

```
deno run https://github.com/FayneAldan/cc-organizer/raw/deno/update.ts
```

## Organizing your CC files

WIP. This section will be updated once the organize script has been updated to
Deno.
