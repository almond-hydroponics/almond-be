FROM gitpod/workspace-full:latest
FROM gitpod/workspace-mongodb

RUN bash -c ". .nvm/nvm.sh \
    && nvm install 14.14.0 \
    && nvm use 14.14.0 \
    && nvm alias default 14.14.0"

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix
RUN npm install -g yarn
