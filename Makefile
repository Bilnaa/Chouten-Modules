build: 
	rm ./dist -rf
	- tsc
	cp ./src/* ./dist/

push:
	- make build
	- adb shell "rm /sdcard/Documents/Chouten/Modules/Aniwatch.to -rf"
	- adb shell "mkdir /sdcard/Documents/Chouten/Modules/Aniwatch.to"
	adb push ./dist/* /sdcard/Documents/Chouten/Modules/Aniwatch.to/
