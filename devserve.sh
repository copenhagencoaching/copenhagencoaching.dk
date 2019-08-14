#! /bin/bash

docker run \
  -it \
  --rm  \
  --pid=host \
  -v /$(pwd)://app:rw \
  --workdir //app  \
  --publish 80:4000 \
  lakruzz/jekyll-plus jekyll serve --config _config.yml,_dev_config.yml --watch