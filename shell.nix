{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  nativeBuildInputs = with pkgs.buildPackages; [
    nodejs_20

    # For using nix to manage the node packages
    node2nix

    # Puppeteer
    google-chrome

    # To use ts-node
    nodePackages.typescript

    android-tools

    # Required to build the module
    gnumake
    jq
    zip
    # Useful for testing what the module contains
    unzip
  ];
  shellHook = ''
    export PUPPETEER_EXECUTABLE_PATH=$(which google-chrome-stable)
		echo -e "Once you have initialised your package and the \033[;4mcwd contains a package.json\033[0;0m, run \033[32;1mchouten-init-module\033[0m."
    alias chouten-init-module='node2nix && nix-build . && echo "{\"parser\":\"@typescript-eslint/parser\",\"plugins\":[\"@typescript-eslint\"],\"extends\":[\"eslint:recommended\",\"plugin:@typescript-eslint/recommended\"],\"rules\":{\"@typescript-eslint/ban-types\":\"warn\",\"@typescript-eslint/explicit-function-return-type\":\"off\",\"@typescript-eslint/explicit-module-boundary-types\":\"off\",\"@typescript-eslint/no-empty-function\":\"off\",\"@typescript-eslint/no-empty-interface\":\"off\",\"@typescript-eslint/no-explicit-any\":\"off\",\"@typescript-eslint/no-namespace\":\"off\",\"@typescript-eslint/no-loss-of-precision\":\"off\",\"@typescript-eslint/no-non-null-assertion\":\"off\",\"@typescript-eslint/no-non-null-asserted-optional-chain\":\"off\",\"@typescript-eslint/no-unnecessary-type-constraint\":\"warn\",\"@typescript-eslint/no-unused-vars\":\"off\",\"@typescript-eslint/no-var-requires\":\"warn\",\"no-console\":\"off\",\"no-empty\":\"warn\",\"no-prototype-builtins\":\"off\",\"no-redeclare\":\"warn\",\"no-useless-escape\":\"off\",\"no-async-promise-executor\":\"off\",\"prefer-const\":\"warn\",\"array-bracket-spacing\":[\"error\",\"never\"]}}" > .eslintrc'
  '';
}
