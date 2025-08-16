# Production Dockerfile for Splitwise Backend
# Multi-stage build for optimal image size and security

# Build Stage
FROM maven:3.9.4-openjdk-17-slim as build

# Set working directory
WORKDIR /app

# Copy POM file first (for better Docker layer caching)
COPY pom.xml .

# Download dependencies (cached if pom.xml hasn't changed)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# Production Stage
FROM openjdk:17-jre-slim

# Create non-root user for security
RUN addgroup --gid 1001 --system splitwise && \
    adduser --no-create-home --shell /bin/false --disabled-password --uid 1001 --system --group splitwise

# Install security updates and required packages
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    tzdata && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# Set timezone to UTC
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set working directory
WORKDIR /app

# Copy built JAR from build stage
COPY --from=build --chown=splitwise:splitwise /app/target/splitwise-backend-*.jar app.jar

# Create logs directory
RUN mkdir -p logs && chown -R splitwise:splitwise logs

# Switch to non-root user
USER splitwise

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# JVM optimization for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:+UseG1GC \
    -XX:+UseStringDeduplication \
    -XX:+OptimizeStringConcat \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.profiles.active=production"

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

# Labels for metadata
LABEL maintainer="Splitwise Team <devops@splitwise.com>"
LABEL version="1.0.0"
LABEL description="Splitwise Backend API - Production Ready"
LABEL org.opencontainers.image.source="https://github.com/splitwise/backend"
