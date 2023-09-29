#!/bin/bash
echo ' give me the star, thank ~'
echo '+------------------------------------------------------+'
echo '|               github: bincooo/worker-laf             |'
echo '|                   please wait ...                    |'
echo '+------------------------------------------------------+'
echo ' '

# 换成自己的
git clone https://github.com/bincooo/worker-laf.git /app/main
cd /app/main
pnpm i
pnpm run dev -y