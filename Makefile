all: help

.PHONY: run
run: install restart

.PHONY: help
help:
	@echo "- fetch          Pull the latest commit from the remote repository"
	@echo "- build		Build a new deb package"
	@echo "- install	Build and install a new deb file"
	@echo "- restart	Restart the Magnificent Sloth application"
	@echo "- run		install, restart"

.PHONY: fetch
fetch:
	git pull

.PHONY: build
build: fetch
	rm -rf ./dist
	npm run build

.PHONY: install
install: build
	sudo apt install ./dist/installers/*.deb --reinstall

.PHONY: restart
restart:
	sudo systemctl restart sway@tty1.service
