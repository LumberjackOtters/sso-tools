FROM python:3.9-slim-buster

# set work directory
WORKDIR /app

RUN pip install poetry

# install dependencies
COPY . /app/
RUN poetry export -f requirements.txt | pip install -r /dev/stdin

CMD ["gunicorn"  , "-b", "0.0.0.0:8000", "app:app"]
