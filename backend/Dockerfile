FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

# ✅ Give permission to mvnw
RUN chmod +x mvnw

# ✅ Build project
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["sh", "-c", "java -jar target/*.jar"]