NAME := gary_voice_bot

build:
	docker build -t $(NAME) .

run:
	docker run -d --name $(NAME) $(NAME)

stop:
	docker stop $(NAME)

rm:
	docker rm $(NAME)

rmi:
	docker rmi $(NAME)

reset: 	stop rm rmi build run
