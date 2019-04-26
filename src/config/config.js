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

process.env.SENDGRID_API_KEY='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'