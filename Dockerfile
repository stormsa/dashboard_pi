FROM alpine:latest
RUN apk add --no-cache python3 && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
    if [[ ! -e /usr/bin/python ]]; then ln -sf /usr/bin/python3 /usr/bin/python; fi && \
    rm -r /root/.cache
RUN apk add --update nodejs nodejs-npm
RUN mkdir -p /app
COPY . /app
WORKDIR /app/Front
RUN npm install 
RUN npm run build:production
RUN cp -r dist ../Server/
RUN cp -r public ../Server/
WORKDIR /app/Server
RUN pip3 install -r requirements.txt
ENTRYPOINT ["python3"]
CMD ["server.py"]