FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

# ✅ Give permission to mvnw
RUN chmod +x mvnw

# ✅ Build project
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/tasks-0.0.1-SNAPSHOT.jar"]