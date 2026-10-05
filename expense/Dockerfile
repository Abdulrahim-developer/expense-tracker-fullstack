# ==========================================
# Stage 1: Build the application artifact
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy the configuration pom and project source code tree
COPY pom.xml .
COPY src ./src

# Compile and package the executable production JAR without running local tests
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Create the minimal execution container
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the compiled JAR artifact securely from the build stage environment
COPY --from=build /app/target/expense-0.0.1-SNAPSHOT.jar app.jar

# Expose the internal network port gateway
EXPOSE 8080

# Launch command routine to boot up your Spring Boot application server instance
ENTRYPOINT ["java", "-jar", "app.jar"]
