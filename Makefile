build:
	docker build -t testbot .

run:
	docker run -d -p 3000:3000 --name testbot --rm testbot
