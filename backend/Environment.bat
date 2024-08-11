docker pull postgres
docker run --name database -p 5432:5432 -e POSTGRES_PASSWORD=admin -d postgres 
echo Place this in ENV DATABSE_URL="postgres://postgres:admin@localhost:5432"
pause