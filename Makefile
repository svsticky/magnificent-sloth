all: help

.PHONY: run
run: install restart

.PHONY: help
help:
	@echo "- build		Build a new deb package"
	@echo "- install	Build and install a new deb file"
	@echo "- restart	Restart the Magnificent Sloth application"
	@echo "- run		install, restart"

.PHONY: build
build:
	yes | rm -fr ./dist
	npm run build

.PHONY: install
install: build
	sudo apt install ./dist/installers/*.deb --reinstall

.PHONY: build
restart:
	sudo systemctl restart sway@tty1.service