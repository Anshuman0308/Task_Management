$env:DB_URL="jdbc:mysql://localhost:3306/task_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
$env:JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
$env:JWT_EXPIRATION="86400000"
$env:CORS_ALLOWED_ORIGIN="http://localhost:3000"

mvn spring-boot:run -Dskip.frontend=true
