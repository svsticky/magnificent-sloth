{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = inputs: inputs.flake-utils.lib.eachDefaultSystem (
    system: let
      pkgs = inputs.nixpkgs.legacyPackages.${system};
      lib = pkgs.lib;

      dependencies = with pkgs; [
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
    in {
      devShells.default = pkgs.mkShell {
        LD_LIBRARY_PATH = lib.makeLibraryPath dependencies;

        NIX_CFLAGS_COMPILE = "-I${pkgs.pcsclite.dev}/include/PCSC";

        packages = with pkgs; [
          gnumake
          pcsclite
        ];
      };

      packages.default = let
        fs = lib.fileset;
        sourceFiles = fs.gitTracked ./.;
      in pkgs.buildNpmPackage {
        NIX_CFLAGS_COMPILE = "-I${pkgs.pcsclite.dev}/include/PCSC";

        pname = "magnificent-sloth";
        version = "1.0.0";
        src = fs.toSource {
          root = ./.;
          fileset = sourceFiles;
        };

        npmDepsHash = "sha256-aOtWsYo8b2F19/O3BkmAEPkzfRjpkjQB63Cl+nWNLQQ=";

        nativeBuildInputs = with pkgs; [
          nodejs_26
          gnumake
        ];

        buildInputs = dependencies ++ [pkgs.pcsclite];

        postInstall = ''
          echo foobar
          mv dist/linux-unpacked/magnificent-sloth $out/bin
          cp -r dist/linux-unpacked/ $out/share
        '';
      };
    }
  );
}
