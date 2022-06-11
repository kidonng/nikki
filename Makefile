avif:
	npx -y avif --verbose --input "images/*.jpg"

webp:
	npx -y kidonng/avif-cli#webp --verbose --input "images/*.jpg"

tar:
	tar czf images.tar.gz images
