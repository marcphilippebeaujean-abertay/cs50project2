FROM python:3.6

RUN apt-get update
RUN apt-get install sudo
RUN apt-get install -y --no-install-recommends

COPY ./requirements.txt /project/requirements.txt

RUN pip3 install -r /project/requirements.txt

RUN rm -r /root/.cache

RUN mkdir templates

COPY ./templates/* ./templates/
COPY ./app.py .
COPY ./wsgi.py .

EXPOSE 9999

CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:9999", "wsgi:app", "--worker-class", "eventlet", "--reload"]