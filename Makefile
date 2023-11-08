name = $(shell jq .name ./dist/metadata.json -r)
test:
	echo $(src_dir)
build: 
	rm ./dist -rf
	- tsc
	cp ./src/* ./dist/

build-module:
	- make build
	cd ./dist && zip ../$(name).module ./* -r && cd ..

push:
	- make build
	- adb shell "rm /sdcard/Documents/Chouten/Modules/$(name) -rf"
	- adb shell "mkdir /sdcard/Documents/Chouten/Modules/$(name)"
	adb push ./dist/* /sdcard/Documents/Chouten/Modules/$(name)/
