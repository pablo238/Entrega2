process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/cursos';
}
else {
    urlDB = ' mongodb+srv://nodejs:nodejs@fundamentos-nodejpbg-weuzl.mongodb.net/cursos?retryWrites=true'
   
}

process.env.URLDB = urlDB