{
	description = "Chouten Module Builder (with Nix)";

	inputs = {
		nixpkgs.url = "github:NixOS/nixpkgs";
		flake-utils.url = "github:numtide/flake-utils";
	};
	outputs = {
		self,
		nixpkgs,
		flake-utils
	}: 
	flake-utils.lib.eachDefaultSystem(system:
			let
			pkgs = import nixpkgs { inherit system; };
			runCiLocally = pkgs.writeShellScriptBin "runLocalCi" ''
			CHOUTEN_START_DIR="$(pwd)"
			STARTING_REVISION="$(git rev-parse HEAD)"
			module_names=""
			metadata_list=()

			# Clear the build branch before we use it
			# Checkout into the "built" branch and build if not existing
			if [[ `git rev-parse built 2>/dev/null` ]]; then
				git checkout built
			else
				git checkout -b built
			fi
			rm -rf ./*
			git add -A .
			git commit -m "feat: cleared built folder" --no-verify
			git checkout main

			log_message() {
				printf "\033[33;1m%s\033[0;0m\n" "$1"
			}
			error_message() {
				printf "\033[31;1m%s\033[0;0m\n" "$1"
			}

			build_and_copy() {
				START_DIR="$(pwd)"

				for folder in */; do
					folder_name="''${folder%/}"
					log_message "Preparing to process folder $folder_name"

					cd "$folder_name"

					# Only read the metadata if the file exists && has content within it
					if [[ ! -f "./src/metadata.json" ]]; then
						error_message "ERROR! Subfolder $folder_name DOES NOT HAVE A METADATA FILE" 
						cd "$START_DIR" 
						continue
					fi
					metadata="$(cat ./src/metadata.json)"
					metadata_list+=("$metadata")

					log_message "Preparing to build module"
					if [[ ! -f "Makefile" ]]; then
						error_message "ERROR: Subfolder $folder_name DOES NOT CONTAIN A MAKEFILE" 
						cd "$START_DIR" 
						continue
					fi

					make build-module
					# Get the name of the module file
					module_name="$(find . -name '*.module' | head -n 1)"
					mv src/icon.png "$CHOUTEN_START_DIR/images/''${module_name%.module}.png"
					mv "$module_name" "$CHOUTEN_START_DIR"

					log_message "Adding $module_name to the Module Names Array"
					module_names="''${module_names}$module_name\n"

					log_message "Moved $module_name to $CHOUTEN_START_DIR"
					log_message "Removing artifact: $folder_name"
					cd "$START_DIR" && rm -rf "$folder_name"
				done
			}

			for directory in "Video" "Text" "Book"; do
				if [[ ! -d "$directory" ]]; then
						error_message "ERROR! Module Type $directory DOES NOT EXIST OR IS NOT A DIRECTORY" 
						cd "$START_DIR" 
						continue
				fi
				mkdir images
				
				# Reset the module names
				module_names=""

				cd $directory
				build_and_copy
				cd "$CHOUTEN_START_DIR"
				
				# Commit the changes
				rm .gitignore
				git add -A -f .
				git commit -m "feat: add modules" --no-verify

				git checkout built
				printf "%s" "$module_names" | sed "s/\\\n/\n/g" | while read -r module; do
						log_message "Retrieving (checkout) $module"
						git checkout main "$module"
				done
				git checkout main images
				printf "%s\n" "''${metadata_list[@]}" | jq -s . > files.json

				git add -A -f .
				git commit --amend -m "feat: add built modules" --no-verify
				git checkout main
				git reset --hard "$STARTING_REVISION"
			done
			'';
			in {
				devShells.default = pkgs.mkShell {
					buildInputs = [runCiLocally] ++ (with pkgs; [
							zip
							jq
							gnumake
							nodejs_20
							nodePackages.typescript
					]);
				};
			}
			);
}
