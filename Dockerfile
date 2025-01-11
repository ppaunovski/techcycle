FROM gradle:7.6-jdk17 AS build

WORKDIR /app

COPY . /app

RUN gradle build -x test

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/build/libs/*-SNAPSHOT.jar /app/app.jar


EXPOSE 8080
EXPOSE 5432

ENTRYPOINT ["java", "-jar", "app.jar"]