{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = inputs: inputs.flake-utils.lib.eachDefaultSystem (
    system: let
      pkgs = inputs.nixpkgs.legacyPackages.${system};
      lib = pkgs.lib;
    in {
      devShells.default = pkgs.mkShell {
        LD_LIBRARY_PATH = with pkgs; lib.makeLibraryPath [
          alsa-lib
          at-spi2-core
          cairo
          cups
          dbus
          expat
          gdk-pixbuf
          glib
          gtk3
          libdrm
          libgbm
          libxcomposite
          libxdamage
          libxfixes
          libxrandr
          libxshmfence
          nspr
          nss
          pango
        ];

        NIX_CFLAGS_COMPILE = "-I${pkgs.pcsclite.dev}/include/PCSC";

        packages = with pkgs; [
          gnumake
          pcsclite
        ];
      };

      # packages.default = let
      # in pkgs.buildNpmPackage {
      #   pname = "magnificent-sloth";
      #   version = "1.0.0";

      #   src = ./.;

      #   npmDepsHash = "sha256-ZnF2gCPBmDCANcm2tUs+O2KpgwZpC1EgcEfl4EwdMjY=";

      #   nativeBuildInputs = [
      #     pkgs.nodejs_26
      #   ];

      #   buildPhase = ''
      #     runHook preBuild

      #     npm run build-semantic
      #     npm run build

      #     runHook postBuild
      #   '';

      #   installPhase = ''
      #     mkdir -p $out
      #     # Replace this with the actual files your application produces.
      #     cp -r dist $out/
      #   '';
      # };
    }
  );
}
