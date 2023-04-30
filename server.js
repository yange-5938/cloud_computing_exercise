// require express and other modules
const express = require('express');
const app = express();
// Express Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Static File Directory
app.use(express.static(__dirname + '/public'));


/************
 * DATABASE *
 ************/

const db = require('./models');
const BooksModel = require('./models/books');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', (req, res) => {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  res.json({
    message: 'Welcome to my app api!',
    documentationUrl: '', //leave this also blank for the first exercise
    baseUrl: '', //leave this blank for the first exercise
    endpoints: [
      { method: 'GET', path: '/api', description: 'Describes all available endpoints' },
      { method: 'GET', path: '/api/profile', description: 'Data about me' },
      { method: 'GET', path: '/api/books/', description: 'Get All books information' },
      // TODO: Write other API end-points description here like above
      { method: 'Post', path: '/api/books/', description: 'Add a new book to database' },
      { method: 'PUT', path: '/api/books/:id', description: 'Edit information of a book' },
      { method: 'DELETE', path: '/api/books/:id', description: 'Delete a book' }
    ]
  })
});
// TODO:  Fill the values
app.get('/api/profile', (req, res) => {
  res.json({
    'name': 'yange',
    'homeCountry': 'China',
    'degreeProgram': ' Informatics',//informatics or CSE.. etc
    'email': 'yange.zheng@tum.de',
    'deployedURLLink': '',//leave this blank for the first exercise
    'apiDocumentationURL': '', //leave this also blank for the first exercise
    'currentCity': 'Germany',
    'hobbies': ['hobbiy1', 'hobbiy2']

  })
});
/*
 * Get All books information
 */
app.get('/api/books/', (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */
app.post('/api/books/', (req, res) => {

  /*
   * New Book information in req.body
   */
  console.log(req.body);
  /*
   * TODO: use the books model and create a new object
   * with the information in req.body
   */
  const {
    title, // title of the book
    author, // name of the first author
    releaseDate, // release date of the book
    genre, //like fiction or non fiction
    rating, // rating if you have read it out of 5
    language,// language in which the book is released
  } = req.body;

  var newBook = BooksModel({ title, author, releaseDate, genre, rating, language })
  newBook.save(function (err) {
    if (err) return handleError(err);
    // saved!
  });

  /*
   * return the new book information object as json
   */

  res.json(newBook);
});

/*
 * Update a book information based upon the specified ID
 */
app.put('/api/books/:id', (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;
  console.log(`book ID = ${bookId} \n Book Data = ${bookNewData}`);

  /*
   * TODO: use the books model and find using the bookId and update the book information
   */

  BooksModel.updateOne({ _id: bookId }, { title: bookNewData.title, author: bookNewData.author, releaseDate: bookNewData.releaseDate, genre: bookNewData.genre, rating: bookNewData.rating, language: bookNewData.language }, function (err, res) {
    // Updated at most one doc, `res.nModified` contains the number
    // of docs that MongoDB updated
  });

  /*
   * Send the updated book information as a JSON object
   */
  var updatedBookInfo = {};
  res.json(updatedBookInfo);
});
/*
 * Delete a book based upon the specified ID
 */
app.delete('/api/books/:id', (req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;
  /*
   * TODO: use the books model and find using
   * the bookId and delete the book
   */
  BooksModel.deleteOne({ _id: bookId }, function (err) {
    if (err) return handleError(err);
    // deleted at most one tank document
  });

  /*
   * Send the deleted book information as a JSON object
   */
  var deletedBook = {};
  res.json(deletedBook);
});


/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});
