# Welcome to CSV-R Application - Backend!

Link to website: https://csv-r.netlify.app/

Link to frontend repo: https://github.com/NikhilRJ2017/CSV-Reader-Frontend


# Steps to install locally

Before installing npm modules and run the project, create '.env' file to the project with following entries: 

	-MONGO_DB_URI="add value"
  -CLOUDINARY_NAME="add value"
  -CLOUDINARY_API_KEY="add value"
  -CLOUDINARY_API_SECRET="add value"
  -CORS_ORIGIN="add value"
	-PORT="add value" (optional, default is 5000)


Now, add following commands to the project:
>npm install &&
>npm install nodemon -D &&
>npm start

App runs on the port 5000 or else provide port value in .env file
