build:
	docker build -t gary_voice_bot --build-arg CACHEBUST=$(date +%s) .

run:
	docker run -d -p 3000:3000 --name gary_voice_bot --restart always gary_voice_bot
